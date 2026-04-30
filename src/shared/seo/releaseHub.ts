import { getSiteUrl } from './siteUrl';

export type SeoData = {
  title: string;
  description: string;
  canonical: string;
  lastModified?: Date;
};

export type ReleaseApi = {
  id?: string | number;
  name?: string | null;
  display_name?: string | null;
  displayName?: string | null;
  description?: string | null;
  description_text?: string | null;
  subtitle?: string | null;
  summary?: string | null;
  updated_at?: string | null;
};

export type SeriesApi = {
  id?: string | number;
  name?: string | null;
  display_name?: string | null;
  displayName?: string | null;
  description?: string | null;
  summary?: string | null;
  updated_at?: string | null;
};

export type CharacterApi = {
  id?: string | number;
  name?: string | null;
  display_name?: string | null;
  displayName?: string | null;
  description?: string | null;
  summary?: string | null;
  updated_at?: string | null;
};

const normalizeUpdated = (value?: string | null) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export function getReleaseSeo(data: ReleaseApi | null | undefined, id: string): SeoData {
  const title = data?.display_name || data?.displayName || data?.name || `Release ${id}`;
  const description =
    data?.description ||
    data?.description_text ||
    data?.summary ||
    data?.subtitle ||
    `Details and release information for ${title}.`;
  return {
    title,
    description,
    canonical: `${getSiteUrl()}/catalog/r/${id}`,
    lastModified: normalizeUpdated(data?.updated_at),
  };
}

export function getSeriesSeo(data: SeriesApi | null | undefined, id: string): SeoData {
  const title = data?.display_name || data?.displayName || data?.name || `Series ${id}`;
  const description =
    data?.description ||
    data?.summary ||
    `Series overview and release information for ${title}.`;
  return {
    title,
    description,
    canonical: `${getSiteUrl()}/catalog/s/${id}`,
    lastModified: normalizeUpdated(data?.updated_at),
  };
}

export function getCharacterSeo(data: CharacterApi | null | undefined, id: string): SeoData {
  const title = data?.display_name || data?.displayName || data?.name || `Character ${id}`;
  const description =
    data?.description ||
    data?.summary ||
    `Character profile and related releases for ${title}.`;
  return {
    title,
    description,
    canonical: `${getSiteUrl()}/catalog/c/${id}`,
    lastModified: normalizeUpdated(data?.updated_at),
  };
}
