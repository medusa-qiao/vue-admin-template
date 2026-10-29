import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WritableComputedRef } from "vue";

const state = vi.hoisted(() => ({
  configuredLocale: "zh",
  storage: new Map<string, { locale: string }>()
}));

vi.mock("@/config", () => ({
  getConfig: () => ({ Locale: state.configuredLocale }),
  responsiveStorageNameSpace: () => "admin-starter-"
}));
vi.mock("@pureadmin/utils", () => ({
  storageLocal: () => ({
    getItem: (key: string) => state.storage.get(key),
    setItem: (key: string, value: { locale: string }) =>
      state.storage.set(key, value)
  })
}));
vi.mock("../locales/en.yaml", () => ({ default: {} }));
vi.mock("../locales/zh-CN.yaml", () => ({ default: {} }));

import { i18n, initializeLocale } from "@/plugins/i18n";

beforeEach(() => {
  state.configuredLocale = "zh";
  state.storage.clear();
  (i18n.global.locale as WritableComputedRef<string>).value = "zh";
});

describe("language initialization after platform configuration", () => {
  it("prefers the saved language in the configured app namespace", () => {
    state.storage.set("admin-starter-locale", { locale: "en" });
    state.storage.set("undefinedlocale", { locale: "zh" });
    initializeLocale();
    expect((i18n.global.locale as WritableComputedRef<string>).value).toBe(
      "en"
    );
  });

  it("uses the configured language without a supported saved preference", () => {
    state.configuredLocale = "en";
    initializeLocale();
    expect((i18n.global.locale as WritableComputedRef<string>).value).toBe(
      "en"
    );
    state.storage.set("admin-starter-locale", { locale: "unsupported" });
    initializeLocale();
    expect(state.storage.get("admin-starter-locale")).toEqual({ locale: "en" });
  });

  it("falls back to Chinese and normalizes unsupported stored values", () => {
    state.configuredLocale = "unsupported";
    state.storage.set("admin-starter-locale", { locale: "unsupported" });
    initializeLocale();
    expect((i18n.global.locale as WritableComputedRef<string>).value).toBe(
      "zh"
    );
    expect(state.storage.get("admin-starter-locale")).toEqual({ locale: "zh" });
  });
});
