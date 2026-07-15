import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Box sx={{ minHeight: '50vh', display: 'grid', placeItems: 'center', textAlign: 'center', px: 2 }}>
      <Box>
        <CircularProgress size={32} sx={{ mb: 2 }} />
        <Typography variant="h6">Loading release</Typography>
      </Box>
    </Box>
  );
}
