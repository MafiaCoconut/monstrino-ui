import type { SeriesModel } from "@entities/series";

export function buildSeriesSchema(model: SeriesModel, canonicalUrl: string) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWorkSeries",
    name: model.displayName || model.name,
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "Mattel",
    },
  };

  if (model.description) schema.description = model.description;
  if (model.imageUrl) schema.image = model.imageUrl;
  if (model.concept) schema.abstract = model.concept;
  if (model.yearStart) schema.startDate = String(model.yearStart);
  if (model.yearEnd) schema.endDate = String(model.yearEnd);
  if (model.releaseCount) schema.numberOfItems = model.releaseCount;
  if (model.updatedAt) schema.dateModified = model.updatedAt;

  if (model.colorPalette.length > 0) {
    schema.additionalProperty = {
      "@type": "PropertyValue",
      name: "colorPalette",
      value: model.colorPalette.map((c) => c.name).join(", "),
    };
  }

  return schema;
}
