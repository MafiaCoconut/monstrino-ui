import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getReleaseBySlug } from '@/shared/api/resources';
import { isApiError } from '@/shared/api/http';
import { releaseFromApiDto } from '@entities/release';
import { getSiteUrl } from '@/shared/seo/siteUrl';
import { JsonLd, BreadcrumbJsonLd } from '@/shared/seo/StructuredData';
import { buildReleaseSchema } from '@/shared/seo/structuredData';
import { buildReleaseDetailMetadata } from '@/shared/seo/detailMetadata';
import { ReleaseDetailView } from '@/widgets/detail';

export const revalidate = 43200;

type PageProps = {
  params: { slug: string } | Promise<{ slug: string }>;
};

async function getReleaseOrNotFound(slug: string) {
  try {
    return await getReleaseBySlug(slug, { context: 'server' });
  } catch (err) {
    if (isApiError(err) && err.status === 404) {
      notFound();
    }
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/catalog/r/${slug}`;
  const dto = await getReleaseOrNotFound(slug);
  const model = releaseFromApiDto(dto);
  return buildReleaseDetailMetadata(model, canonical, slug);
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/catalog/r/${slug}`;
  const dto = await getReleaseOrNotFound(slug);
  const model = releaseFromApiDto(dto);

  const breadcrumbs = [
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Releases', url: `${siteUrl}/catalog/r` },
    { name: model.title, url: canonical },
  ];

  return (
    <>
      <JsonLd schema={buildReleaseSchema(model, canonical)} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ReleaseDetailView model={model} />
    </>
  );
}
