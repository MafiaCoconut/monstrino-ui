/**
 * Authoritative UI route registry.
 *
 * Single source of truth for: route patterns, route builders, visibility,
 * indexability, sitemap eligibility, entity identity, implementation status
 * and the backend roadmap slice that unlocks each planned route.
 *
 * Rules enforced here (and by registry.test.ts):
 *  - `planned` routes are metadata only: never rendered, never linked in
 *    public navigation, never in the sitemap, never indexable.
 *  - private (admin) routes are never indexable and never in the sitemap.
 *  - all dynamic segments are URI-encoded by the builders.
 *
 * URL compatibility boundary (accepted target architecture):
 *  Release identity will move to `/releases/{stable_id}-{slug}` once the
 *  backend resolver exists (roadmap slice WP2.3: id-prefix parse → 200/301,
 *  stale slug → 301, tombstone → 301/410). Until then the UI keeps the
 *  working slug route `/catalog/r/{slug}` and MUST NOT invent stable IDs —
 *  the current API does not provide them.
 */

import { siteUrl } from "@shared/config/env";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RouteStatus = "active" | "planned";
export type RouteVisibility = "public" | "private";

export interface RouteDefinition {
  /** Stable route name. */
  name: string;
  /** Next.js route pattern (or PROVISIONAL target pattern for planned routes). */
  pattern: string;
  status: RouteStatus;
  visibility: RouteVisibility;
  /** May this route ever be served with an indexable robots directive? */
  indexable: boolean;
  /** Include in sitemap while status is "active" (never for planned/private). */
  sitemap: boolean;
  /** Entity identity the route resolves, if any. */
  entity?:
    | "release"
    | "release-version"
    | "character"
    | "pet"
    | "series"
    | "product-line"
    | "component";
  /** Backend capability that unlocks a planned route (roadmap slice). */
  backendPrerequisite?: string;
  /** Path is not final and must not be linked or announced. */
  provisional?: boolean;
  /** Route this one exists to keep compatible (e.g. legacy redirects). */
  compatibilityOf?: string;
  notes?: string;
}

// ─── Path builders (active routes only) ──────────────────────────────────────

const seg = (value: string | number): string => encodeURIComponent(String(value));

export const routes = {
  home: () => "/",
  releaseCatalog: () => "/catalog/r",
  releaseDetail: (slug: string) => `/catalog/r/${seg(slug)}`,
  characterCatalog: () => "/catalog/c",
  characterDetail: (id: string | number) => `/catalog/c/${seg(id)}`,
  petCatalog: () => "/catalog/p",
  petDetail: (id: string | number) => `/catalog/p/${seg(id)}`,
  seriesCatalog: () => "/catalog/s",
  seriesDetail: (id: string | number) => `/catalog/s/${seg(id)}`,
  favorites: () => "/favorites",
  info: () => "/info",
  infoAbout: () => "/info/about",
  infoContact: () => "/info/contact",
  infoSupport: () => "/info/support",
  legal: () => "/legal",
  legalTerms: () => "/legal/terms",
  legalPrivacy: () => "/legal/privacy",
  legalImpressum: () => "/legal/impressum",
} as const;

// ─── Canonical URL builder ───────────────────────────────────────────────────

/** Absolute canonical URL for an internal path. Never carries query params. */
export function canonicalUrl(path: string): string {
  const base = siteUrl.replace(/\/$/, "");
  if (!path.startsWith("/")) {
    throw new Error(`canonicalUrl expects an absolute internal path, got: ${path}`);
  }
  return `${base}${path}`;
}

/**
 * Open-redirect guard: true only for same-site absolute paths.
 * Rejects protocol-relative (`//evil.com`), absolute URLs and backslash tricks.
 */
export function isInternalPath(path: string): boolean {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("\\") &&
    !path.includes("://")
  );
}

// ─── Registry ────────────────────────────────────────────────────────────────

