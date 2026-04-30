'use client';

import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';
import { reportQueryError } from '@shared/observability';
import { isProd } from '@shared/config/env';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Global error hook — fires after all retries are exhausted
        queryCache: new QueryCache({ onError: reportQueryError }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: isProd,
            gcTime: 1000 * 60 * 10,
          },
          mutations: {
            retry: 1,
            onError: reportQueryError,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {!isProd && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
