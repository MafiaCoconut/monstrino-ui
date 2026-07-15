import { Box, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '50vh', display: 'grid', placeItems: 'center', textAlign: 'center', px: 2 }}>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Release not found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The requested public release does not exist or is not publicly visible.
        </Typography>
      </Box>
    </Box>
  );
}
