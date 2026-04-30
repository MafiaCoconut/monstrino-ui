import type { ReactNode } from 'react';
import InfoLayout from '@/widgets/layout/InfoLayout';

export default function Layout({ children }: { children: ReactNode }) {
  return <InfoLayout>{children}</InfoLayout>;
}
