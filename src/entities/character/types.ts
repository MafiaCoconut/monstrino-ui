import type {
  BaseApiDto,
  BrandedId,
  EntityAudit,
  Generation,
  HexColor,
  UrlString,
} from "@entities/shared";

// ─── ID ───────────────────────────────────────────────────────────────────────

export type CharacterId = BrandedId<"CharacterId">;

// ─── Enums / const unions ─────────────────────────────────────────────────────

export const CHARACTER_TAGS = [
  "Main Character",
  "Secondary",
  "Reboot",
  "Movie Character",
  "Webisode Only",
] as const;
export type CharacterTag = (typeof CHARACTER_TAGS)[number] | string;

// ─── API DTO (raw backend shape, snake_case) ──────────────────────────────────

export interface CharacterApiDto extends BaseApiDto {
  species?: string | null;
  origin?: string | null;
  release_count?: number | null;
  image_url?: string | null;
  accent_color?: string | null;
  generations?: string[] | null;
  series_appearances?: string[] | null;
  tags?: string[] | null;
}

// ─── Domain Model ─────────────────────────────────────────────────────────────

/** Full domain model — used on character detail pages */
export interface CharacterModel extends EntityAudit {
  id: CharacterId;
  name: string;
  displayName: string;
  description?: string;
  species: string;
  origin?: string;
  releaseCount?: number;
  imageUrl?: UrlString;
  accentColor?: HexColor;
  generations: Generation[];
  seriesAppearances: string[];
  tags: CharacterTag[];
}

/** Lightweight shape — used in catalog listings and cards */
export interface CharacterSummary {
  id: CharacterId;
  name: string;
  species: string;
  releaseCount?: number;
  imageUrl?: UrlString;
  accentColor?: HexColor;
}
