import { releaseApiDtoSchema } from "./schema";
import type {
  ReleaseApiDto,
  ReleaseModel,
  ReleasePricingRegion,
  ReleaseSummary,
  ReleaseStockStatus,
  ReleaseRarity,
  ReleaseType,
  ReleaseVariant,
} from "./types";
import { GENERATIONS, type Generation } from "@entities/shared";
import { RELEASE_RARITIES, RELEASE_TYPES } from "./types";

function toId(raw: string | number | null | undefined): string {
  return raw != null ? String(raw) : "";
}

function toGeneration(raw: string | null | undefined): Generation | undefined {
  if (!raw) return undefined;
  return GENERATIONS.includes(raw as Generation) ? (raw as Generation) : undefined;
}

function toRarity(raw: string | null | undefined): ReleaseRarity | undefined {
  if (!raw) return undefined;
  return RELEASE_RARITIES.includes(raw as ReleaseRarity) ? (raw as ReleaseRarity) : undefined;
}

function toReleaseTypes(raw: string[] | null | undefined): ReleaseType[] {
  if (!raw) return [];
  return raw.filter((t): t is ReleaseType => RELEASE_TYPES.includes(t as ReleaseType));
}

function toStockStatus(raw: string | null | undefined): ReleaseStockStatus {
  const valid: ReleaseStockStatus[] = ["in_stock", "out_of_stock", "preorder", "limited", "unknown"];
  if (raw && valid.includes(raw as ReleaseStockStatus)) return raw as ReleaseStockStatus;
  return "unknown";
}

function toPricingRegions(
  raw: ReleaseApiDto["pricing"],
): ReleasePricingRegion[] {
  if (!raw) return [];
  return raw.map((r) => ({
    code: r.code,
    currency: r.currency,
    msrp: r.msrp,
    market: r.market,
    flag: r.flag ?? undefined,
    msrpNote: r.msrp_note ?? undefined,
    marketNote: r.market_note ?? undefined,
    recentSalesCount: r.recent_sales_count ?? undefined,
  }));
}

function toVariants(raw: ReleaseApiDto["variants"]): ReleaseVariant[] {
  if (!raw) return [];
  return raw.map((v) => ({
    type: v.type,
    name: v.name,
    year: v.year ?? undefined,
    status: v.status,
    sku: v.sku ?? undefined,
  }));
}

/**
 * Validates and maps a raw backend DTO to a typed ReleaseModel.
 * Throws ZodError if the DTO does not match the expected schema.
 */
export function releaseFromApiDto(raw: unknown): ReleaseModel {
  const dto = releaseApiDtoSchema.parse(raw);
  const id = toId(dto.id);
  const displayName = dto.display_name || dto.name || id;

  return {
    id: id as ReleaseModel["id"],
    name: dto.name || displayName,
    displayName,
    description: dto.description ?? undefined,
    subtitle: dto.subtitle ?? undefined,
    generation: toGeneration(dto.generation),
    releaseDate: dto.release_date ?? undefined,
    releaseDateLabel: dto.release_date_label ?? undefined,
    releaseTypes: toReleaseTypes(dto.release_types),
    packSize: dto.pack_size ?? undefined,
    rarity: toRarity(dto.rarity),
    tags: dto.tags ?? [],
    sku: dto.sku ?? undefined,
    stockStatus: toStockStatus(dto.stock_status),
    stockStatusLabel: dto.stock_status_label ?? undefined,
    rating:
      dto.rating_average != null
        ? { average: dto.rating_average, count: dto.rating_count ?? 0 }
        : undefined,
    characterName: dto.character_name || "",
    characterId: dto.character_id != null ? String(dto.character_id) : undefined,
    seriesName: dto.series_name || "",
    seriesId: dto.series_id != null ? String(dto.series_id) : undefined,
    year: dto.year ?? undefined,
    imageUrl: dto.image_url ?? undefined,
    price: dto.price_display ?? undefined,
    isExclusive: dto.is_exclusive ?? false,
    pricing: toPricingRegions(dto.pricing),
    variants: toVariants(dto.variants),
    createdAt: dto.created_at ?? undefined,
    updatedAt: dto.updated_at ?? undefined,
  };
}

/** Maps a ReleaseModel to its lightweight summary shape */
export function releaseToSummary(model: ReleaseModel): ReleaseSummary {
  return {
    id: model.id,
    name: model.name,
    characterName: model.characterName,
    seriesName: model.seriesName,
    year: model.year,
    imageUrl: model.imageUrl,
    price: model.price,
    isExclusive: model.isExclusive,
    rarity: model.rarity,
    stockStatus: model.stockStatus,
  };
}
