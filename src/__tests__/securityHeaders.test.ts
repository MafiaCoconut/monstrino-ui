import { describe, expect, it } from "vitest";
import nextConfig, { buildContentSecurityPolicy } from "../../next.config";

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

async function getHeaderRules(): Promise<HeaderRule[]> {
  return (await nextConfig.headers!()) as HeaderRule[];
}

function findRule(rules: HeaderRule[], source: string): HeaderRule | undefined {
  return rules.find((r) => r.source === source);
}

describe("security headers", () => {
  it("applies the baseline headers to every route", async () => {
    const rules = await getHeaderRules();
    const all = findRule(rules, "/:path*");
    expect(all).toBeDefined();
    const keys = all!.headers.map((h) => h.key);
    expect(keys).toContain("Content-Security-Policy");
    expect(keys).toContain("X-Content-Type-Options");
    expect(keys).toContain("Referrer-Policy");
    expect(keys).toContain("Permissions-Policy");
    expect(keys).toContain("X-Frame-Options");

    const get = (k: string) => all!.headers.find((h) => h.key === k)!.value;
    expect(get("X-Content-Type-Options")).toBe("nosniff");
    expect(get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(get("X-Frame-Options")).toBe("DENY");
  });

  it("marks admin and api namespaces noindex via X-Robots-Tag", async () => {
    const rules = await getHeaderRules();
    for (const source of ["/admin/:path*", "/api/:path*"]) {
      const rule = findRule(rules, source);
      expect(rule, source).toBeDefined();
      const robots = rule!.headers.find((h) => h.key === "X-Robots-Tag");
      expect(robots?.value).toContain("noindex");
      expect(robots?.value).toContain("nofollow");
    }
  });
});

describe("content security policy", () => {
  const csp = buildContentSecurityPolicy();

  it("never allows unsafe-eval or wildcard script sources", () => {
    expect(csp).not.toContain("unsafe-eval");
    const scriptSrc = csp.split(";").find((d) => d.trim().startsWith("script-src"))!;
    expect(scriptSrc).toBeDefined();
    expect(scriptSrc).not.toMatch(/\s\*\s|\s\*$/);
    expect(scriptSrc).not.toContain("https://*");
  });

  it("denies framing and plugin content", () => {
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
  });

  it("restricts image sources to self, data/blob and Monstrino-owned hosts", () => {
    const imgSrc = csp.split(";").find((d) => d.trim().startsWith("img-src"))!;
    expect(imgSrc).toContain("'self'");
    expect(imgSrc).toContain("https://*.monstrino.com");
    // no bare wildcard
    expect(imgSrc).not.toMatch(/\s\*(\s|$)/);
  });
});

describe("legal redirects", () => {
  it("permanently redirects duplicate /info legal routes to /legal", async () => {
    const redirects = await nextConfig.redirects!();
    for (const [source, destination] of [
      ["/info/privacy", "/legal/privacy"],
      ["/info/terms", "/legal/terms"],
      ["/info/impressum", "/legal/impressum"],
    ]) {
      const rule = redirects.find((r) => r.source === source);
      expect(rule, source).toBeDefined();
      expect(rule!.destination).toBe(destination);
      expect(rule!.permanent).toBe(true);
    }
  });
});

describe("image remote patterns", () => {
  it("only allows Monstrino-owned hosts (plus localhost outside production)", () => {
    const patterns = nextConfig.images!.remotePatterns!;
    for (const pattern of patterns) {
      const hostname = (pattern as { hostname: string }).hostname;
      expect(
        hostname === "*.monstrino.com" || hostname === "localhost",
        `unexpected image host: ${hostname}`,
      ).toBe(true);
    }
  });
});
