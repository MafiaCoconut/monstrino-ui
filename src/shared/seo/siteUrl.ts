import { siteUrl as configuredSiteUrl } from "@shared/config/env";

const DEFAULT_SITE_URL = 'http://localhost:3000';

/**
 * Get the site URL for server-side SEO operations.
 * Reads from the centralised env config (SITE_URL → NEXT_PUBLIC_SITE_URL → default).
 * Use this for canonical URLs, sitemaps, and robots.txt.
 */
export function getSiteUrl(): string {
  const raw = configuredSiteUrl || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, '');
}

export function getSiteUrlObject(): URL {
  return new URL(getSiteUrl());
}
