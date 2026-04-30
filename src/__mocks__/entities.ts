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
    name: "Frankie Stein Basic",
    display_name: "Frankie Stein — Basic Series",
    description: "Classic Frankie Stein basic doll from the original Monster High line.",
    subtitle: "Original Monster High",
    generation: "G1",
    release_date: "2010-07-01",
    release_date_label: "Jul 2010",
    release_types: ["Basic"],
    pack_size: 1,
    rarity: "Common",
    tags: [],
    stock_status: "out_of_stock",
    character_name: "Frankie Stein",
    character_id: "101",
    series_name: "Original Monster High",
    series_id: "1",
    year: 2010,
    image_url: null,
    price_display: "$24.99",
    is_exclusive: false,
    pricing: [],
    variants: [],
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Draculaura Signature",
    display_name: "Draculaura — Signature",
    description: "Signature Draculaura doll.",
    generation: "G1",
    release_date: "2010-07-01",
    release_types: ["Signature"],
    pack_size: 1,
    rarity: "Common",
    tags: [],
    stock_status: "out_of_stock",
    character_name: "Draculaura",
    character_id: "102",
    series_name: "Original Monster High",
    series_id: "1",
    year: 2010,
    image_url: null,
    price_display: "$27.99",
    is_exclusive: false,
    pricing: [],
    variants: [],
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

export const MOCK_RELEASES_BY_ID = new Map(MOCK_RELEASES.map((r) => [String(r.id), r]));
export const MOCK_SERIES_BY_ID = new Map(MOCK_SERIES.map((s) => [String(s.id), s]));
export const MOCK_CHARACTERS_BY_ID = new Map(MOCK_CHARACTERS.map((c) => [String(c.id), c]));
export const MOCK_PETS_BY_ID = new Map(MOCK_PETS.map((p) => [String(p.id), p]));
