import type { ReactNode } from 'react';
import HubLayout from '@/widgets/layout/HubLayout';

export default function Layout({ children }: { children: ReactNode }) {
  return <HubLayout>{children}</HubLayout>;
}
