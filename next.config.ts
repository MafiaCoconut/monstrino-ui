import type { NextConfig } from "next";

const isProdBuild = process.env.NODE_ENV === "production";

/** Origin of the backend API, for CSP connect-src / img-src. */
function backendOrigin(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!raw) return undefined;
  try {
    return new URL(raw).origin;
  } catch {
    return undefined;
  }
}

/**
 * Content Security Policy — enforced baseline.
 *
 * Status: ENFORCED, with two documented relaxations required by the current
 * stack (see docs/architecture/monstrino-ui-security-seo-foundation-v1.md):
 *  - script-src 'unsafe-inline': Next.js App Router emits inline bootstrap
 *    scripts; removing this requires the nonce/middleware flow (planned).
 *  - style-src 'unsafe-inline': Emotion/MUI inject runtime <style> tags.
 * No 'unsafe-eval', no wildcard script/connect origins.
 */
export function buildContentSecurityPolicy(): string {
  const api = backendOrigin();

  const imgSources = [
    "'self'",
    "data:",
    "blob:",
    "https://*.monstrino.com",
    ...(api ? [api] : []),
    ...(isProdBuild ? [] : ["http://localhost:8000"]),
  ];

  const connectSources = [
    "'self'",
    ...(api ? [api] : []),
    // webpack/turbopack HMR in dev
    ...(isProdBuild ? [] : ["ws:", "http://localhost:8000"]),
  ];

  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSources.join(" ")}`,
    "font-src 'self' data:",
    `connect-src ${connectSources.join(" ")}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isProdBuild ? ["upgrade-insecure-requests"] : []),
  ];

  return directives.join("; ");
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: buildContentSecurityPolicy() },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Redundant with CSP frame-ancestors, kept for older crawlers/proxies.
  { key: "X-Frame-Options", value: "DENY" },
  ...(isProdBuild
    ? [
        {
          // HTTPS termination happens at the ingress; 180 days, subdomains
          // excluded because registry.monstrino.com etc. are operated
          // independently. Preload only after a deliberate decision.
          key: "Strict-Transport-Security",
          value: "max-age=15552000",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      // Monstrino-owned media/CDN/API hosts only. Wildcard is scoped to the
      // owned second-level domain; arbitrary third-party hosts are rejected.
      {
        protocol: "https",
        hostname: "*.monstrino.com",
        pathname: "/**",
      },
      // Local development backend only — excluded from production builds.
      ...(isProdBuild
        ? []
        : [
            {
              protocol: "http" as const,
              hostname: "localhost",
              port: "8000",
              pathname: "/**",
            },
          ]),
    ],
  },
  async redirects() {
    // /legal/* is the canonical legal route family. The former /info/* legal
    // pages issued framework redirect() calls (HTTP 307, temporary); these
    // declarative 308s are permanent, cacheable and crawler-consolidating.
    return [
      { source: "/info/privacy", destination: "/legal/privacy", permanent: true },
      { source: "/info/terms", destination: "/legal/terms", permanent: true },
      { source: "/info/impressum", destination: "/legal/impressum", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Admin surfaces (future WP6) and API routes must never be indexed.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
