import { petApiDtoSchema } from "./schema";
import type {
  PetModel,
  PetSummary,
  PetOwnerRef,
  PetReleaseRef,
  PetRarity,
  PetExclusivity,
} from "./types";
import type { Generation } from "@entities/shared";
import { GENERATIONS } from "@entities/shared";

function toId(raw: string | number | null | undefined): string {
  return raw != null ? String(raw) : "";
}

function toGeneration(raw: string | null | undefined): Generation | undefined {
  if (!raw) return undefined;
  return GENERATIONS.includes(raw as Generation) ? (raw as Generation) : undefined;
}

function toRarity(raw: string | null | undefined): PetRarity | undefined {
  const valid: PetRarity[] = ["common", "rare", "exclusive", "limited"];
  if (raw && valid.includes(raw as PetRarity)) return raw as PetRarity;
  return undefined;
}

function toExclusivity(raw: string | null | undefined): PetExclusivity | undefined {
  const valid: PetExclusivity[] = ["exclusive", "shared", "limited"];
  if (raw && valid.includes(raw as PetExclusivity)) return raw as PetExclusivity;
  return undefined;
}

function toOwners(raw: ReturnType<typeof petApiDtoSchema.parse>["owners"]): PetOwnerRef[] {
  if (!raw) return [];
  return raw.map((o) => ({
    id: String(o.id) as PetOwnerRef["id"],
    name: o.name,
    role: o.role ?? undefined,
    imageUrl: o.image_url ?? undefined,
  }));
}

function toReleases(
  raw: ReturnType<typeof petApiDtoSchema.parse>["releases"],
): PetReleaseRef[] {
  if (!raw) return [];
  return raw.map((r) => ({
    id: String(r.id) as PetReleaseRef["id"],
    name: r.name,
    year: r.year ?? undefined,
  }));
}

/**
 * Validates and maps a raw backend DTO to a typed PetModel.
 * Throws ZodError if the DTO does not match the expected schema.
 */
export function petFromApiDto(raw: unknown): PetModel {
  const dto = petApiDtoSchema.parse(raw);
  const id = toId(dto.id);
  const displayName = dto.display_name || dto.name || id;

  return {
    id: id as PetModel["id"],
    name: dto.name || displayName,
    displayName,
    description: dto.description ?? undefined,
    species: dto.species || "",
    generation: toGeneration(dto.generation),
    type: dto.type ?? undefined,
    subtype: dto.subtype ?? undefined,
    rarity: toRarity(dto.rarity),
    exclusivity: toExclusivity(dto.exclusivity),
    exclusivityNote: dto.exclusivity_note ?? undefined,
    imageUrl: dto.image_url ?? undefined,
    ownerName: dto.owner_name ?? undefined,
    ownerImageUrl: dto.owner_image_url ?? undefined,
    owners: toOwners(dto.owners),
    releases: toReleases(dto.releases),
    createdAt: dto.created_at ?? undefined,
    updatedAt: dto.updated_at ?? undefined,
  };
}

/** Maps a PetModel to its lightweight summary shape */
export function petToSummary(model: PetModel): PetSummary {
  return {
    id: model.id,
    name: model.name,
    species: model.species,
    generation: model.generation,
    imageUrl: model.imageUrl,
    ownerName: model.ownerName,
    ownerImageUrl: model.ownerImageUrl,
  };
}
