import type { Generation } from "@entities/shared";
import type { ReleaseType, ReleaseRarity, ReleaseTag } from "@entities/release";

// ─── Filter types (4.1) ───────────────────────────────────────────────────────

export interface ReleasesFilter {
  q?: string;
  generations?: Generation[];
  series?: string[];
  characters?: string[];
  releaseTypes?: ReleaseType[];
  rarities?: ReleaseRarity[];
  tags?: ReleaseTag[];
  sort?: ReleaseSortKey;
}

// ─── Sort types (4.5) ─────────────────────────────────────────────────────────

export type ReleaseSortKey = "releaseDate" | "name" | "rarity";

export interface SortOption {
  value: ReleaseSortKey;
  label: string;
}

export const RELEASE_SORT_OPTIONS: SortOption[] = [
  { value: "releaseDate", label: "Release Date" },
  { value: "name", label: "Name (A-Z)" },
  { value: "rarity", label: "Rarity" },
];

export const VALID_SORT_KEYS: ReleaseSortKey[] = ["releaseDate", "name", "rarity"];

// ─── URL param keys ───────────────────────────────────────────────────────────

export const FILTER_PARAM_KEYS = {
  q: "q",
  generations: "gen",
  series: "series",
  characters: "char",
  releaseTypes: "type",
  rarities: "rarity",
  tags: "tag",
  sort: "sort",
} as const satisfies Record<keyof ReleasesFilter, string>;
