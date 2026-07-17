import PrivacyPage from '@/widgets/info/PrivacyPage';
import type { Metadata } from 'next';
import { canonicalUrl } from '@/shared/routes/registry';

// /legal/* is the canonical legal route family (duplicate /info/* routes 308
// here). Self-canonical keeps exactly one indexable URL per legal document.
export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Monstrino handles data and privacy.',
  alternates: { canonical: canonicalUrl('/legal/privacy') },
};

export const dynamic = 'force-static';

export default function Page() {
  return <PrivacyPage />;
}
