import { describe, expect, it } from "vitest";
import { clearNamespacedStorage } from "../src/utils/storage";

class MemoryStorage implements Storage {
  private entries = new Map<string, string>();

  get length() {
    return this.entries.size;
  }

  key(index: number) {
    return [...this.entries.keys()][index] ?? null;
  }

  getItem(key: string) {
    return this.entries.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.entries.set(key, value);
  }

  removeItem(key: string) {
    this.entries.delete(key);
  }

  clear() {
    this.entries.clear();
  }
}

describe("application cache reset", () => {
  it("removes all current namespace entries and preserves other applications", () => {
    const storage = new MemoryStorage();
    storage.setItem("admin-starter-layout", "layout");
    storage.setItem("admin-starter-menu-search-history", "history");
    storage.setItem("admin-starter-menu-search-collect", "collection");
    storage.setItem("other-app-layout", "other layout");
    storage.setItem("admin-starter2-layout", "similar prefix");
    storage.setItem("menu-search-history", "legacy shared history");

    clearNamespacedStorage(storage, "admin-starter-");

    expect(storage.getItem("admin-starter-layout")).toBeNull();
    expect(storage.getItem("admin-starter-menu-search-history")).toBeNull();
    expect(storage.getItem("admin-starter-menu-search-collect")).toBeNull();
    expect(storage.getItem("other-app-layout")).toBe("other layout");
    expect(storage.getItem("admin-starter2-layout")).toBe("similar prefix");
    expect(storage.getItem("menu-search-history")).toBe(
      "legacy shared history"
    );
  });

  it("does not clear storage when the namespace is absent", () => {
    const storage = new MemoryStorage();
    storage.setItem("other-app-layout", "keep");

    clearNamespacedStorage(storage, "");

    expect(storage.getItem("other-app-layout")).toBe("keep");
    expect(storage.length).toBe(1);
  });
});
