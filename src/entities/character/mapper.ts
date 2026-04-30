import { characterApiDtoSchema } from "./schema";
import type { CharacterModel, CharacterSummary } from "./types";
import type { Generation, HexColor } from "@entities/shared";
import { GENERATIONS } from "@entities/shared";

function toId(raw: string | number | null | undefined): string {
  return raw != null ? String(raw) : "";
}

function toGenerations(raw: string[] | null | undefined): Generation[] {
  if (!raw) return [];
  return raw.filter((g): g is Generation => GENERATIONS.includes(g as Generation));
}

function toHexColor(raw: string | null | undefined): HexColor | undefined {
  if (!raw) return undefined;
  return raw.startsWith("#") ? (raw as HexColor) : (`#${raw}` as HexColor);
}

/**
 * Validates and maps a raw backend DTO to a typed CharacterModel.
 * Throws ZodError if the DTO does not match the expected schema.
 */
export function characterFromApiDto(raw: unknown): CharacterModel {
  const dto = characterApiDtoSchema.parse(raw);
  const id = toId(dto.id);
  const displayName = dto.display_name || dto.name || id;

  return {
    id: id as CharacterModel["id"],
    name: dto.name || displayName,
    displayName,
    description: dto.description ?? undefined,
    species: dto.species || "",
    origin: dto.origin ?? undefined,
    releaseCount: dto.release_count ?? undefined,
    imageUrl: dto.image_url ?? undefined,
    accentColor: toHexColor(dto.accent_color),
    generations: toGenerations(dto.generations),
    seriesAppearances: dto.series_appearances ?? [],
    tags: dto.tags ?? [],
    createdAt: dto.created_at ?? undefined,
    updatedAt: dto.updated_at ?? undefined,
  };
}

/** Maps a CharacterModel to its lightweight summary shape */
export function characterToSummary(model: CharacterModel): CharacterSummary {
  return {
    id: model.id,
    name: model.name,
    species: model.species,
    releaseCount: model.releaseCount,
    imageUrl: model.imageUrl,
    accentColor: model.accentColor,
  };
}
