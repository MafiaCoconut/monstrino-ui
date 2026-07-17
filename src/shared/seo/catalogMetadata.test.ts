import { describe, expect, it, vi } from "vitest";

vi.mock("./siteUrl", () => ({
  getSiteUrl: () => "https://monstrino.test",
}));

import { buildCatalogMetadata } from "./catalogMetadata";

describe("buildCatalogMetadata", () => {
  it("indexable list without params: index, follow with clean canonical", async () => {
    const meta = await buildCatalogMetadata("Release Catalog", "/catalog/r", {});
    expect(meta.robots).toEqual({ index: true, follow: true });
    expect(meta.alternates?.canonical).toBe("https://monstrino.test/catalog/r");
  });

  it("query params force noindex, follow and keep the clean canonical", async () => {
    const meta = await buildCatalogMetadata("Release Catalog", "/catalog/r", { page: "2" });
    expect(meta.robots).toEqual({ index: false, follow: true });
    expect(meta.alternates?.canonical).toBe("https://monstrino.test/catalog/r");
  });

  it("route-level indexable:false (CSR-only lists) forces noindex even without params", async () => {
    const meta = await buildCatalogMetadata("Character Catalog", "/catalog/c", {}, {
      indexable: false,
    });
    expect(meta.robots).toEqual({ index: false, follow: true });
    expect(meta.alternates?.canonical).toBe("https://monstrino.test/catalog/c");
  });
});
