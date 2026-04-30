import { seriesApiDtoSchema } from "./schema";
import type {
  SeriesApiDto,
  SeriesModel,
  SeriesSummary,
  SeriesColor,
  SeriesDoll,
  SeriesPricing,
  SeriesType,
  SeriesStatus,
} from "./types";
import { SERIES_TYPES } from "./types";
import type { Generation } from "@entities/shared";
import { GENERATIONS } from "@entities/shared";

function toId(raw: string | number | null | undefined): string {
  return raw != null ? String(raw) : "";
}

function toGeneration(raw: string | null | undefined): Generation | undefined {
  if (!raw) return undefined;
  return GENERATIONS.includes(raw as Generation) ? (raw as Generation) : undefined;
}

function toSeriesType(raw: string | null | undefined): SeriesType | undefined {
  if (!raw) return undefined;
  return SERIES_TYPES.includes(raw as SeriesType) ? (raw as SeriesType) : undefined;
}

function toColorPalette(raw: SeriesApiDto["color_palette"]): SeriesColor[] {
  if (!raw) return [];
  return raw.map((c) => ({
    hex: c.hex as SeriesColor["hex"],
    name: c.name,
  }));
}

function toDolls(raw: SeriesApiDto["dolls"]): SeriesDoll[] {
  if (!raw) return [];
  return raw.map((d) => ({
    id: String(d.id),
    releaseId: d.release_id != null ? String(d.release_id) : undefined,
    character: d.character,
    variant: d.variant ?? undefined,
    rarity: d.rarity ?? undefined,
    year: d.year ?? undefined,
    msrp: d.msrp ?? undefined,
    imageUrl: d.image_url ?? undefined,
  }));
}

function toPricing(raw: SeriesApiDto["pricing"]): SeriesPricing | undefined {
  if (!raw) return undefined;
  return {
    msrpRange: raw.msrp_range,
    currentMarketRange: raw.current_market_range,
    rarityDistribution: raw.rarity_distribution
      ? {
          common: raw.rarity_distribution.common,
          rare: raw.rarity_distribution.rare,
          ultraRare: raw.rarity_distribution.ultra_rare,
        }
      : undefined,
    demandLevel: raw.demand_level ?? undefined,
  };
}

/**
 * Validates and maps a raw backend DTO to a typed SeriesModel.
 * Throws ZodError if the DTO does not match the expected schema.
 */
export function seriesFromApiDto(raw: unknown): SeriesModel {
  const dto = seriesApiDtoSchema.parse(raw);
  const id = toId(dto.id);
  const displayName = dto.display_name || dto.name || id;

  return {
    id: id as SeriesModel["id"],
    name: dto.name || displayName,
    displayName,
    description: dto.description ?? undefined,
    generation: toGeneration(dto.generation),
    yearStart: dto.year_start ?? undefined,
    yearEnd: dto.year_end ?? undefined,
    seriesType: toSeriesType(dto.series_type),
    status: (dto.status as SeriesStatus) ?? undefined,
    releaseYears: dto.release_years ?? undefined,
    concept: dto.concept ?? undefined,
    releaseCount: dto.release_count ?? undefined,
    characterCount: dto.character_count ?? undefined,
    yearLabel: dto.year_label ?? undefined,
    imageUrl: dto.image_url ?? undefined,
    colorPalette: toColorPalette(dto.color_palette),
    dolls: toDolls(dto.dolls),
    pricing: toPricing(dto.pricing),
    createdAt: dto.created_at ?? undefined,
    updatedAt: dto.updated_at ?? undefined,
  };
}

/** Maps a SeriesModel to its lightweight summary shape */
export function seriesToSummary(model: SeriesModel): SeriesSummary {
  return {
    id: model.id,
    name: model.name,
    releaseCount: model.releaseCount,
    characterCount: model.characterCount,
    yearLabel: model.yearLabel,
    imageUrl: model.imageUrl,
  };
}
