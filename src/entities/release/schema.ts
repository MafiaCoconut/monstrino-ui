import { z } from "zod";

export const releaseApiDtoSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  code: z.string(),
  mpn: z.string().nullish(),
  year: z.number().int().nullish(),
  description: z.string().nullish(),
  text_from_box: z.string().nullish(),
  primary_image_url: z.string().nullish(),
  images: z.array(z.string()).nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const releasePageApiDtoSchema = z.object({
  items: z.array(releaseApiDtoSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  page_size: z.number().int().positive(),
});
