'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { useMemo, useState } from 'react';
import { makeTheme } from '@/shared/theme/theme';
import { GlobalStyles } from '@/shared/theme/GlobalStyles';

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem('themeMode') as 'light' | 'dark' | null;
    return stored ?? 'dark';
  });

  const theme = useMemo(() => makeTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}
