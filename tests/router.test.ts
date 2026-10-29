import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cacheEnabled: false,
  cache: new Map<string, unknown>(),
  getAsyncRoutes: vi.fn(),
  handleWholeMenus: vi.fn(),
  handleTags: vi.fn(),
  addRoute: vi.fn(),
  hasRoute: vi.fn(() => false)
}));

vi.mock("@/api/routes", () => ({ getAsyncRoutes: mocks.getAsyncRoutes }));
vi.mock("@/config", () => ({
  getConfig: () => ({ CachingAsyncRoutes: mocks.cacheEnabled }),
  responsiveStorageNameSpace: () => "admin-starter-"
}));
vi.mock("@/router/index", () => ({
  router: { addRoute: mocks.addRoute, hasRoute: mocks.hasRoute }
}));
vi.mock("@/utils/auth", () => ({ userKey: "admin-starter-user-info" }));
vi.mock("@/layout/types", () => ({ routerArrays: [] }));
vi.mock("@/store/modules/permission", () => ({
  usePermissionStoreHook: () => ({
    handleWholeMenus: mocks.handleWholeMenus,
    flatteningRoutes: []
  })
}));
vi.mock("@/store/modules/multiTags", () => ({
  useMultiTagsStoreHook: () => ({
    getMultiTagsCache: false,
    handleTags: mocks.handleTags
  })
}));
vi.mock("@pureadmin/utils", () => ({
  cloneDeep: (value: unknown) => structuredClone(value),
  storageLocal: () => ({
    getItem: (key: string) => mocks.cache.get(key),
    setItem: (key: string, value: unknown) => mocks.cache.set(key, value),
    removeItem: (key: string) => mocks.cache.delete(key)
  })
}));

import { initRouter } from "@/router/utils";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.cacheEnabled = false;
  mocks.cache.clear();
  mocks.getAsyncRoutes.mockResolvedValue({ code: 0, message: "", data: [] });
});

describe("route initialization", () => {
  it("propagates request failure so login can stop loading and retry", async () => {
    const error = new Error("Network unavailable");
    mocks.getAsyncRoutes.mockRejectedValueOnce(error);
    await expect(initRouter()).rejects.toBe(error);
    expect(mocks.handleWholeMenus).not.toHaveBeenCalled();
  }, 500);

  it("rejects unsuccessful business responses", async () => {
    mocks.getAsyncRoutes.mockResolvedValueOnce({
      code: 403,
      message: "Menu access denied",
      data: []
    });
    await expect(initRouter()).rejects.toThrow("Menu access denied");
    expect(mocks.handleWholeMenus).not.toHaveBeenCalled();
  });

  it("rejects a malformed menu payload before registering routes", async () => {
    mocks.getAsyncRoutes.mockResolvedValueOnce({ code: 0, data: null });
    await expect(initRouter()).rejects.toThrow("Invalid menu response");
    expect(mocks.handleWholeMenus).not.toHaveBeenCalled();
  }, 500);

  it("initializes static menus and the fallback for an empty dynamic menu", async () => {
    await initRouter();
    expect(mocks.handleWholeMenus).toHaveBeenCalledWith([]);
    expect(mocks.addRoute).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/:pathMatch(.*)*" })
    );
  });

  it("reuses an empty menu cache from this app's namespace", async () => {
    mocks.cacheEnabled = true;
    mocks.cache.set("admin-starter-async-routes", []);
    await initRouter();
    expect(mocks.getAsyncRoutes).not.toHaveBeenCalled();
    expect(mocks.handleWholeMenus).toHaveBeenCalledWith([]);
  });

  it("stores the menu only in this app's namespace", async () => {
    mocks.cacheEnabled = true;
    await initRouter();
    expect(mocks.cache.get("admin-starter-async-routes")).toEqual([]);
    expect(mocks.cache.has("async-routes")).toBe(false);
  });
});
