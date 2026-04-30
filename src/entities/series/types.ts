import type {
  BaseApiDto,
  BrandedId,
  EntityAudit,
  Generation,
  HexColor,
  UrlString,
} from "@entities/shared";

// ─── ID ───────────────────────────────────────────────────────────────────────

export type SeriesId = BrandedId<"SeriesId">;

// ─── Enums / const unions ─────────────────────────────────────────────────────

export const SERIES_TYPES = [
  "Mainline",
  "Special",
  "Convention",
  "Reboot",
  "Collector",
] as const;
export type SeriesType = (typeof SERIES_TYPES)[number];

export type SeriesStatus = "Completed" | "Ongoing" | "Archived" | string;

// ─── API DTO (raw backend shape, snake_case) ──────────────────────────────────

export interface SeriesColorApiDto {
  hex: string;
  name: string;
}

export interface SeriesDollApiDto {
  id: string | number;
  release_id?: string | number | null;
  character: string;
  variant?: string | null;
  rarity?: string | null;
  year?: string | number | null;
  msrp?: string | null;
  image_url?: string | null;
}

export interface SeriesPricingApiDto {
  msrp_range: string;
  current_market_range: string;
  rarity_distribution?: {
    common: number;
    rare: number;
    ultra_rare: number;
  } | null;
  demand_level?: string | null;
}

export interface SeriesApiDto extends BaseApiDto {
  generation?: string | null;
  year_start?: number | null;
  year_end?: number | null;
  series_type?: string | null;
  status?: string | null;
  release_years?: string | null;
  concept?: string | null;
  release_count?: number | null;
  character_count?: number | null;
  year_label?: string | null;
  image_url?: string | null;
  color_palette?: SeriesColorApiDto[] | null;
  dolls?: SeriesDollApiDto[] | null;
  pricing?: SeriesPricingApiDto | null;
}

// ─── Domain Model ─────────────────────────────────────────────────────────────

export interface SeriesColor {
  hex: HexColor;
  name: string;
}

export interface SeriesDoll {
  id: string;
  releaseId?: string;
  character: string;
  variant?: string;
  rarity?: string;
  year?: string | number;
  msrp?: string;
  imageUrl?: UrlString;
}

export interface SeriesPricing {
  msrpRange: string;
  currentMarketRange: string;
  rarityDistribution?: {
    common: number;
    rare: number;
    ultraRare: number;
  };
  demandLevel?: string;
}

/** Full domain model — used on series detail pages */
export interface SeriesModel extends EntityAudit {
  id: SeriesId;
  name: string;
  displayName: string;
  description?: string;
  generation?: Generation;
  yearStart?: number;
  yearEnd?: number;
  seriesType?: SeriesType;
  status?: SeriesStatus;
  releaseYears?: string;
  concept?: string;
  releaseCount?: number;
  characterCount?: number;
  yearLabel?: string;
  imageUrl?: UrlString;
  colorPalette: SeriesColor[];
  dolls: SeriesDoll[];
  pricing?: SeriesPricing;
}

/** Lightweight shape — used in catalog listings and cards */
export interface SeriesSummary {
  id: SeriesId;
  name: string;
  releaseCount?: number;
  characterCount?: number;
  yearLabel?: string;
  imageUrl?: UrlString;
}
