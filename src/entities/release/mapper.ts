import { releaseApiDtoSchema } from "./schema";
import type { ReleaseApiDto, ReleaseModel, ReleaseSummary } from "./types";

function toImages(raw: ReleaseApiDto["images"]): string[] {
  return raw?.filter((item): item is string => Boolean(item)) ?? [];
}

export function releaseFromApiDto(raw: unknown): ReleaseModel {
  const dto = releaseApiDtoSchema.parse(raw);

  return {
    id: dto.id as ReleaseModel["id"],
    slug: dto.slug,
    title: dto.title,
    code: dto.code,
    mpn: dto.mpn ?? undefined,
    year: dto.year ?? undefined,
    description: dto.description ?? undefined,
    textFromBox: dto.text_from_box ?? undefined,
    primaryImageUrl: dto.primary_image_url ?? undefined,
    images: toImages(dto.images),
    createdAt: dto.created_at ?? undefined,
    updatedAt: dto.updated_at ?? undefined,
  };
}

export function releaseToSummary(model: ReleaseModel): ReleaseSummary {
  return {
    id: model.id,
    slug: model.slug,
    title: model.title,
    code: model.code,
    year: model.year,
    primaryImageUrl: model.primaryImageUrl,
  };
}
