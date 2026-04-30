import { useMockData } from '@/shared/config/env';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCharacterById } from '@/shared/api/resources';
import { isApiError } from '@/shared/api/http';
import { characterFromApiDto } from '@entities/character';
import type { CharacterApiDto } from '@entities/character';
import { getSiteUrl } from '@/shared/seo/siteUrl';
import { JsonLd, BreadcrumbJsonLd } from '@/shared/seo/StructuredData';
import { buildCharacterSchema } from '@/shared/seo/structuredData';
import { buildCharacterDetailMetadata } from '@/shared/seo/detailMetadata';
import { CharacterDetailView } from '@/widgets/detail';
import CharacterIndex from '@/widgets/catalog/CharacterIndex';

export const revalidate = 43200;

type PageProps = {
  params: { internal_id: string } | Promise<{ internal_id: string }>;
};

async function getCharacterOrNotFound(id: string): Promise<CharacterApiDto> {
  try {
    return await getCharacterById(id, { context: 'server' });
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
  const canonical = `${siteUrl}/catalog/c/${internal_id}`;
  if (useMockData) {
    return {
      title: `Character ${internal_id} | Monstrino`,
      description: `Character profile ${internal_id} in mock mode`,
      alternates: { canonical },
    };
  }
  const dto = await getCharacterOrNotFound(internal_id);
  const model = characterFromApiDto(dto);
  return buildCharacterDetailMetadata(model, canonical, internal_id);
}

export default async function Page({ params }: PageProps) {
  if (useMockData) {
    return <CharacterIndex />;
  }
  const { internal_id } = await params;
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/catalog/c/${internal_id}`;
  const dto = await getCharacterOrNotFound(internal_id);
  const model = characterFromApiDto(dto);
  const displayName = model.displayName ?? model.name ?? dto.display_name ?? dto.name ?? `Character ${internal_id}`;

  const breadcrumbs = [
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Characters', url: `${siteUrl}/catalog/c` },
    { name: displayName, url: canonical },
  ];

  return (
    <>
      <JsonLd schema={buildCharacterSchema(model, canonical)} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <CharacterDetailView id={internal_id} initialModel={model} />
    </>
  );
}
