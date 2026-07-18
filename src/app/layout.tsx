import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { getSiteUrlObject } from "@/shared/seo/siteUrl";

const analyticsWebsiteId = process.env.NEXT_PUBLIC_ANALYTICS_WEBSITE_ID;

export const metadata: Metadata = {
  metadataBase: getSiteUrlObject(),
  title: {
    default: "Monstrino",
    template: "%s | Monstrino",
  },
  description: "Monster High Collection & Release Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark">
        <Providers>{children}</Providers>
        {analyticsWebsiteId && (
          <Script
            defer
            src="https://analytics.monstrino.com/script.js"
            data-website-id={analyticsWebsiteId}
          />
        )}
      </body>
    </html>
  );
}
