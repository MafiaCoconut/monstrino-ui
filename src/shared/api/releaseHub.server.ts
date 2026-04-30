/**
 * @deprecated
 * Superseded by `src/shared/api/resources/` + `src/shared/api/http/httpClient.ts`.
 *
 * Problems with this file:
 *  - Returns `null` on API failure (silent, invisible to callers)
 *  - No typed errors — callers can't distinguish network vs API vs validation failures
 *  - Uses partial `*Api` types from shared/seo instead of validated entity DTOs
 *  - No cache tags — revalidation is TTL-only
 *
 * Migration:
 *  - Replace `fetchRelease(id)`    → `getReleaseById(id, { context: 'server' })`
 *  - Replace `fetchSeries(id)`     → `getSeriesById(id, { context: 'server' })`
 *  - Replace `fetchCharacter(id)`  → `getCharacterById(id, { context: 'server' })`
 *  - Replace `fetchReleasesList()` → `getReleasesList({ context: 'server' })`
 *  - Replace `fetchSeriesList()`   → `getSeriesList({ context: 'server' })`
 *
 * All replacements are from `@shared/api/resources`.
 * Do NOT add new callers to this file.
 */

import { DETAIL_REVALIDATE_SECONDS } from '@/shared/seo/constants';
import type { CharacterApi, ReleaseApi, SeriesApi } from '@/shared/seo/releaseHub';

import { backendUrl } from '@shared/config/env';
const rawBase = backendUrl || '';
const API_BASE = rawBase.replace(/\/$/, '');
const API_URL = API_BASE ? `${API_BASE}/api/v1` : '';

type ApiResponse<T> = T | { result?: T } | { data?: T };

const unwrap = <T,>(data: ApiResponse<T>): T => {
  if (data && typeof data === 'object') {
    if ('result' in data && data.result) return data.result as T;
    if ('data' in data && data.data) return data.data as T;
  }
  return data as T;
};

async function fetchJson<T>(path: string, revalidateSeconds = DETAIL_REVALIDATE_SECONDS): Promise<T | null> {
  if (!API_URL) return null;
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as ApiResponse<T>;
  return unwrap(json);
}

/** @deprecated Use `getReleaseById` from `@shared/api/resources` */
export async function fetchRelease(id: string) {
  return fetchJson<ReleaseApi>(`/releases/${id}`);
}

/** @deprecated Use `getSeriesById` from `@shared/api/resources` */
export async function fetchSeries(id: string) {
  return fetchJson<SeriesApi>(`/series/${id}`);
}

/** @deprecated Use `getCharacterById` from `@shared/api/resources` */
export async function fetchCharacter(id: string) {
  return fetchJson<CharacterApi>(`/characters/${id}`);
}

/** @deprecated Use `getReleasesList` from `@shared/api/resources` */
export async function fetchReleasesList() {
  return fetchJson<Array<Record<string, unknown>>>(`/releases`, 60 * 60);
}

/** @deprecated Use `getSeriesList` from `@shared/api/resources` */
export async function fetchSeriesList() {
  return fetchJson<Array<Record<string, unknown>>>(`/series`, 60 * 60);
}

/** @deprecated Use `getCharactersList` from `@shared/api/resources` */
export async function fetchCharactersList() {
  return fetchJson<Array<Record<string, unknown>>>(`/characters`, 60 * 60);
}
