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

function parseEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    // In dev/test, print a helpful error; in production, throw so the build fails
    const message = result.error.issues
      .map((i) => `  ${i.path.join(".")}: ${i.message}`)
      .join("\n");

    if (process.env.NODE_ENV === "production") {
      throw new Error(`Invalid environment configuration:\n${message}`);
    } else {
      console.warn(`[monstrino] Invalid environment configuration:\n${message}`);
    }
    // Return best-effort object so the app still loads in dev
    return result.error.issues.reduce(
      (acc) => acc,
      process.env as unknown as z.infer<typeof envSchema>,
    );
  }

  return result.data;
}

export const config = parseEnv();

// ─── Typed accessors ──────────────────────────────────────────────────────────

export const isDev = config.NODE_ENV === "development";
export const isProd = config.NODE_ENV === "production";
export const isTest = config.NODE_ENV === "test";

export const backendUrl = config.NEXT_PUBLIC_BACKEND_URL;
export const useMockData = config.NEXT_PUBLIC_USE_MOCK_DATA;
export const siteUrl =
  config.SITE_URL ?? config.NEXT_PUBLIC_SITE_URL ?? "https://monstrino.com";
export const revalidateSecret = config.REVALIDATE_SECRET;
