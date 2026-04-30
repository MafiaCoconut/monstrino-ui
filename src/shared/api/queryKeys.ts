/**
 * Centralized React Query key factory.
 *
 * All query keys live here to:
 *  - Prevent cache key collisions between different hooks
 *  - Enable precise cache invalidation (invalidate all 'release' queries at once)
 *  - Make key structure easy to reason about
 *
 * Usage:
 *   queryKeys.release.detail('123')  → ['release', 'detail', '123']
 *   queryKeys.release.list('all')    → ['release', 'list', 'all']
 */

export const queryKeys = {
  release: {
    all: () => ["release"] as const,
    list: (signature = "all") => ["release", "list", signature] as const,
    detail: (id: string) => ["release", "detail", id] as const,
  },

  series: {
    all: () => ["series"] as const,
    list: () => ["series", "list"] as const,
    detail: (id: string) => ["series", "detail", id] as const,
  },

  character: {
    all: () => ["character"] as const,
    list: () => ["character", "list"] as const,
    detail: (id: string) => ["character", "detail", id] as const,
  },

  pet: {
    all: () => ["pet"] as const,
    list: () => ["pet", "list"] as const,
    detail: (id: string) => ["pet", "detail", id] as const,
  },
} as const;
