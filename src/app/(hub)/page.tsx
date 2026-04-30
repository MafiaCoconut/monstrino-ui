import type { Metadata } from 'next';
import HomePage from '@/widgets/home/Homepage';
import { getSiteUrl } from '@/shared/seo/siteUrl';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Monstrino',
  description: 'Monster High Collection & Release Hub — explore releases, characters, series and pets.',
  keywords: ['Monster High', 'Monster High collector', 'Monster High catalog', 'doll catalog'],
  alternates: {
    canonical: `${siteUrl}/`,
  },
  openGraph: {
    type: 'website',
    title: 'Monstrino — Monster High Collection Hub',
    description: 'Monster High Collection & Release Hub — explore releases, characters, series and pets.',
    url: `${siteUrl}/`,
    siteName: 'Monstrino',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monstrino — Monster High Collection Hub',
    description: 'Monster High Collection & Release Hub — explore releases, characters, series and pets.',
  },
};

export default function Page() {
  return <HomePage />;
}
