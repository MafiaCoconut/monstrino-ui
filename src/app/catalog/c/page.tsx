import { useMockData } from '@/shared/config/env';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import CharacterCatalog from '@/widgets/catalog/CharacterCatalog';
import CharacterCatalogLegacy from '@/widgets/catalog/CharacterCatalogLegacy';
import { buildCatalogMetadata } from '@/shared/seo/catalogMetadata';
import { getSiteUrl } from '@/shared/seo/siteUrl';
import { BreadcrumbJsonLd } from '@/shared/seo/structuredData';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return buildCatalogMetadata('Character Catalog', '/catalog/c', searchParams, {
    // CSR-only list: noindex until WP10.2 server list DTOs (route registry).
    indexable: false,
  });
}

export default function Page() {
  
  const CatalogComponent = useMockData ? CharacterCatalogLegacy : CharacterCatalog;
  const siteUrl = getSiteUrl();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `${siteUrl}/` },
          { name: 'Characters', url: `${siteUrl}/catalog/c` },
        ]}
      />
      <Suspense fallback={null}>
        <CatalogComponent />
      </Suspense>
    </>
  );
}
