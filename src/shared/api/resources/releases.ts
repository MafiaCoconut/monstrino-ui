import { httpGet } from "@shared/api/http";
import type { HttpGetOptions, ServerCacheOptions } from "@shared/api/http";
import { releaseApiDtoSchema, releasePageApiDtoSchema } from "@entities/release";
import type { ReleaseApiDto, ReleasePageApiDto } from "@entities/release";
import { ValidationError } from "@shared/api/http";
import { ZodError } from "zod";

export type ReleasePageParams = {
  page?: number;
  pageSize?: number;
};

const DETAIL_TTL = 60 * 60 * 12; // 12 hours
const LIST_TTL = 60 * 60; // 1 hour

function buildPageQuery(params?: ReleasePageParams): string {
  const query = new URLSearchParams();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 12;
  const offset = Math.max(page - 1, 0) * pageSize;

  query.set("limit", String(pageSize));
  query.set("offset", String(offset));
  return query.toString();
}

export async function getReleaseBySlug(
  slug: string,
  options: HttpGetOptions & { cache?: ServerCacheOptions },
): Promise<ReleaseApiDto> {
  const cache: ServerCacheOptions =
    options.context === "server"
      ? { revalidate: DETAIL_TTL, tags: [`release-${slug}`, "release-list"], ...options.cache }
      : {};

  const raw = await httpGet<unknown>(`/releases/${slug}`, { ...options, cache });

  try {
    return releaseApiDtoSchema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(`Invalid release response for slug=${slug}`, err.issues);
    }
    throw err;
  }
}

export async function getReleasesPage(
  params: ReleasePageParams | undefined,
  options: HttpGetOptions & { cache?: ServerCacheOptions },
): Promise<ReleasePageApiDto> {
  const cache: ServerCacheOptions =
    options.context === "server"
      ? { revalidate: LIST_TTL, tags: ["release-list"], ...options.cache }
      : {};

  const query = buildPageQuery(params);
  const raw = await httpGet<unknown>(`/releases?${query}`, { ...options, cache });

  try {
    return releasePageApiDtoSchema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError("Invalid release page response", err.issues);
    }
    throw err;
  }
}

export async function getReleasesList(
  options: HttpGetOptions & { cache?: ServerCacheOptions },
): Promise<ReleaseApiDto[]> {
  const page = await getReleasesPage({ page: 1, pageSize: 100 }, options);
  return page.items;
}
