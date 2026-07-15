/**
 * Minimal ApiDto-shaped mock data for the mock API client.
 * These are used when NEXT_PUBLIC_USE_MOCK_DATA=true.
 *
 * The rich legacy mock data in src/data/real-data/ is used by release-hub
 * components (Phase 7 migration target) and is separate from this.
 */

import type { ReleaseApiDto } from "@entities/release";
import type { SeriesApiDto } from "@entities/series";
import type { CharacterApiDto } from "@entities/character";
import type { PetApiDto } from "@entities/pet";

// ─── Releases ─────────────────────────────────────────────────────────────────

export const MOCK_RELEASES: ReleaseApiDto[] = [
  {
    id: "1",
    slug: "frankie-stein-basic-000000000001",
    title: "Frankie Stein Basic",
    code: "frankie-stein-basic",
    mpn: "FRANKIE-001",
    year: 2010,
    description: "Classic Frankie Stein basic doll from the original Monster High line.",
    text_from_box: "Frankie sparks up the original line.",
    primary_image_url: null,
    images: [],
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    slug: "draculaura-signature-000000000002",
    title: "Draculaura Signature",
    code: "draculaura-signature",
    mpn: "DRAC-002",
    year: 2010,
    description: "Signature Draculaura doll.",
    text_from_box: null,
    primary_image_url: null,
    images: [],
    updated_at: "2024-01-01T00:00:00Z",
  },
];

// ─── Series ───────────────────────────────────────────────────────────────────

export const MOCK_SERIES: SeriesApiDto[] = [
  {
    id: "1",
    name: "Original Monster High",
    display_name: "Original Monster High (G1)",
    description: "The original Monster High doll line from Mattel, launched in 2010.",
    generation: "G1",
    year_start: 2010,
    year_end: 2017,
    series_type: "Mainline",
    status: "Completed",
    release_count: 200,
    character_count: 40,
    year_label: "2010–2017",
    image_url: null,
    updated_at: "2024-01-01T00:00:00Z",
  },
];

// ─── Characters ───────────────────────────────────────────────────────────────

export const MOCK_CHARACTERS: CharacterApiDto[] = [
  {
    id: "101",
    name: "Frankie Stein",
    display_name: "Frankie Stein",
    description: "The daughter of Frankenstein's monster and his bride.",
    species: "Frankenstein's Monster",
    release_count: 45,
    generations: ["G1", "G2", "G3"],
    series_appearances: ["Original Monster High", "Boo York", "Electrified"],
    tags: ["Main Character"],
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "102",
    name: "Draculaura",
    display_name: "Draculaura",
    description: "The daughter of Dracula, a 1600-year-old vegan vampire.",
    species: "Vampire",
    release_count: 50,
    generations: ["G1", "G2", "G3"],
    tags: ["Main Character"],
    updated_at: "2024-01-01T00:00:00Z",
  },
];

// ─── Pets ─────────────────────────────────────────────────────────────────────

export const MOCK_PETS: PetApiDto[] = [
  {
    id: "1",
    name: "Watzit",
    display_name: "Watzit",
    description: "Frankie Stein's dog, a patchwork creature stitched together like its owner.",
    species: "Dog",
    generation: "G1",
    rarity: "common",
    owner_name: "Frankie Stein",
    owners: [{ id: "101", name: "Frankie Stein", role: "primary" }],
    releases: [],
    updated_at: "2024-01-01T00:00:00Z",
  },
];

// ─── Index maps ───────────────────────────────────────────────────────────────

export const MOCK_RELEASES_BY_ID = new Map(MOCK_RELEASES.map((r) => [r.slug, r]));
export const MOCK_SERIES_BY_ID = new Map(MOCK_SERIES.map((s) => [String(s.id), s]));
export const MOCK_CHARACTERS_BY_ID = new Map(MOCK_CHARACTERS.map((c) => [String(c.id), c]));
export const MOCK_PETS_BY_ID = new Map(MOCK_PETS.map((p) => [String(p.id), p]));
