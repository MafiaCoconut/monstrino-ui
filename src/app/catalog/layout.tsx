import type { ReactNode } from 'react';
import HubLayout from '@/widgets/layout/HubLayout';
import CatalogLayout from '@/widgets/catalog/CatalogLayout';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HubLayout>
      <CatalogLayout>{children}</CatalogLayout>
    </HubLayout>
  );
}
