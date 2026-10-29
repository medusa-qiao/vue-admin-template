import type { AxiosAdapter } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Isolate browser storage/navigation; exercise the actual HTTP interceptor chain.
const session = vi.hoisted(() => ({
  getToken: vi.fn(),
  refresh: vi.fn(),
  logout: vi.fn(),
  message: vi.fn()
}));

vi.mock("@/utils/auth", () => ({
  getToken: session.getToken,
  formatToken: (token: string) => `Bearer ${token}`
}));
vi.mock("@/store/modules/user", () => ({
  useUserStoreHook: () => ({
    handRefreshToken: session.refresh,
    logOut: session.logout
  })
}));
vi.mock("@/utils/message", () => ({ message: session.message }));
vi.mock("@/plugins/i18n", () => ({
  $t: (key: string) => key,
  transformI18n: (key: string) => key
}));

const envelope = { code: 0, message: "ok", data: { name: "example" } };

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function createAdapter(data: unknown = envelope) {
  const requests: Parameters<AxiosAdapter>[0][] = [];
  const adapter: AxiosAdapter = async config => {
    requests.push(config);
    return { data, status: 200, statusText: "OK", headers: {}, config };
  };
  return { adapter, requests };
}

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  session.logout.mockResolvedValue(undefined);
  session.getToken.mockReturnValue({
    accessToken: "current-access-token",
    refreshToken: "current-refresh-token",
    expires: Date.now() + 60_000
  });
});

afterEach(() => vi.unstubAllEnvs());

describe("HTTP contract", () => {
  it("returns the full business envelope and sends the access token", async () => {
    const { http } = await import("../src/utils/http");
    const { adapter, requests } = createAdapter();

    await expect(http.request("get", "/items", { adapter })).resolves.toEqual({
      code: 0,
      message: "ok",
      data: { name: "example" }
    });
    expect(requests[0].headers.get("Authorization")).toBe(
      "Bearer current-access-token"
    );
  });

  it("preserves a business error envelope for the caller to handle", async () => {
    const { http } = await import("../src/utils/http");
    const { adapter } = createAdapter({
      code: 10001,
      message: "Validation failed",
      data: null
    });

    await expect(http.request("post", "/items", { adapter })).resolves.toEqual({
      code: 10001,
      message: "Validation failed",
      data: null
    });
  });

  it("still authenticates a request that has a customization callback", async () => {
    const { http } = await import("../src/utils/http");
    const { adapter, requests } = createAdapter();

    await http.request(
      "get",
      "/items",
      { adapter },
      {
        beforeRequestCallback: config => {
          config.headers["X-Feature"] = "example";
        }
      }
    );

    expect(requests[0].headers.get("X-Feature")).toBe("example");
    expect(requests[0].headers.get("Authorization")).toBe(
      "Bearer current-access-token"
    );
  });

  it("uses the configured API base URL", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.test");
    const { http } = await import("../src/utils/http");
    const { adapter, requests } = createAdapter();

    await http.request("get", "/items", { adapter });

    expect(requests[0].baseURL).toBe("https://api.example.test");
  });

  it("authenticates after a callback replaces the request headers", async () => {
    const { http } = await import("../src/utils/http");
    const { adapter, requests } = createAdapter();

    await http.request(
      "get",
      "/items",
      { adapter },
      {
        beforeRequestCallback: config => {
          config.headers = { "X-Feature": "replacement" };
        }
      }
    );

    expect(requests[0].headers.get("X-Feature")).toBe("replacement");
    expect(requests[0].headers.get("Authorization")).toBe(
      "Bearer current-access-token"
    );
  });

  it.each(["/login", "/refresh-token"])(
    "does not attach or refresh credentials for %s",
    async url => {
      session.getToken.mockReturnValue({
        accessToken: "expired-access-token",
        refreshToken: "current-refresh-token",
        expires: Date.now() - 1
      });
      const { http } = await import("../src/utils/http");
      const { adapter, requests } = createAdapter();

      await http.request("post", url, { adapter });

      expect(requests[0].headers.get("Authorization")).toBeUndefined();
      expect(session.refresh).not.toHaveBeenCalled();
    }
  );
});

describe("expired access token", () => {
  beforeEach(() => {
    session.getToken.mockReturnValue({
      accessToken: "expired-access-token",
      refreshToken: "current-refresh-token",
      expires: Date.now() - 1
    });
  });

  it("shares one refresh and sends all waiting requests with the fresh token", async () => {
    const refresh = deferred<{
      code: number;
      message: string;
      data: { accessToken: string; refreshToken: string; expires: string };
    }>();
    session.refresh.mockReturnValue(refresh.promise);
    const { http } = await import("../src/utils/http");
    const { adapter, requests } = createAdapter();

    const pending = Promise.all([
      http.request("get", "/items/1", { adapter }),
      http.request("get", "/items/2", { adapter })
    ]);
    await vi.waitFor(() => expect(session.refresh).toHaveBeenCalledTimes(1));
    expect(requests).toHaveLength(0);
    refresh.resolve({
      code: 0,
      message: "ok",
      data: {
        accessToken: "fresh-access-token",
        refreshToken: "fresh-refresh-token",
        expires: new Date(Date.now() + 60_000).toISOString()
      }
    });

    await expect(pending).resolves.toEqual([envelope, envelope]);
    expect(requests.map(config => config.headers.get("Authorization"))).toEqual(
      ["Bearer fresh-access-token", "Bearer fresh-access-token"]
    );
    expect(session.refresh).toHaveBeenCalledExactlyOnceWith({
      refreshToken: "current-refresh-token"
    });
  });

  it("rejects every waiting request and ends the session once if refresh fails", async () => {
    const refresh = deferred<never>();
    const failure = new Error("Refresh rejected");
    session.refresh.mockReturnValue(refresh.promise);
    const { http } = await import("../src/utils/http");
    const { adapter, requests } = createAdapter();

    const pending = Promise.allSettled([
      http.request("get", "/items/1", { adapter }),
      http.request("get", "/items/2", { adapter })
    ]);
    await vi.waitFor(() => expect(session.refresh).toHaveBeenCalledTimes(1));
    refresh.reject(failure);

    const outcomes = await pending;
    expect(outcomes).toEqual([
      { status: "rejected", reason: failure },
      { status: "rejected", reason: failure }
    ]);
    expect(requests).toHaveLength(0);
    expect(session.logout).toHaveBeenCalledTimes(1);
    expect(session.message).toHaveBeenCalledTimes(1);
  }, 1_000);
});
