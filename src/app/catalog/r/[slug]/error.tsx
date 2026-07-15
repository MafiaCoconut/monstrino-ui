'use client';

import { Box, Button, Typography } from '@mui/material';

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <Box sx={{ minHeight: '50vh', display: 'grid', placeItems: 'center', textAlign: 'center', px: 2 }}>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Failed to load release
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          The catalog API returned an unexpected error.
        </Typography>
        <Button variant="contained" onClick={reset}>
          Retry
        </Button>
      </Box>
    </Box>
  );
}
