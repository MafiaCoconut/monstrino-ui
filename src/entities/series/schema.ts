import { z } from "zod";

const colorSchema = z.object({
  hex: z.string(),
  name: z.string(),
});

const dollSchema = z.object({
  id: z.union([z.string(), z.number()]),
  release_id: z.union([z.string(), z.number()]).nullish(),
  character: z.string(),
  variant: z.string().nullish(),
  rarity: z.string().nullish(),
  year: z.union([z.string(), z.number()]).nullish(),
  msrp: z.string().nullish(),
  image_url: z.string().nullish(),
});

const pricingSchema = z.object({
  msrp_range: z.string(),
  current_market_range: z.string(),
  rarity_distribution: z
    .object({
      common: z.number(),
      rare: z.number(),
      ultra_rare: z.number(),
    })
    .nullish(),
  demand_level: z.string().nullish(),
});

export const seriesApiDtoSchema = z.object({
  id: z.union([z.string(), z.number()]).nullish(),
  name: z.string().nullish(),
  display_name: z.string().nullish(),
  description: z.string().nullish(),
  generation: z.string().nullish(),
  year_start: z.number().nullish(),
  year_end: z.number().nullish(),
  series_type: z.string().nullish(),
  status: z.string().nullish(),
  release_years: z.string().nullish(),
  concept: z.string().nullish(),
  release_count: z.number().nullish(),
  character_count: z.number().nullish(),
  year_label: z.string().nullish(),
  image_url: z.string().nullish(),
  color_palette: z.array(colorSchema).nullish(),
  dolls: z.array(dollSchema).nullish(),
  pricing: pricingSchema.nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export type SeriesApiDtoValidated = z.infer<typeof seriesApiDtoSchema>;
