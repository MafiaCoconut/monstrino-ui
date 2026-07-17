'use client';

import { useEffect } from 'react';
import { reportError } from '@/shared/observability';

/**
 * Global route error boundary. Deliberately free of MUI/theme dependencies:
 * it must render even when providers themselves fail.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Something went wrong</h1>
      <p style={{ margin: 0, opacity: 0.75 }}>
        The page failed to load. The catalog may be temporarily unavailable.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          padding: '0.6rem 1.4rem',
          borderRadius: '0.5rem',
          border: '1px solid currentColor',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Try again
      </button>
    </main>
  );
}
