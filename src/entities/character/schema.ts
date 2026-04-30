import { z } from "zod";

export const characterApiDtoSchema = z.object({
  id: z.union([z.string(), z.number()]).nullish(),
  name: z.string().nullish(),
  display_name: z.string().nullish(),
  description: z.string().nullish(),
  species: z.string().nullish(),
  origin: z.string().nullish(),
  release_count: z.number().nullish(),
  image_url: z.string().nullish(),
  accent_color: z.string().nullish(),
  generations: z.array(z.string()).nullish(),
  series_appearances: z.array(z.string()).nullish(),
  tags: z.array(z.string()).nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export type CharacterApiDtoValidated = z.infer<typeof characterApiDtoSchema>;
