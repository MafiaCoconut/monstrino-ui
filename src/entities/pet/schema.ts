import { z } from "zod";

const ownerSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  role: z.enum(["primary", "shared"]).nullish(),
  image_url: z.string().nullish(),
});

const releaseRefSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  year: z.number().nullish(),
});

export const petApiDtoSchema = z.object({
  id: z.union([z.string(), z.number()]).nullish(),
  name: z.string().nullish(),
  display_name: z.string().nullish(),
  description: z.string().nullish(),
  species: z.string().nullish(),
  generation: z.string().nullish(),
  type: z.string().nullish(),
  subtype: z.string().nullish(),
  rarity: z.string().nullish(),
  exclusivity: z.string().nullish(),
  exclusivity_note: z.string().nullish(),
  image_url: z.string().nullish(),
  owner_name: z.string().nullish(),
  owner_image_url: z.string().nullish(),
  owners: z.array(ownerSchema).nullish(),
  releases: z.array(releaseRefSchema).nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export type PetApiDtoValidated = z.infer<typeof petApiDtoSchema>;
