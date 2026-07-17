import type { Metadata } from 'next';
import { Suspense } from 'react';
import ReleaseCatalog from '@/widgets/catalog/ReleaseCatalog';
import { buildCatalogMetadata } from '@/shared/seo/catalogMetadata';
import { getSiteUrl } from '@/shared/seo/siteUrl';
import { BreadcrumbJsonLd } from '@/shared/seo/structuredData';
import { getReleasesPage } from '@/shared/api/resources';
import { releaseFromApiDto } from '@entities/release';
import type { ReleasesPageModel } from '@/shared/api/hooks';

// Keep list freshness within the release cache bound (see @shared/api/cachePolicy).
export const revalidate = 300;

const PAGE_SIZE = 12;

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return buildCatalogMetadata('Release Catalog', '/catalog/r', searchParams);
}

/**
 * First page of the catalog, fetched server-side so the indexable list page
 * ships meaningful HTML. Failure is non-fatal: the client catalog fetches
 * exactly as before.
 */
async function getInitialReleasesPage(): Promise<ReleasesPageModel | undefined> {
  try {
    const page = await getReleasesPage(
      { page: 1, pageSize: PAGE_SIZE },
      { context: 'server' },
    );
    return { ...page, items: page.items.map((dto) => releaseFromApiDto(dto)) };
  } catch (err) {
    console.error('[catalog/r] server-side first page unavailable:', err);
    return undefined;
  }
}

export default async function Page() {
  const siteUrl = getSiteUrl();
  const initialPage = await getInitialReleasesPage();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `${siteUrl}/` },
          { name: 'Releases', url: `${siteUrl}/catalog/r` },
        ]}
      />
      <Suspense fallback={null}>
        <ReleaseCatalog initialPage={initialPage} />
      </Suspense>
    </>
  );
}
