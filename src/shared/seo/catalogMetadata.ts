import type { Metadata } from 'next';
import { getSiteUrl } from './siteUrl';

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

export async function buildCatalogMetadata(
  title: string,
  path: string,
  searchParams?: Promise<SearchParams> | SearchParams,
): Promise<Metadata> {
  const resolved = searchParams instanceof Promise ? await searchParams : searchParams;
  const hasQuery = Boolean(resolved && Object.keys(resolved).length > 0);
  const canonical = `${getSiteUrl()}${path}`;
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
    robots: hasQuery
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}
