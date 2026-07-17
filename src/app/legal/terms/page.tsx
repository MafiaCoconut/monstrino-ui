import TermsInfo from '@/widgets/info/TermsInfo';
import type { Metadata } from 'next';
import { canonicalUrl } from '@/shared/routes/registry';

// /legal/* is the canonical legal route family (duplicate /info/* routes 308
// here). Self-canonical keeps exactly one indexable URL per legal document.
export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for using the Monstrino Monster High collector catalog.',
  alternates: { canonical: canonicalUrl('/legal/terms') },
};

export const dynamic = 'force-static';

export default function Page() {
  return <TermsInfo />;
}
