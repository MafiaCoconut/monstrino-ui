import type { Metadata } from 'next';
import { Suspense } from 'react';
import ReleaseCatalog from '@/widgets/catalog/ReleaseCatalog';
import { buildCatalogMetadata } from '@/shared/seo/catalogMetadata';
import { getSiteUrl } from '@/shared/seo/siteUrl';
import { BreadcrumbJsonLd } from '@/shared/seo/StructuredData';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  return buildCatalogMetadata('Release Catalog', '/catalog/r', searchParams);
}

export default function Page() {
  const siteUrl = getSiteUrl();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: `${siteUrl}/` },
          { name: 'Releases', url: `${siteUrl}/catalog/r` },
        ]}
      />
      <Suspense fallback={null}>
        <ReleaseCatalog />
      </Suspense>
    </>
  );
}
