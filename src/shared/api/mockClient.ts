/**
 * Mock API client — active when NEXT_PUBLIC_USE_MOCK_DATA=true.
 *
 * Returns ApiDto-shaped data from src/__mocks__/entities.ts.
 * Production code must never reach this path.
 */

import { ApiError } from "./http/errors";
import { useMockData } from "@shared/config/env";
import type { ReleaseApiDto } from "@entities/release";
import type { SeriesApiDto } from "@entities/series";
import type { CharacterApiDto } from "@entities/character";
import type { PetApiDto } from "@entities/pet";

// ─── Mode check ───────────────────────────────────────────────────────────────

export function isMockMode(): boolean {
  return useMockData;
}

// ─── Lazy import to avoid pulling mock data into production bundles ───────────

async function getMocks() {
  return import("@/__mocks__/entities");
}

// ─── Releases ─────────────────────────────────────────────────────────────────

export async function getMockRelease(id: string): Promise<ReleaseApiDto> {
  const { MOCK_RELEASES_BY_ID } = await getMocks();
  const item = MOCK_RELEASES_BY_ID.get(id);
  if (!item) throw new ApiError(`Mock release not found: ${id}`, "NOT_FOUND", 404);
  return item;
}

export async function getMockReleasesList(): Promise<ReleaseApiDto[]> {
  const { MOCK_RELEASES } = await getMocks();
  return MOCK_RELEASES;
}

// ─── Series ───────────────────────────────────────────────────────────────────

export async function getMockSeries(id: string): Promise<SeriesApiDto> {
  const { MOCK_SERIES_BY_ID } = await getMocks();
  const item = MOCK_SERIES_BY_ID.get(id);
  if (!item) throw new ApiError(`Mock series not found: ${id}`, "NOT_FOUND", 404);
  return item;
}

export async function getMockSeriesList(): Promise<SeriesApiDto[]> {
  const { MOCK_SERIES } = await getMocks();
  return MOCK_SERIES;
}

// ─── Characters ───────────────────────────────────────────────────────────────

export async function getMockCharacter(id: string): Promise<CharacterApiDto> {
  const { MOCK_CHARACTERS_BY_ID } = await getMocks();
  const item = MOCK_CHARACTERS_BY_ID.get(id);
  if (!item) throw new ApiError(`Mock character not found: ${id}`, "NOT_FOUND", 404);
  return item;
}

export async function getMockCharactersList(): Promise<CharacterApiDto[]> {
  const { MOCK_CHARACTERS } = await getMocks();
  return MOCK_CHARACTERS;
}

// ─── Pets ─────────────────────────────────────────────────────────────────────

export async function getMockPet(id: string): Promise<PetApiDto> {
  const { MOCK_PETS_BY_ID } = await getMocks();
  const item = MOCK_PETS_BY_ID.get(id);
  if (!item) throw new ApiError(`Mock pet not found: ${id}`, "NOT_FOUND", 404);
  return item;
}

export async function getMockPetsList(): Promise<PetApiDto[]> {
  const { MOCK_PETS } = await getMocks();
  return MOCK_PETS;
}
