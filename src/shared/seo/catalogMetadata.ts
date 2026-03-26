import type { Metadata } from 'next';
import { getSiteUrl } from './siteUrl';

type SearchParams = Record<string, string | string[] | undefined> | undefined;

export async function buildCatalogMetadata(
  title: string,
  path: string,
  searchParams?: Promise<SearchParams> | SearchParams
): Promise<Metadata> {
  const resolved = searchParams instanceof Promise ? await searchParams : searchParams;
  const hasQuery = Boolean(resolved && Object.keys(resolved).length > 0);
  const canonical = `${getSiteUrl()}${path}`;

  return {
    title,
    alternates: {
      canonical,
    },
    robots: hasQuery
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}
