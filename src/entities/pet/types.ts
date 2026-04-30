import type {
  BaseApiDto,
  BrandedId,
  EntityAudit,
  Generation,
  UrlString,
} from "@entities/shared";
import type { CharacterId } from "@entities/character";
import type { ReleaseId } from "@entities/release";

// ─── ID ───────────────────────────────────────────────────────────────────────

export type PetId = BrandedId<"PetId">;

// ─── Enums / const unions ─────────────────────────────────────────────────────

export type PetRarity = "common" | "rare" | "exclusive" | "limited";
export type PetExclusivity = "exclusive" | "shared" | "limited";

// ─── API DTO (raw backend shape, snake_case) ──────────────────────────────────

export interface PetOwnerApiDto {
  id: string | number;
  name: string;
  role?: "primary" | "shared" | null;
  image_url?: string | null;
}

export interface PetReleaseRefApiDto {
  id: string | number;
  name: string;
  year?: number | null;
}

export interface PetApiDto extends BaseApiDto {
  species?: string | null;
  generation?: string | null;
  type?: string | null;
  subtype?: string | null;
  rarity?: string | null;
  exclusivity?: string | null;
  exclusivity_note?: string | null;
  image_url?: string | null;
  owner_name?: string | null;
  owner_image_url?: string | null;
  owners?: PetOwnerApiDto[] | null;
  releases?: PetReleaseRefApiDto[] | null;
}

// ─── Domain Model ─────────────────────────────────────────────────────────────

export interface PetOwnerRef {
  id: CharacterId | string;
  name: string;
  role?: "primary" | "shared";
  imageUrl?: UrlString;
}

export interface PetReleaseRef {
  id: ReleaseId | string;
  name: string;
  year?: number;
}

/** Full domain model — used on pet detail pages */
export interface PetModel extends EntityAudit {
  id: PetId;
  name: string;
  displayName: string;
  description?: string;
  species: string;
  generation?: Generation;
  type?: string;
  subtype?: string;
  rarity?: PetRarity;
  exclusivity?: PetExclusivity;
  exclusivityNote?: string;
  imageUrl?: UrlString;
  ownerName?: string;
  ownerImageUrl?: UrlString;
  owners: PetOwnerRef[];
  releases: PetReleaseRef[];
}

/** Lightweight shape — used in catalog listings and cards */
export interface PetSummary {
  id: PetId;
  name: string;
  species: string;
  generation?: Generation;
  imageUrl?: UrlString;
  ownerName?: string;
  ownerImageUrl?: UrlString;
}
