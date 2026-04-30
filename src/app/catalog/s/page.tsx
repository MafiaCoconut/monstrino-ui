import { useMockData } from '@/shared/config/env';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import SeriesCatalog from '@/widgets/catalog/SeriesCatalog';
import SeriesCatalogLegacy from '@/widgets/catalog/SeriesCatalogLegacy';
import { buildCatalogMetadata } from '@/shared/seo/catalogMetadata';
import { getSiteUrl } from '@/shared/seo/siteUrl';
import { BreadcrumbJsonLd } from '@/shared/seo/StructuredData';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return buildCatalogMetadata('Series Catalog', '/catalog/s', searchParams);
}

export default function Page() {
  
  const CatalogComponent = useMockData ? SeriesCatalogLegacy : SeriesCatalog;
  const siteUrl = getSiteUrl();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `${siteUrl}/` },
          { name: 'Series', url: `${siteUrl}/catalog/s` },
        ]}
      />
      <Suspense fallback={null}>
        <CatalogComponent />
      </Suspense>
    </>
  );
}
