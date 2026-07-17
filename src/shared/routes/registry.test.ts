import { describe, expect, it } from "vitest";
import {
  ROUTE_REGISTRY,
  routes,
  canonicalUrl,
  isInternalPath,
  sitemapEligibleRoutes,
} from "./registry";
import { isValidSlugParam, isValidIdParam } from "./params";

describe("route registry invariants", () => {
  it("never marks a private route indexable or sitemap-eligible", () => {
    for (const route of ROUTE_REGISTRY.filter((r) => r.visibility === "private")) {
      expect(route.indexable, route.name).toBe(false);
      expect(route.sitemap, route.name).toBe(false);
    }
  });

  it("never marks a planned route indexable or sitemap-eligible", () => {
    for (const route of ROUTE_REGISTRY.filter((r) => r.status === "planned")) {
      expect(route.indexable, route.name).toBe(false);
      expect(route.sitemap, route.name).toBe(false);
    }
  });

  it("sitemap-eligible routes are exactly active public sitemap routes", () => {
    for (const route of sitemapEligibleRoutes()) {
      expect(route.status).toBe("active");
      expect(route.visibility).toBe("public");
      expect(route.pattern.startsWith("/admin")).toBe(false);
    }
  });

  it("every planned route declares its backend prerequisite", () => {
    for (const route of ROUTE_REGISTRY.filter((r) => r.status === "planned")) {
      expect(route.backendPrerequisite, route.name).toBeTruthy();
    }
  });

  it("favorites and legacy redirects are excluded from sitemap and indexing", () => {
    for (const name of [
      "favorites",
      "legacy-hub-pet-redirect",
      "legacy-hub-series-redirect",
    ]) {
      const route = ROUTE_REGISTRY.find((r) => r.name === name);
      expect(route?.indexable).toBe(false);
      expect(route?.sitemap).toBe(false);
    }
  });

  it("CSR-only entity lists are noindex and out of sitemap until WP10.2", () => {
    for (const name of ["character-catalog", "pet-catalog", "series-catalog"]) {
      const route = ROUTE_REGISTRY.find((r) => r.name === name);
      expect(route?.indexable, name).toBe(false);
      expect(route?.sitemap, name).toBe(false);
    }
    // Their SSR detail pages stay indexable.
    for (const name of ["character-detail", "pet-detail", "series-detail"]) {
      const route = ROUTE_REGISTRY.find((r) => r.name === name);
      expect(route?.indexable, name).toBe(true);
      expect(route?.sitemap, name).toBe(true);
    }
  });

  it("duplicate /info legal routes are registered as non-indexable redirects to /legal", () => {
    for (const [name, target] of [
      ["info-privacy-redirect", "legal-privacy"],
      ["info-terms-redirect", "legal-terms"],
      ["info-impressum-redirect", "legal-impressum"],
    ]) {
      const route = ROUTE_REGISTRY.find((r) => r.name === name);
      expect(route?.indexable, name).toBe(false);
      expect(route?.sitemap, name).toBe(false);
      expect(route?.compatibilityOf, name).toBe(target);
      // Exactly one indexable canonical URL per legal document.
      const canonical = ROUTE_REGISTRY.find((r) => r.name === target);
      expect(canonical?.indexable, target).toBe(true);
    }
  });
});

describe("route builders", () => {
  it("URI-encodes dynamic segments", () => {
    expect(routes.releaseDetail("a/b?c")).toBe("/catalog/r/a%2Fb%3Fc");
    expect(routes.characterDetail("<img>")).toBe("/catalog/c/%3Cimg%3E");
  });

  it("builds canonical URLs without query parameters", () => {
    const url = canonicalUrl(routes.releaseCatalog());
    expect(url).toMatch(/^https?:\/\/[^/]+\/catalog\/r$/);
    expect(url).not.toContain("?");
  });

  it("rejects non-absolute paths in canonicalUrl", () => {
    expect(() => canonicalUrl("catalog/r")).toThrow();
  });
});

describe("isInternalPath (open-redirect guard)", () => {
  it("accepts same-site absolute paths", () => {
    expect(isInternalPath("/catalog/r")).toBe(true);
    expect(isInternalPath("/")).toBe(true);
  });

  it("rejects external and malformed targets", () => {
    expect(isInternalPath("https://evil.com")).toBe(false);
    expect(isInternalPath("//evil.com")).toBe(false);
    expect(isInternalPath("/a\\evil.com")).toBe(false);
    expect(isInternalPath("javascript:alert(1)")).toBe(false);
    expect(isInternalPath("relative/path")).toBe(false);
  });
});

describe("path parameter validation", () => {
  it("accepts realistic slugs and ids", () => {
    expect(isValidSlugParam("draculaura-core-doll-2022")).toBe(true);
    expect(isValidIdParam("42")).toBe(true);
    expect(isValidIdParam("018f6a2b-3c4d-7e8f-9a0b-1c2d3e4f5a6b")).toBe(true);
  });

  it("rejects traversal and markup in params", () => {
    expect(isValidSlugParam("../etc/passwd")).toBe(false);
    expect(isValidSlugParam("a b")).toBe(false);
    expect(isValidSlugParam("<script>")).toBe(false);
    expect(isValidIdParam("")).toBe(false);
  });
});
