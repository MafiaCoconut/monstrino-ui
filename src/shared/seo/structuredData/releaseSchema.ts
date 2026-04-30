import type { ReleaseModel } from "@entities/release";

export function buildReleaseSchema(model: ReleaseModel, canonicalUrl: string) {
  const baseUrl = canonicalUrl.split("/catalog")[0];

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: model.displayName || model.name,
    url: canonicalUrl,
    brand: {
      "@type": "Brand",
      name: "Monster High",
    },
  };

  if (model.description) schema.description = model.description;
  if (model.imageUrl) schema.image = model.imageUrl;
  if (model.sku) schema.sku = model.sku;
  if (model.releaseDate) schema.releaseDate = model.releaseDate;
  if (model.updatedAt) schema.dateModified = model.updatedAt;

  if (model.price) {
    const availabilityMap: Record<string, string> = {
      in_stock: "https://schema.org/InStock",
      out_of_stock: "https://schema.org/OutOfStock",
      preorder: "https://schema.org/PreOrder",
      limited: "https://schema.org/LimitedAvailability",
    };
    schema.offers = {
      "@type": "Offer",
      priceCurrency: "USD",
      price: model.price,
      availability:
        availabilityMap[model.stockStatus] ?? "https://schema.org/LimitedAvailability",
      url: canonicalUrl,
    };
  }

  if (model.characterName) {
    schema.character = {
      "@type": "Person",
      name: model.characterName,
      ...(model.characterId
        ? { url: `${baseUrl}/catalog/c/${model.characterId}` }
        : {}),
    };
  }

  if (model.seriesName) {
    schema.isPartOf = {
      "@type": "CreativeWorkSeries",
      name: model.seriesName,
      ...(model.seriesId
        ? { url: `${baseUrl}/catalog/s/${model.seriesId}` }
        : {}),
    };
  }

  return schema;
}
