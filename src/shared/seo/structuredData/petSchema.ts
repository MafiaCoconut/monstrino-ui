import type { PetModel } from "@entities/pet";

export function buildPetSchema(model: PetModel, canonicalUrl: string) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Animal",
    name: model.displayName || model.name,
    url: canonicalUrl,
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

  if (model.ownerName) {
    schema.owner = {
      "@type": "Person",
      name: model.ownerName,
      additionalType: "https://schema.org/FictionalCharacter",
    };
  }

  return schema;
}
