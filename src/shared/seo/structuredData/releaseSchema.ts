import type { ReleaseModel } from "@entities/release";

export function buildReleaseSchema(model: ReleaseModel, canonicalUrl: string) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: model.title,
    url: canonicalUrl,
    brand: {
      "@type": "Brand",
      name: "Monster High",
    },
  };

  if (model.description) schema.description = model.description;
  if (model.primaryImageUrl) schema.image = model.primaryImageUrl;
  if (model.mpn) schema.sku = model.mpn;
  if (model.updatedAt) schema.dateModified = model.updatedAt;

  return schema;
}
