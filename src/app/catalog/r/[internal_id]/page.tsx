import { useMockData } from '@/shared/config/env';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getReleaseById } from '@/shared/api/resources';
import { isApiError } from '@/shared/api/http';
import { releaseFromApiDto } from '@entities/release';
import type { ReleaseApiDto } from '@entities/release';
import { getSiteUrl } from '@/shared/seo/siteUrl';
import { JsonLd, BreadcrumbJsonLd } from '@/shared/seo/StructuredData';
import { buildReleaseSchema } from '@/shared/seo/structuredData';
import { buildReleaseDetailMetadata } from '@/shared/seo/detailMetadata';
import { ReleaseDetailView } from '@/widgets/detail';
import ReleaseIndex from '@/widgets/catalog/ReleaseIndex';

export const revalidate = 43200;

type PageProps = {
  params: { internal_id: string } | Promise<{ internal_id: string }>;
};

async function getReleaseOrNotFound(id: string): Promise<ReleaseApiDto> {
  try {
    return await getReleaseById(id, { context: 'server' });
  } catch (err) {
    if (isApiError(err) && err.status === 404) {
      notFound();
    }
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { internal_id } = await params;
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/catalog/r/${internal_id}`;
  if (useMockData) {
    return {
      title: `Release ${internal_id} | Monstrino`,
      description: `Release profile ${internal_id} in mock mode`,
      alternates: { canonical },
    };
  }
  const dto = await getReleaseOrNotFound(internal_id);
  const model = releaseFromApiDto(dto);
  return buildReleaseDetailMetadata(model, canonical, internal_id);
}

export default async function Page({ params }: PageProps) {
  if (useMockData) {
    return <ReleaseIndex />;
  }
  const { internal_id } = await params;
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/catalog/r/${internal_id}`;
  const dto = await getReleaseOrNotFound(internal_id);
  const model = releaseFromApiDto(dto);

  const breadcrumbs = [
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Releases', url: `${siteUrl}/catalog/r` },
    {
      name: model.displayName ?? model.name ?? dto.display_name ?? dto.name ?? `Release ${internal_id}`,
      url: canonical,
    },
  ];

  return (
    <>
      <JsonLd schema={buildReleaseSchema(model, canonical)} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ReleaseDetailView id={internal_id} initialModel={model} />
    </>
  );
}
