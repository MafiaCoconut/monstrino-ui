import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Admin boundary (pre-WP6), implemented as a Next.js 16 proxy
 * (`proxy.ts` — the supported successor of the deprecated `middleware.ts`
 * convention).
 *
 * No admin pages exist in this UI yet, and the backend admin/auth contract
 * (roadmap WP6.3, static bearer token) is not available. Until it is, the
 * entire /admin namespace is hard-closed: any request receives a plain 404
 * with a noindex directive. This guarantees:
 *  - no accidental future page under /admin ships without authentication;
 *  - /admin can never be indexed (robots.txt is NOT used as access control).
 *
 * When WP6 lands, this proxy becomes the authentication gate
 * (token/session check → next() or 401) instead of a blanket 404.
 */
export function proxy(_req: NextRequest) {
  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
