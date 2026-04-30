import { useMockData } from '@/shared/config/env';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPetById } from '@/shared/api/resources';
import { isApiError } from '@/shared/api/http';
import { petFromApiDto } from '@entities/pet';
import type { PetApiDto } from '@entities/pet';
import { getSiteUrl } from '@/shared/seo/siteUrl';
import { JsonLd, BreadcrumbJsonLd } from '@/shared/seo/StructuredData';
import { buildPetSchema } from '@/shared/seo/structuredData';
import { buildPetDetailMetadata } from '@/shared/seo/detailMetadata';
import { PetDetailView } from '@/widgets/detail';
import PetIndex from '@/widgets/catalog/PetIndex';

export const revalidate = 43200;

type PageProps = {
  params: { internal_id: string } | Promise<{ internal_id: string }>;
};

async function getPetOrNotFound(id: string): Promise<PetApiDto> {
  try {
    return await getPetById(id, { context: 'server' });
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
  const canonical = `${siteUrl}/catalog/p/${internal_id}`;
  if (useMockData) {
    return {
      title: `Pet ${internal_id} | Monstrino`,
      description: `Pet profile ${internal_id} in mock mode`,
      alternates: { canonical },
    };
  }
  const dto = await getPetOrNotFound(internal_id);
  const model = petFromApiDto(dto);
  return buildPetDetailMetadata(model, canonical, internal_id);
}

export default async function Page({ params }: PageProps) {
  if (useMockData) {
    return <PetIndex />;
  }
  const { internal_id } = await params;
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/catalog/p/${internal_id}`;
  const dto = await getPetOrNotFound(internal_id);
  const model = petFromApiDto(dto);
  const displayName = model.displayName ?? model.name ?? dto.display_name ?? dto.name ?? `Pet ${internal_id}`;

  const breadcrumbs = [
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Pets', url: `${siteUrl}/catalog/p` },
    { name: displayName, url: canonical },
  ];

  return (
    <>
      <JsonLd schema={buildPetSchema(model, canonical)} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <PetDetailView id={internal_id} initialModel={model} />
    </>
  );
}
