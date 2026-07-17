import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/shared/seo/siteUrl';
import { routes as appRoutes } from '@/shared/routes/registry';
import {
  getReleasesPage,
  getSeriesList,
  getCharactersList,
  getPetsList,
} from '@/shared/api/resources';

const RELEASE_SITEMAP_PAGE_SIZE = 100;
const RELEASE_SITEMAP_PAGE_CAP = 1000;

const getUpdated = (updatedAt?: string | null) => {
  if (!updatedAt) return undefined;
  const date = new Date(updatedAt);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export async function collectReleaseSitemapRoutes(base: string): Promise<MetadataRoute.Sitemap> {
  const ctx = { context: 'server' as const };
  const seenSlugs = new Set<string>();
  const routes: MetadataRoute.Sitemap = [];
  let expectedTotal: number | null = null;

  for (let page = 1; page <= RELEASE_SITEMAP_PAGE_CAP; page += 1) {
    const current = await getReleasesPage({ page, pageSize: RELEASE_SITEMAP_PAGE_SIZE }, ctx);
    expectedTotal = expectedTotal ?? current.total;

    let addedThisPage = 0;
    for (const item of current.items) {
      if (!item.slug || seenSlugs.has(item.slug)) {
        continue;
      }

      seenSlugs.add(item.slug);
      routes.push({
        url: `${base}${appRoutes.releaseDetail(item.slug)}`,
        lastModified: getUpdated(item.updated_at),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
      addedThisPage += 1;
    }

    if (routes.length >= expectedTotal) {
      return routes;
    }

    if (current.items.length === 0) {
      return routes;
    }

    if (addedThisPage === 0) {
      throw new Error(
        `Release sitemap pagination made no progress on page ${page} before reaching total=${expectedTotal}.`,
      );
    }
  }

  throw new Error(
    `Release sitemap exceeded safety cap of ${RELEASE_SITEMAP_PAGE_CAP} pages before reaching total=${expectedTotal ?? "unknown"}.`,
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  // SEO cadence policy:
  // - release: monthly (0.8)
  // - series: monthly (0.7)
  // - character: yearly (0.6)
  // - pet: monthly (0.5)
  // /catalog/{c,p,s} list pages are deliberately absent: they are CSR-only
  // (noindex, follow — see route registry) until WP10.2 server list DTOs.
  // Their SSR detail pages remain in the dynamic sections below.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/catalog/r`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/info`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/info/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/info/support`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/info/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/legal`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/impressum`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const ctx = { context: 'server' as const };

  // Fail-safe section policy: a section whose backing endpoint is unavailable
  // is omitted (and logged) rather than failing the whole sitemap. No fake or
  // placeholder URLs are ever emitted for missing sections.
  const releaseRoutes = await collectReleaseSitemapRoutes(base).catch((err) => {
    console.error('[sitemap] release section unavailable, omitting:', err);
    return [] as MetadataRoute.Sitemap;
  });

  const [series, characters, pets] = await Promise.all([
    getSeriesList(ctx).catch((err) => {
      console.error('[sitemap] series section unavailable, omitting:', err);
      return [];
    }),
    getCharactersList(ctx).catch((err) => {
      console.error('[sitemap] character section unavailable, omitting:', err);
      return [];
    }),
    getPetsList(ctx).catch((err) => {
      console.error('[sitemap] pet section unavailable, omitting:', err);
      return [];
    }),
  ]);

  const seriesRoutes: MetadataRoute.Sitemap = series
    .filter((item) => item.id != null)
    .map((item) => ({
      url: `${base}${appRoutes.seriesDetail(String(item.id))}`,
      lastModified: getUpdated(item.updated_at),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  const characterRoutes: MetadataRoute.Sitemap = characters
    .filter((item) => item.id != null)
    .map((item) => ({
      url: `${base}${appRoutes.characterDetail(String(item.id))}`,
      lastModified: getUpdated(item.updated_at),
      changeFrequency: 'yearly',
      priority: 0.6,
    }));

  const petRoutes: MetadataRoute.Sitemap = pets
    .filter((item) => item.id != null)
    .map((item) => ({
      url: `${base}${appRoutes.petDetail(String(item.id))}`,
      lastModified: getUpdated(item.updated_at),
      changeFrequency: 'monthly',
      priority: 0.5,
    }));

  return [...staticRoutes, ...releaseRoutes, ...seriesRoutes, ...characterRoutes, ...petRoutes];
}
