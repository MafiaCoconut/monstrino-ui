'use client';

import { Box, Skeleton } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { mergeSx } from '@/shared/ui/mergeSx';

interface SeriesCardSkeletonProps {
  cardSx?: SxProps<Theme>;
}

/**
 * Skeleton for SeriesCard — text-only (no image), reserves header + meta lines.
 */
export function SeriesCardSkeleton({ cardSx }: SeriesCardSkeletonProps) {
  return (
    <Box
      sx={mergeSx(
        {
          backgroundColor: 'background.paper',
          borderRadius: 1,
          p: 2,
          minHeight: 120,
        },
        cardSx,
      )}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '60%' }} />
        <Skeleton variant="rectangular" width={40} height={24} sx={{ borderRadius: 1 }} />
      </Box>
      <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '85%', mb: 0.5 }} />
      <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '50%' }} />
    </Box>
  );
}
