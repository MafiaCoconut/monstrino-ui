import { httpGet } from "@shared/api/http";
import type { HttpGetOptions, ServerCacheOptions } from "@shared/api/http";
import { releaseApiDtoSchema } from "@entities/release";
import type { ReleaseApiDto } from "@entities/release";
import { ValidationError } from "@shared/api/http";
import { ZodError } from "zod";
import { getMockRelease, getMockReleasesList, isMockMode } from "../mockClient";

export type ReleaseSearchParams = {
  q?: string;
  generations?: string[];
  series?: string[];
  characters?: string[];
  releaseTypes?: string[];
  rarities?: string[];
  tags?: string[];
  sort?: string;
  page?: number;
  perPage?: number;
};

// ─── Cache TTLs ───────────────────────────────────────────────────────────────

const DETAIL_TTL = 60 * 60 * 12; // 12 hours
const LIST_TTL = 60 * 60; // 1 hour

// ─── Resource functions ───────────────────────────────────────────────────────

function parseReleaseList(raw: unknown): ReleaseApiDto[] {
  if (!Array.isArray(raw)) {
    throw new ValidationError("Expected array for releases list", []);
  }

  return raw.map((item, i) => {
    try {
      return releaseApiDtoSchema.parse(item);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new ValidationError(`Invalid release at index ${i}`, err.issues);
      }
      throw err;
    }
  });
}

function buildSearchQuery(params?: ReleaseSearchParams): string {
  if (!params) return "";

  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  params.generations?.forEach((v) => query.append("generation", v));
  params.series?.forEach((v) => query.append("series", v));
  params.characters?.forEach((v) => query.append("character", v));
  params.releaseTypes?.forEach((v) => query.append("type", v));
  params.rarities?.forEach((v) => query.append("rarity", v));
  params.tags?.forEach((v) => query.append("tag", v));
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", String(params.page));
  if (params.perPage) query.set("per_page", String(params.perPage));
  return query.toString();
}

export async function getReleaseById(
  id: string,
  options: HttpGetOptions & { cache?: ServerCacheOptions },
): Promise<ReleaseApiDto> {
  if (isMockMode()) return getMockRelease(id);

  const cache: ServerCacheOptions =
    options.context === "server"
      ? { revalidate: DETAIL_TTL, tags: [`release-${id}`, "release-list"], ...options.cache }
      : {};

  const raw = await httpGet<unknown>(`/releases/${id}`, { ...options, cache });

  try {
    return releaseApiDtoSchema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(`Invalid release response for id=${id}`, err.issues);
    }
    throw err;
  }
}

export async function getReleasesList(
  options: HttpGetOptions & { cache?: ServerCacheOptions },
): Promise<ReleaseApiDto[]> {
  if (isMockMode()) return getMockReleasesList();

  const cache: ServerCacheOptions =
    options.context === "server"
      ? { revalidate: LIST_TTL, tags: ["release-list"], ...options.cache }
      : {};

  const raw = await httpGet<unknown>(`/releases`, { ...options, cache });
  return parseReleaseList(raw);
}

export async function searchReleases(
  params: ReleaseSearchParams | undefined,
  options: HttpGetOptions & { cache?: ServerCacheOptions },
): Promise<ReleaseApiDto[]> {
  if (isMockMode()) {
    const list = await getMockReleasesList();
    if (!params?.q) return list;
    const q = params.q.toLowerCase();
    return list.filter((item) => {
      const haystack = `${item.name ?? ""} ${item.display_name ?? ""} ${item.character_name ?? ""} ${item.series_name ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }

  const cache: ServerCacheOptions =
    options.context === "server"
      ? { revalidate: LIST_TTL, tags: ["release-list"], ...options.cache }
      : {};

  const query = buildSearchQuery(params);
  const path = query ? `/releases?${query}` : "/releases";
  const raw = await httpGet<unknown>(path, { ...options, cache });
  return parseReleaseList(raw);
}
