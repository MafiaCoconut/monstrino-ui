import type {
  BaseApiDto,
  BrandedId,
  EntityAudit,
  EntityRef,
  Generation,
  HexColor,
  ISODateString,
  UrlString,
} from "@entities/shared";

// ─── ID ───────────────────────────────────────────────────────────────────────

export type ReleaseId = BrandedId<"ReleaseId">;

// ─── Enums / const unions ─────────────────────────────────────────────────────

export const RELEASE_TYPES = [
  "Basic",
  "Signature",
  "Collector",
  "Skullector",
  "Playset",
  "Multipack",
  "Fashion Pack",
  "Vehicle",
  "SDCC Exclusive",
  "Creeproduction",
] as const;
export type ReleaseType = (typeof RELEASE_TYPES)[number];

export const RELEASE_RARITIES = ["Common", "Uncommon", "Rare", "Ultra Rare", "Grail"] as const;
export type ReleaseRarity = (typeof RELEASE_RARITIES)[number];

export type ReleaseTag =
  | "Exclusive"
  | "SDCC"
  | "Limited"
  | "Reboot"
  | "Anniversary"
  | "Collab"
  | string;

export type ReleaseStockStatus =
  | "in_stock"
  | "out_of_stock"
  | "preorder"
  | "limited"
  | "unknown";

export type ReleaseVariantStatus =
  | "current"
  | "available"
  | "upcoming"
  | "discontinued"
  | string;

// ─── API DTO (raw backend shape, snake_case) ──────────────────────────────────

export interface ReleasePricingRegionApiDto {
  code: string;
  currency: string;
  msrp: number;
  market: number;
  flag?: string | null;
  msrp_note?: string | null;
  market_note?: string | null;
  recent_sales_count?: number | null;
}

export interface ReleaseVariantApiDto {
  type: string;
  name: string;
  year?: number | string | null;
  status: string;
  sku?: string | null;
}

export interface ReleaseApiDto extends BaseApiDto {
  subtitle?: string | null;
  generation?: string | null;
  release_date?: string | null;
  release_date_label?: string | null;
  release_types?: string[] | null;
  pack_size?: number | null;
  rarity?: string | null;
  tags?: string[] | null;
  sku?: string | null;
  stock_status?: string | null;
  stock_status_label?: string | null;
  rating_average?: number | null;
  rating_count?: number | null;
  character_name?: string | null;
  character_id?: string | number | null;
  series_name?: string | null;
  series_id?: string | number | null;
  year?: number | null;
  image_url?: string | null;
  price_display?: string | null;
  is_exclusive?: boolean | null;
  pricing?: ReleasePricingRegionApiDto[] | null;
  variants?: ReleaseVariantApiDto[] | null;
}

// ─── Domain Model ─────────────────────────────────────────────────────────────

export interface ReleasePricingRegion {
  code: string;
  currency: string;
  msrp: number;
  market: number;
  flag?: string;
  msrpNote?: string;
  marketNote?: string;
  recentSalesCount?: number;
}

export interface ReleaseVariant {
  type: string;
  name: string;
  year?: number | string;
  status: ReleaseVariantStatus;
  sku?: string;
}

export interface ReleaseRatingSummary {
  average: number;
  count: number;
}

/** Full domain model — used on detail pages */
export interface ReleaseModel extends EntityAudit {
  id: ReleaseId;
  name: string;
  displayName: string;
  description?: string;
  subtitle?: string;
  generation?: Generation;
  releaseDate?: ISODateString;
  releaseDateLabel?: string;
  releaseTypes: ReleaseType[];
  packSize?: number;
  rarity?: ReleaseRarity;
  tags: ReleaseTag[];
  sku?: string;
  stockStatus: ReleaseStockStatus;
  stockStatusLabel?: string;
  rating?: ReleaseRatingSummary;
  characterName: string;
  characterId?: string;
  seriesName: string;
  seriesId?: string;
  year?: number;
  imageUrl?: UrlString;
  price?: string;
  isExclusive: boolean;
  pricing: ReleasePricingRegion[];
  variants: ReleaseVariant[];
  // Extended fields populated from separate API calls or enriched response
  characters?: EntityRef[];
  series?: EntityRef[];
  pets?: EntityRef[];
}

/** Lightweight shape — used in catalog listings and cards */
export interface ReleaseSummary {
  id: ReleaseId;
  name: string;
  characterName: string;
  seriesName: string;
  year?: number;
  imageUrl?: UrlString;
  price?: string;
  isExclusive: boolean;
  rarity?: ReleaseRarity;
  stockStatus: ReleaseStockStatus;
}

export interface ReleaseFilters {
  generations?: Generation[];
  releaseTypes?: ReleaseType[];
  rarities?: ReleaseRarity[];
  tags?: ReleaseTag[];
  badge?: HexColor;
}
