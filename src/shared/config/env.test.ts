import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * env.ts caches its parse at import time, so each scenario re-imports the
 * module with a fresh environment.
 */
async function importEnv(overrides: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      vi.stubEnv(key, "");
    } else {
      vi.stubEnv(key, value);
    }
  }
  return import("./env");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("environment configuration", () => {
  it("mock mode is forcibly disabled in production builds", async () => {
    const env = await importEnv({
      NODE_ENV: "production",
      NEXT_PUBLIC_BACKEND_URL: "https://api.monstrino.com",
      NEXT_PUBLIC_USE_MOCK_DATA: "true",
      NEXT_PUBLIC_SITE_URL: "https://monstrino.com",
    });
    expect(env.useMockData).toBe(false);
    expect(env.isProd).toBe(true);
  });

  it("mock mode works outside production", async () => {
    const env = await importEnv({
      NODE_ENV: "test",
      NEXT_PUBLIC_BACKEND_URL: "http://localhost:8000",
      NEXT_PUBLIC_USE_MOCK_DATA: "true",
    });
    expect(env.useMockData).toBe(true);
  });

  it("server-only values never reach public accessors", async () => {
    const env = await importEnv({
      NODE_ENV: "test",
      NEXT_PUBLIC_BACKEND_URL: "http://localhost:8000",
      SITE_URL: "https://internal.monstrino.com",
      REVALIDATE_SECRET: "s3cret",
    });
    // The module separates public accessors from server-only values; the
    // secret is only exposed through the explicitly server-side export.
    expect(env.backendUrl).toBe("http://localhost:8000");
    expect(env.revalidateSecret).toBe("s3cret");
    expect(JSON.stringify({ backendUrl: env.backendUrl, siteUrl: env.siteUrl })).not.toContain(
      "s3cret",
    );
  });
});
