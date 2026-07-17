/**
 * Central query-parameter policy for canonicalization and indexing.
 *
 * Classes:
 *  - pagination:  `page` — kept out of canonical; paginated views are
 *    noindex, follow (page 1 canonicalizes to the base path).
 *  - sorting:     canonicalize to the base page, noindex, follow.
 *  - filtering:   arbitrary filter combinations are never indexable;
 *    only explicitly curated landing pages (none exist yet) may be.
 *  - tracking:    never part of canonical, never affect indexing.
 *  - ui-only:     view toggles etc.; never canonical, never indexing-relevant.
 *
 * Unknown parameters are treated as filtering (fail closed: noindex).
 */

export type QueryParamClass =
  | "pagination"
  | "sorting"
  | "filtering"
  | "tracking"
  | "ui-only";

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "ref",
]);

const SORTING_PARAMS = new Set(["sort", "order"]);
const PAGINATION_PARAMS = new Set(["page"]);
const UI_ONLY_PARAMS = new Set(["view"]);

export function classifyQueryParam(name: string): QueryParamClass {
  const key = name.toLowerCase();
  if (TRACKING_PARAMS.has(key) || key.startsWith("utm_")) return "tracking";
  if (SORTING_PARAMS.has(key)) return "sorting";
  if (PAGINATION_PARAMS.has(key)) return "pagination";
  if (UI_ONLY_PARAMS.has(key)) return "ui-only";
  return "filtering";
}

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

/**
 * Indexing decision for a listing page given its query parameters.
 * Tracking and ui-only params alone keep the page indexable (canonical points
 * at the clean base path); anything content-affecting → noindex, follow.
 */
export function isIndexableWithParams(params: SearchParamsRecord | undefined): boolean {
  if (!params) return true;
  return Object.entries(params).every(
    ([name, value]) =>
      value === undefined ||
      ["tracking", "ui-only"].includes(classifyQueryParam(name)),
  );
}

/** Canonical for a parameterized listing is always the clean base path. */
export function canonicalPathForParams(basePath: string): string {
  return basePath;
}
