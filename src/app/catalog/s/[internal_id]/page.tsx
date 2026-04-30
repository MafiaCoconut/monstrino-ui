import { useMockData } from '@/shared/config/env';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSeriesById } from '@/shared/api/resources';
import { isApiError } from '@/shared/api/http';
import { seriesFromApiDto } from '@entities/series';
import type { SeriesApiDto } from '@entities/series';
import { getSiteUrl } from '@/shared/seo/siteUrl';
import { JsonLd, BreadcrumbJsonLd } from '@/shared/seo/StructuredData';
import { buildSeriesSchema } from '@/shared/seo/structuredData';
import { buildSeriesDetailMetadata } from '@/shared/seo/detailMetadata';
import { SeriesDetailView } from '@/widgets/detail';
import SeriesIndex from '@/widgets/catalog/SeriesIndex';

export const revalidate = 43200;

type PageProps = {
  params: { internal_id: string } | Promise<{ internal_id: string }>;
};

async function getSeriesOrNotFound(id: string): Promise<SeriesApiDto> {
  try {
    return await getSeriesById(id, { context: 'server' });
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
  const canonical = `${siteUrl}/catalog/s/${internal_id}`;
  if (useMockData) {
    return {
      title: `Series ${internal_id} | Monstrino`,
      description: `Series profile ${internal_id} in mock mode`,
      alternates: { canonical },
    };
  }
  const dto = await getSeriesOrNotFound(internal_id);
  const model = seriesFromApiDto(dto);
  return buildSeriesDetailMetadata(model, canonical, internal_id);
}

export default async function Page({ params }: PageProps) {
  if (useMockData) {
    return <SeriesIndex />;
  }
  const { internal_id } = await params;
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/catalog/s/${internal_id}`;
  const dto = await getSeriesOrNotFound(internal_id);
  const model = seriesFromApiDto(dto);
  const displayName = model.displayName ?? model.name ?? dto.display_name ?? dto.name ?? `Series ${internal_id}`;

  const breadcrumbs = [
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Series', url: `${siteUrl}/catalog/s` },
    { name: displayName, url: canonical },
  ];

  return (
    <>
      <JsonLd schema={buildSeriesSchema(model, canonical)} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <SeriesDetailView id={internal_id} initialModel={model} />
    </>
  );
}
