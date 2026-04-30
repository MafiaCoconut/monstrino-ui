import { z } from "zod";

const pricingRegionSchema = z.object({
  code: z.string(),
  currency: z.string(),
  msrp: z.number(),
  market: z.number(),
  flag: z.string().nullish(),
  msrp_note: z.string().nullish(),
  market_note: z.string().nullish(),
  recent_sales_count: z.number().nullish(),
});

const variantSchema = z.object({
  type: z.string(),
  name: z.string(),
  year: z.union([z.number(), z.string()]).nullish(),
  status: z.string(),
  sku: z.string().nullish(),
});

export const releaseApiDtoSchema = z.object({
  id: z.union([z.string(), z.number()]).nullish(),
  name: z.string().nullish(),
  display_name: z.string().nullish(),
  description: z.string().nullish(),
  subtitle: z.string().nullish(),
  generation: z.string().nullish(),
  release_date: z.string().nullish(),
  release_date_label: z.string().nullish(),
  release_types: z.array(z.string()).nullish(),
  pack_size: z.number().nullish(),
  rarity: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
  sku: z.string().nullish(),
  stock_status: z.string().nullish(),
  stock_status_label: z.string().nullish(),
  rating_average: z.number().nullish(),
  rating_count: z.number().nullish(),
  character_name: z.string().nullish(),
  character_id: z.union([z.string(), z.number()]).nullish(),
  series_name: z.string().nullish(),
  series_id: z.union([z.string(), z.number()]).nullish(),
  year: z.number().nullish(),
  image_url: z.string().nullish(),
  price_display: z.string().nullish(),
  is_exclusive: z.boolean().nullish(),
  pricing: z.array(pricingRegionSchema).nullish(),
  variants: z.array(variantSchema).nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export type ReleaseApiDtoValidated = z.infer<typeof releaseApiDtoSchema>;
