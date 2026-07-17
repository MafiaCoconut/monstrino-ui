import {
  isApiError,
  isNetworkError,
  isTimeoutError,
  isValidationError,
  isMalformedApiResponseError,
} from "./http";

/**
 * Adapter between API errors and entity page outcomes.
 *
 * This is the single place where future backend resolver responses (roadmap
 * WP2.3: stale slug → 301, tombstone → 301-to-survivor or 410) map onto UI
 * behavior. Pages must branch on this classification, never on raw HTTP
 * status codes, so activating real 410/redirect handling later is a change
 * in exactly one module.
 *
 * Current activation state:
 *  - "not-found"  → notFound() (real HTTP 404). ACTIVE.
 *  - "gone"       → PREPARED, NOT ACTIVE: the current backend has no
 *    tombstones and never returns 410, so this branch is unreachable today.
 *    When WP2.3 ships, "gone" must surface an actual HTTP 410 (route-handler
 *    or proxy-level emission — see the UI foundation doc, "410 activation").
 *    Until then callers treat it as "not-found" — never a fabricated 410.
 *  - "redirected" → PREPARED: reserved for the WP2.3 canonical-replacement
 *    301 flow; the UI never performs tombstone/slug resolution itself.
 */
export type EntityStatus =
  | { kind: "not-found" }
  | { kind: "gone" }
  | { kind: "unauthorized" }
  | { kind: "rate-limited" }
  | { kind: "unavailable" }
  | { kind: "malformed" }
  | { kind: "error"; error: unknown };

export function classifyEntityError(err: unknown): EntityStatus {
  if (isApiError(err)) {
    if (err.status === 404) return { kind: "not-found" };
    if (err.status === 410) return { kind: "gone" };
    if (err.status === 401 || err.status === 403) return { kind: "unauthorized" };
    if (err.status === 429) return { kind: "rate-limited" };
    if (err.status >= 500) return { kind: "unavailable" };
    return { kind: "error", error: err };
  }
  if (isNetworkError(err) || isTimeoutError(err)) return { kind: "unavailable" };
  if (isValidationError(err) || isMalformedApiResponseError(err)) {
    return { kind: "malformed" };
  }
  return { kind: "error", error: err };
}

/** True when the entity should render the 404 page (includes not-yet-activated "gone"). */
export function isMissingEntity(status: EntityStatus): boolean {
  return status.kind === "not-found" || status.kind === "gone";
}
