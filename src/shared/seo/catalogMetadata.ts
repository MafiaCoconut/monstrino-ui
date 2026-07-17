import type { Metadata } from 'next';
import { getSiteUrl } from './siteUrl';
import { isIndexableWithParams, canonicalPathForParams } from './queryPolicy';

type SearchParams = Record<string, string | string[] | undefined> | undefined;

const CATALOG_META: Record<
  string,
  { description: string; keywords: string[] }
> = {
  '/catalog/r': {
    description:
      'Browse the complete Monster High release catalog — dolls, playsets, fashion packs and more.',
    keywords: ['Monster High releases', 'Monster High dolls', 'Monster High catalog', 'collectibles'],
  },
  '/catalog/c': {
    description:
      'Explore all Monster High characters — profiles, release history, and collector details.',
    keywords: ['Monster High characters', 'Monster High dolls characters', 'Frankie Stein', 'Draculaura'],
  },
  '/catalog/s': {
    description:
      'Discover every Monster High series from G1 classics to modern G3 releases.',
    keywords: ['Monster High series', 'Monster High generations', 'G1', 'G3', 'doll series'],
  },
  '/catalog/p': {
    description:
      'Meet the pets of Monster High — every creature companion across all generations.',
    keywords: ['Monster High pets', 'Monster High creature companions', 'Watzit', 'doll pets'],
  },
};

type CatalogMetadataOptions = {
  /**
   * Route-level indexability gate (route registry is the source of truth).
   * `false` forces noindex, follow regardless of query parameters — used for
   * CSR-only list routes whose meaningful content is not server-rendered yet
   * (activation condition: WP10.2 list DTOs + server-rendered first page).
   */
  indexable?: boolean;
};

export async function buildCatalogMetadata(
  title: string,
  path: string,
  searchParams?: Promise<SearchParams> | SearchParams,
  options?: CatalogMetadataOptions,
): Promise<Metadata> {
  const resolved = searchParams instanceof Promise ? await searchParams : searchParams;
  // Central query policy: filter/sort/pagination params → noindex, follow;
  // tracking/ui-only params alone stay indexable. Canonical is always the
  // clean base path and never carries query parameters.
  const indexable = (options?.indexable ?? true) && isIndexableWithParams(resolved);
  const canonical = `${getSiteUrl()}${canonicalPathForParams(path)}`;
  const meta = CATALOG_META[path] ?? { description: `${title} on Monstrino.`, keywords: [] };

  return {
    title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      title: `${title} | Monstrino`,
      description: meta.description,
      url: canonical,
      siteName: 'Monstrino',
    },
    twitter: {
      card: 'summary',
      title: `${title} | Monstrino`,
      description: meta.description,
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}
