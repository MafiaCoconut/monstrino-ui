import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { getSiteUrlObject, getSiteUrl } from "@/shared/seo/siteUrl";

export const metadata: Metadata = {
  metadataBase: getSiteUrlObject(),
  title: {
    default: "Monstrino",
    template: "%s | Monstrino",
  },
  description: "Monster High Collection & Release Hub — catalog, characters, series and pets.",
  keywords: ["Monster High", "Monster High collector", "Monster High catalog", "Monstrino"],
  openGraph: {
    type: "website",
    siteName: "Monstrino",
    locale: "en_US",
    url: getSiteUrl(),
  },
  twitter: {
    card: "summary_large_image",
    site: "@monstrino",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
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
      </body>
    </html>
  );
}
