// ─── Primitive value types ───────────────────────────────────────────────────

export type ISODateString = string;
export type UrlString = string;
export type HexColor = `#${string}`;

// ─── Branded IDs ─────────────────────────────────────────────────────────────

/**
 * Creates a nominal string type to prevent accidental ID mixups.
 * e.g. ReleaseId cannot be passed where SeriesId is expected.
 */
export type BrandedId<T extends string> = string & { readonly __brand: T };

// ─── Generations ─────────────────────────────────────────────────────────────

export const GENERATIONS = ["G1", "G2", "G3"] as const;
export type Generation = (typeof GENERATIONS)[number];

// ─── Shared entity interfaces ─────────────────────────────────────────────────

export interface EntityRef<TId extends string = string> {
  id: TId;
  name: string;
}

export interface EntityAudit {
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

// ─── Shared API DTO base ──────────────────────────────────────────────────────

/** Fields present on every backend entity response */
export interface BaseApiDto {
  id?: string | number | null;
  name?: string | null;
  display_name?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
