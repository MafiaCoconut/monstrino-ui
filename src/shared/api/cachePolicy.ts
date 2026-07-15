/**
 * Cache policy for the active (canonical release) catalog slice.
 *
 * `ReleaseVisibilityStatus.HIDDEN` is an operational kill switch: the API
 * hides a release immediately, and no UI cache layer may keep serving it
 * for longer than 5 minutes without manual intervention. For an immediate
 * purge, operators use the server-side `/api/revalidate` endpoint with the
 * tags below (see docs/monstrino-audit/RELEASE_VISIBILITY_CACHE_RUNBOOK.md
 * in the root repository).
 *
 * Every cache layer of the release slice (Next.js ISR, server fetch
 * revalidate, React Query staleTime) must stay at or below this bound.
 */
export const RELEASE_MAX_STALE_SECONDS = 300;

/** Same bound in milliseconds, for React Query staleTime. */
export const RELEASE_MAX_STALE_MS = RELEASE_MAX_STALE_SECONDS * 1000;

/** Cache tag for a single release detail page; slug comes from the API. */
export function releaseDetailTag(slug: string): string {
  return `release-${slug}`;
}

/** Cache tag shared by the release list, home featured, and sitemap fetches. */
export const RELEASE_LIST_TAG = "release-list";
