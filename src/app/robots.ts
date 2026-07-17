import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/shared/seo/siteUrl';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // robots.txt is a crawl-budget hint, never access control:
        // /admin is hard-closed by middleware (404 + X-Robots-Tag) and
        // /favorites is noindex via its layout metadata.
        disallow: ['/api/', '/admin/', '/admin', '/favorites'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
