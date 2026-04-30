import type { CharacterModel } from "@entities/character";

export function buildCharacterSchema(model: CharacterModel, canonicalUrl: string) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: model.displayName || model.name,
    url: canonicalUrl,
    additionalType: "https://schema.org/FictionalCharacter",
  };

  if (model.description) schema.description = model.description;
  if (model.imageUrl) schema.image = model.imageUrl;
  if (model.updatedAt) schema.dateModified = model.updatedAt;

  if (model.species) {
    schema.additionalProperty = {
      "@type": "PropertyValue",
      name: "species",
      value: model.species,
    };
  }

  if (model.origin) {
    schema.birthPlace = {
      "@type": "Place",
      name: model.origin,
    };
  }

  return schema;
}
