import type { Metadata } from 'next';
import HomePage from '@/widgets/home/Homepage';
import { getSiteUrl } from '@/shared/seo/siteUrl';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  // Absolute: prevents the root template from producing "Monstrino | Monstrino".
  title: { absolute: 'Monstrino — Monster High Collection & Release Hub' },
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
