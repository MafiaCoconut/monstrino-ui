import { httpGet } from "@shared/api/http";
import type { HttpGetOptions, ServerCacheOptions } from "@shared/api/http";
import { seriesApiDtoSchema } from "@entities/series";
import type { SeriesApiDto } from "@entities/series";
import { ValidationError } from "@shared/api/http";
import { ZodError } from "zod";
import { getMockSeries, getMockSeriesList, isMockMode } from "../mockClient";

const DETAIL_TTL = 60 * 60 * 12;
const LIST_TTL = 60 * 60;

export async function getSeriesById(
  id: string,
  options: HttpGetOptions & { cache?: ServerCacheOptions },
): Promise<SeriesApiDto> {
  if (isMockMode()) return getMockSeries(id);

  const cache: ServerCacheOptions =
    options.context === "server"
      ? { revalidate: DETAIL_TTL, tags: [`series-${id}`, "series-list"], ...options.cache }
      : {};

  const raw = await httpGet<unknown>(`/series/${encodeURIComponent(id)}`, { ...options, cache });

  try {
    return seriesApiDtoSchema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(`Invalid series response for id=${id}`, err.issues);
    }
    throw err;
  }
}

export async function getSeriesList(
  options: HttpGetOptions & { cache?: ServerCacheOptions },
): Promise<SeriesApiDto[]> {
  if (isMockMode()) return getMockSeriesList();

  const cache: ServerCacheOptions =
    options.context === "server"
      ? { revalidate: LIST_TTL, tags: ["series-list"], ...options.cache }
      : {};

  const raw = await httpGet<unknown[]>(`/series`, { ...options, cache });

  if (!Array.isArray(raw)) {
    throw new ValidationError("Expected array for series list", []);
  }

  return raw.map((item, i) => {
    try {
      return seriesApiDtoSchema.parse(item);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new ValidationError(`Invalid series at index ${i}`, err.issues);
      }
      throw err;
    }
  });
}
