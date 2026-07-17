import { useMockData } from '@/shared/config/env';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import PetCatalog from '@/widgets/catalog/PetCatalog';
import PetCatalogLegacy from '@/widgets/catalog/PetCatalogLegacy';
import { buildCatalogMetadata } from '@/shared/seo/catalogMetadata';
import { getSiteUrl } from '@/shared/seo/siteUrl';
import { BreadcrumbJsonLd } from '@/shared/seo/structuredData';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return buildCatalogMetadata('Pet Catalog', '/catalog/p', searchParams, {
    // CSR-only list: noindex until WP10.2 server list DTOs (route registry).
    indexable: false,
  });
}

export default function Page() {
  
  const CatalogComponent = useMockData ? PetCatalogLegacy : PetCatalog;
  const siteUrl = getSiteUrl();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `${siteUrl}/` },
          { name: 'Pets', url: `${siteUrl}/catalog/p` },
        ]}
      />
      <Suspense fallback={null}>
        <CatalogComponent />
      </Suspense>
    </>
  );
}
