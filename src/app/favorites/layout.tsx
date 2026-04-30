import type { Metadata } from 'next';
import { Suspense, type ReactNode } from 'react';
import HubLayout from '@/widgets/layout/HubLayout';
import CatalogLayout from '@/widgets/catalog/CatalogLayout';

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'Your saved Monster High releases.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <HubLayout>
        <CatalogLayout>{children}</CatalogLayout>
      </HubLayout>
    </Suspense>
  );
}
