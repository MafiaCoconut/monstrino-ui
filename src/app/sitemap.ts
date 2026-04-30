import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/shared/seo/siteUrl';
import {
  getReleasesList,
  getSeriesList,
  getCharactersList,
  getPetsList,
} from '@/shared/api/resources';

const getUpdated = (updatedAt?: string | null) => {
  if (!updatedAt) return undefined;
  const date = new Date(updatedAt);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  // SEO cadence policy:
  // - release: monthly (0.8)
  // - series: monthly (0.7)
  // - character: yearly (0.6)
  // - pet: monthly (0.5)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/catalog/r`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/catalog/c`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/catalog/p`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/catalog/s`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/info`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/info/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/info/support`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/info/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/legal`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/impressum`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    const ctx = { context: 'server' as const };
    const [releases, series, characters, pets] = await Promise.all([
      getReleasesList(ctx).catch(() => []),
      getSeriesList(ctx).catch(() => []),
      getCharactersList(ctx).catch(() => []),
      getPetsList(ctx).catch(() => []),
    ]);

    const releaseRoutes: MetadataRoute.Sitemap = releases
      .filter((item) => item.id)
      .map((item) => ({
        url: `${base}/catalog/r/${item.id}`,
        lastModified: getUpdated(item.updated_at),
        changeFrequency: 'monthly',
        priority: 0.8,
      }));

    const seriesRoutes: MetadataRoute.Sitemap = series
      .filter((item) => item.id)
      .map((item) => ({
        url: `${base}/catalog/s/${item.id}`,
        lastModified: getUpdated(item.updated_at),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));

    const characterRoutes: MetadataRoute.Sitemap = characters
      .filter((item) => item.id)
      .map((item) => ({
        url: `${base}/catalog/c/${item.id}`,
        lastModified: getUpdated(item.updated_at),
        changeFrequency: 'yearly',
        priority: 0.6,
      }));

    const petRoutes: MetadataRoute.Sitemap = pets
      .filter((item) => item.id)
      .map((item) => ({
        url: `${base}/catalog/p/${item.id}`,
        lastModified: getUpdated(item.updated_at),
        changeFrequency: 'monthly',
        priority: 0.5,
      }));

    return [...staticRoutes, ...releaseRoutes, ...seriesRoutes, ...characterRoutes, ...petRoutes];
  } catch {
    return staticRoutes;
  }
}
