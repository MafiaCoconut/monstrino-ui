import type { BrandedId, EntityAudit, UrlString } from "@entities/shared";

export type ReleaseId = BrandedId<"ReleaseId">;

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

export interface ReleaseApiDto {
  id: string;
  slug: string;
  title: string;
  code: string;
  mpn?: string | null;
  year?: number | null;
  description?: string | null;
  text_from_box?: string | null;
  primary_image_url?: string | null;
  images?: string[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ReleasePageApiDto {
  items: ReleaseApiDto[];
  total: number;
  page: number;
  page_size: number;
}

export interface ReleaseModel extends EntityAudit {
  id: ReleaseId;
  slug: string;
  title: string;
  code: string;
  mpn?: string;
  year?: number;
  description?: string;
  textFromBox?: string;
  primaryImageUrl?: UrlString;
  images: UrlString[];
}

export interface ReleaseSummary {
  id: ReleaseId;
  slug: string;
  title: string;
  code: string;
  year?: number;
  primaryImageUrl?: UrlString;
}
