'use client';

import { Box, Skeleton } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { mergeSx } from '@/shared/ui/mergeSx';

interface CharacterCardSkeletonProps {
  cardSx?: SxProps<Theme>;
}

/**
 * Skeleton that mirrors CharacterCard layout (fixed-height image + text overlay).
 * maxWidth: 220, image height: 170.
 */
export function CharacterCardSkeleton({ cardSx }: CharacterCardSkeletonProps) {
  return (
    <Box
      sx={mergeSx(
        {
          backgroundColor: 'background.paper',
          borderRadius: 1,
          overflow: 'hidden',
          maxWidth: 220,
          margin: '0 auto',
        },
        cardSx,
      )}
    >
      <Skeleton variant="rectangular" height={170} />
      <Box sx={{ p: 1.5 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.1rem', mb: 0.5, width: '80%' }} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '55%' }} />
      </Box>
    </Box>
  );
}
