import type { Metadata } from 'next';
import type { ReleaseModel } from '@entities/release';
import type { SeriesModel } from '@entities/series';
import type { CharacterModel } from '@entities/character';
import type { PetModel } from '@entities/pet';

function toLastModified(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function baseDetailMeta({
  title,
  description,
  canonical,
  imageUrl,
  updatedAt,
  keywords,
  openGraphType,
}: {
  title: string;
  description: string;
  canonical: string;
  imageUrl?: string;
  updatedAt?: string;
  keywords: string[];
  openGraphType: 'article' | 'profile';
}): Metadata {
  const lastModified = toLastModified(updatedAt);

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: openGraphType,
      locale: 'en_US',
      title: `${title} | Monstrino`,
      description,
      url: canonical,
      siteName: 'Monstrino',
      images: imageUrl ? [{ url: imageUrl, alt: title }] : [],
      ...(updatedAt ? { modifiedTime: updatedAt } : {}),
      ...(keywords.length > 0 ? { tags: keywords } : {}),
      ...(openGraphType === 'profile' ? { username: title } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Monstrino`,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
    ...(lastModified ? { lastModified } : {}),
  };
}

export function buildReleaseDetailMetadata(
  model: ReleaseModel,
  canonical: string,
  id: string,
): Metadata {
  const title = model.displayName || model.name || `Release ${id}`;
  const description =
    model.description ||
    model.subtitle ||
    `Details and release information for ${title}.`;
  const keywords = [
    model.characterName,
    model.seriesName,
    model.generation,
    model.year ? String(model.year) : undefined,
    ...model.releaseTypes,
    'Monster High',
    'collectible doll',
    'release',
  ].filter(Boolean) as string[];

  return baseDetailMeta({
    title,
    description,
    canonical,
    imageUrl: model.imageUrl,
    updatedAt: model.updatedAt,
    keywords,
    // Next.js Open Graph type union doesn't include "product".
    // Product semantics are emitted via JSON-LD (schema.org/Product).
    openGraphType: 'article',
  });
}

export function buildSeriesDetailMetadata(
  model: SeriesModel,
  canonical: string,
  id: string,
): Metadata {
  const title = model.displayName || model.name || `Series ${id}`;
  const description =
    model.description ||
    `Series overview and release information for ${title}.`;
  const keywords = [
    title,
    model.generation ? `Monster High ${model.generation}` : undefined,
    model.yearStart ? String(model.yearStart) : undefined,
    model.yearEnd ? String(model.yearEnd) : undefined,
    model.seriesType,
    'Monster High series',
    'doll collection',
  ].filter(Boolean) as string[];

  return baseDetailMeta({
    title,
    description,
    canonical,
    imageUrl: model.imageUrl,
    updatedAt: model.updatedAt,
    keywords,
    openGraphType: 'article',
  });
}

export function buildCharacterDetailMetadata(
  model: CharacterModel,
  canonical: string,
  id: string,
): Metadata {
  const title = model.displayName || model.name || `Character ${id}`;
  const description =
    model.description ||
    `Character profile and related releases for ${title}.`;
  const keywords = [
    title,
    model.species,
    ...model.generations,
    ...model.tags,
    'Monster High',
    'Monster High character',
    'doll character',
  ].filter(Boolean) as string[];

  return baseDetailMeta({
    title,
    description,
    canonical,
    imageUrl: model.imageUrl,
    updatedAt: model.updatedAt,
    keywords,
    openGraphType: 'profile',
  });
}

export function buildPetDetailMetadata(
  model: PetModel,
  canonical: string,
  id: string,
): Metadata {
  const title = model.displayName || model.name || `Pet ${id}`;
  const description = model.description || `Pet profile for ${title}.`;
  const keywords = [
    title,
    model.species,
    model.generation,
    model.ownerName,
    model.rarity,
    'Monster High pet',
    'creature companion',
  ].filter(Boolean) as string[];

  return baseDetailMeta({
    title,
    description,
    canonical,
    imageUrl: model.imageUrl,
    updatedAt: model.updatedAt,
    keywords,
    openGraphType: 'article',
  });
}
