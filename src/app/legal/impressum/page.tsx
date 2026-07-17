import ImpressumInfo from '@/widgets/info/ImpressumInfo';
import type { Metadata } from 'next';
import { canonicalUrl } from '@/shared/routes/registry';

// /legal/* is the canonical legal route family (duplicate /info/* routes 308
// here). Self-canonical keeps exactly one indexable URL per legal document.
export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Legal disclosure (Impressum) for Monstrino.',
  alternates: { canonical: canonicalUrl('/legal/impressum') },
};

export const dynamic = 'force-static';

export default function Page() {
  return <ImpressumInfo />;
}
