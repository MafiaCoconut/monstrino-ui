import MainInfo from '@/widgets/info/MainInfo';
import type { Metadata } from 'next';
import { canonicalUrl } from '@/shared/routes/registry';

// /legal/* is the canonical legal route family (duplicate /info/* routes 308
// here). Self-canonical keeps exactly one indexable URL per legal document.
export const metadata: Metadata = {
  title: 'Legal',
  description: 'Legal notices for Monstrino — terms of service, privacy policy and impressum.',
  alternates: { canonical: canonicalUrl('/legal') },
};

export const dynamic = 'force-static';

export default function Page() {
  return <MainInfo />;
}