export const ROUTE_REGISTRY: RouteDefinition[] = [
  // Active public routes
  {
    name: "home",
    pattern: "/",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
  },
  {
    name: "release-catalog",
    pattern: "/catalog/r",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
    entity: "release",
  },
  {
    name: "release-detail",
    pattern: "/catalog/r/[slug]",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
    entity: "release",
    notes:
      "Slug-identity compatibility route. Target identity is /releases/{stable_id}-{slug} (WP2.3); this route stays valid through backend 301s after migration.",
  },
  {
    name: "character-catalog",
    pattern: "/catalog/c",
    status: "active",
    visibility: "public",
    indexable: false,
    sitemap: false,
    entity: "character",
    notes:
      "CSR-only list (server shell, client-fetched content). noindex, follow with clean self-canonical until meaningful first-page content is server-rendered (WP10.2 list DTOs); then flip indexable+sitemap here.",
  },
  {
    name: "character-detail",
    pattern: "/catalog/c/[internal_id]",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
    entity: "character",
  },
  {
    name: "pet-catalog",
    pattern: "/catalog/p",
    status: "active",
    visibility: "public",
    indexable: false,
    sitemap: false,
    entity: "pet",
    notes:
      "CSR-only list. Same activation condition as character-catalog (WP10.2).",
  },
  {
    name: "pet-detail",
    pattern: "/catalog/p/[internal_id]",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
    entity: "pet",
  },
  {
    name: "series-catalog",
    pattern: "/catalog/s",
    status: "active",
    visibility: "public",
    indexable: false,
    sitemap: false,
    entity: "series",
    notes:
      "CSR-only list. Same activation condition as character-catalog (WP10.2).",
  },
  {
    name: "series-detail",
    pattern: "/catalog/s/[internal_id]",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
    entity: "series",
  },
  {
    name: "favorites",
    pattern: "/favorites",
    status: "active",
    visibility: "public",
    indexable: false,
    sitemap: false,
    notes: "Local-only user state (localStorage). noindex; excluded from sitemap and robots-allowed crawl budget.",
  },
  {
    name: "info",
    pattern: "/info",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
  },
  {
    name: "info-about",
    pattern: "/info/about",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
  },
  {
    name: "info-contact",
    pattern: "/info/contact",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
  },
  {
    name: "info-support",
    pattern: "/info/support",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
  },
  {
    name: "legal",
    pattern: "/legal",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
  },
  {
    name: "legal-terms",
    pattern: "/legal/terms",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
  },
  {
    name: "legal-privacy",
    pattern: "/legal/privacy",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
  },
  {
    name: "legal-impressum",
    pattern: "/legal/impressum",
    status: "active",
    visibility: "public",
    indexable: true,
    sitemap: true,
  },
  {
    name: "info-privacy-redirect",
    pattern: "/info/privacy",
    status: "active",
    visibility: "public",
    indexable: false,
    sitemap: false,
    compatibilityOf: "legal-privacy",
    notes: "308 permanent redirect (next.config redirects) — /legal/* is the canonical legal family.",
  },
  {
    name: "info-terms-redirect",
    pattern: "/info/terms",
    status: "active",
    visibility: "public",
    indexable: false,
    sitemap: false,
    compatibilityOf: "legal-terms",
    notes: "308 permanent redirect — see info-privacy-redirect.",
  },
  {
    name: "info-impressum-redirect",
    pattern: "/info/impressum",
    status: "active",
    visibility: "public",
    indexable: false,
    sitemap: false,
    compatibilityOf: "legal-impressum",
    notes: "308 permanent redirect — see info-privacy-redirect.",
  },
  {
    name: "legacy-hub-pet-redirect",
    pattern: "/p/[id]",
    status: "active",
    visibility: "public",
    indexable: false,
    sitemap: false,
    compatibilityOf: "pet-detail",
    notes: "Redirects to /catalog/p/{id}.",
  },
  {
    name: "legacy-hub-series-redirect",
    pattern: "/s/[id]",
    status: "active",
    visibility: "public",
    indexable: false,
    sitemap: false,
    compatibilityOf: "series-detail",
    notes: "Redirects to /catalog/s/{id}.",
  },

  // Planned public routes — metadata only. Never rendered, linked or indexed.
  {
    name: "release-detail-stable",
    pattern: "/releases/[stable_id]-[slug]",
    status: "planned",
    visibility: "public",
    indexable: false,
    sitemap: false,
    entity: "release",
    backendPrerequisite: "WP2.3 — public resolver {stable_id}-{slug} + 301/410",
    notes: "Accepted target URL identity. Requires backend stable-ID resolution; UI must not invent stable IDs.",
  },
  {
    name: "release-version-detail",
    pattern: "/releases/[stable_id]-[slug]/versions/[version_id]",
    status: "planned",
    visibility: "public",
    indexable: false,
    sitemap: false,
    entity: "release-version",
    backendPrerequisite: "WP4 — ReleaseVersion + identity classification",
    provisional: true,
  },
  {
    name: "product-line-detail",
    pattern: "/lines/[line_id]",
    status: "planned",
    visibility: "public",
    indexable: false,
    sitemap: false,
    entity: "product-line",
    backendPrerequisite: "WP10 — extended public DTO (lines/series activation)",
    provisional: true,
  },
  {
    name: "search",
    pattern: "/search",
    status: "planned",
    visibility: "public",
    indexable: false,
    sitemap: false,
    backendPrerequisite: "WP10.2 — Postgres FTS search + filters",
    provisional: true,
    notes: "Search results are noindex, follow by policy even once active.",
  },
  {
    name: "release-offers",
    pattern: "/catalog/r/[slug]#offers",
    status: "planned",
    visibility: "public",
    indexable: false,
    sitemap: false,
    backendPrerequisite: "WP9 — offers and price observations",
    provisional: true,
    notes: "Offers/price history render as sections of the release page, not standalone routes, unless WP9 DTO forces otherwise.",
  },

  // Private routes — always noindex, never in sitemap, behind the auth boundary.
  {
    name: "admin-dashboard",
    pattern: "/admin",
    status: "planned",
    visibility: "private",
    indexable: false,
    sitemap: false,
    backendPrerequisite: "WP6.3 — admin API + auth (static bearer token)",
  },
  {
    name: "admin-review-queues",
    pattern: "/admin/review",
    status: "planned",
    visibility: "private",
    indexable: false,
    sitemap: false,
    backendPrerequisite: "WP6.1–6.3 — workflow schema, accept/reject, admin API",
  },
  {
    name: "admin-sources",
    pattern: "/admin/sources",
    status: "planned",
    visibility: "private",
    indexable: false,
    sitemap: false,
    backendPrerequisite: "WP6.3 — admin ingestion endpoints",
  },
  {
    name: "admin-media-review",
    pattern: "/admin/media",
    status: "planned",
    visibility: "private",
    indexable: false,
    sitemap: false,
    backendPrerequisite: "WP7.4 — media review + takedown endpoints",
  },
  {
    name: "admin-ai-review",
    pattern: "/admin/ai",
    status: "planned",
    visibility: "private",
    indexable: false,
    sitemap: false,
    backendPrerequisite: "WP8.3 — admin AI surface",
  },
];

// ─── Derived views ───────────────────────────────────────────────────────────

/** Routes eligible for sitemap inclusion. */
export function sitemapEligibleRoutes(): RouteDefinition[] {
  return ROUTE_REGISTRY.filter(
    (r) => r.status === "active" && r.visibility === "public" && r.sitemap,
  );
}

export function findRoute(name: string): RouteDefinition | undefined {
  return ROUTE_REGISTRY.find((r) => r.name === name);
}
