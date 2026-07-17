import { z } from "zod";

// ─── Schema ───────────────────────────────────────────────────────────────────

const envSchema = z.object({
  /** Public backend API base URL, e.g. http://localhost:8000 */
  NEXT_PUBLIC_BACKEND_URL: z.string().min(1, "NEXT_PUBLIC_BACKEND_URL is required"),

  /** When 'true', API calls return local mock data instead of hitting the backend */
  NEXT_PUBLIC_USE_MOCK_DATA: z
    .string()
    .optional()
    .transform((v) => v === "true"),

  /** Public site URL used for canonical links and OG tags */
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

  /** Server-side site URL (overrides NEXT_PUBLIC_SITE_URL when set) */
  SITE_URL: z.string().url().optional(),

  /** Secret token for the /api/revalidate endpoint (server-side only) */
  REVALIDATE_SECRET: z.string().optional(),

  /** Node environment */
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

// ─── Parse & export ───────────────────────────────────────────────────────────

/**
 * Next.js only inlines direct `process.env.NEXT_PUBLIC_*` member accesses into
 * client bundles. Passing the whole `process.env` object to zod therefore sees
 * an empty object in the browser and validation fails at runtime. Each variable
 * must be read with an explicit member access.
 *
 * Server-only variables (SITE_URL, REVALIDATE_SECRET) are read the same way;
 * they are `undefined` in the browser and their values are never inlined into
 * client bundles.
 */
const rawEnv = {
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  SITE_URL: process.env.SITE_URL,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
  NODE_ENV: process.env.NODE_ENV,
};

function parseEnv() {
  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    // In dev/test, print a helpful error; in production, throw so the build fails
    const message = result.error.issues
      .map((i) => `  ${i.path.join(".")}: ${i.message}`)
      .join("\n");

    if (rawEnv.NODE_ENV === "production") {
      throw new Error(`Invalid environment configuration:\n${message}`);
    } else {
      console.warn(`[monstrino] Invalid environment configuration:\n${message}`);
    }
    // Return best-effort object so the app still loads in dev
    return rawEnv as unknown as z.infer<typeof envSchema>;
  }

  return result.data;
}

export const config = parseEnv();

// ─── Typed accessors ──────────────────────────────────────────────────────────

export const isDev = config.NODE_ENV === "development";
export const isProd = config.NODE_ENV === "production";
export const isTest = config.NODE_ENV === "test";

export const backendUrl = config.NEXT_PUBLIC_BACKEND_URL;

/**
 * Mock mode is a development/demo switch only. In production builds it is
 * forcibly disabled so a stray NEXT_PUBLIC_USE_MOCK_DATA=true can never make
 * the public site silently serve mock data instead of the real catalog.
 */
export const useMockData = Boolean(config.NEXT_PUBLIC_USE_MOCK_DATA) && !isProd;

export const siteUrl =
  config.SITE_URL ?? config.NEXT_PUBLIC_SITE_URL ?? "https://monstrino.com";
export const revalidateSecret = config.REVALIDATE_SECRET;
