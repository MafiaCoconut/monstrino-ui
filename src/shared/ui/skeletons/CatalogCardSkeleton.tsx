'use client';

import { Box, Skeleton } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { mergeSx } from '@/shared/ui/mergeSx';

interface CatalogCardSkeletonProps {
  /** Image aspect ratio padding-top (e.g. '140%' for portrait, '100%' for square) */
  imagePaddingTop?: string;
  /** Override card height. If omitted, card height is driven by content. */
  cardSx?: SxProps<Theme>;
  /** Number of text line skeletons below the image */
  lines?: number;
}

/**
 * Generic skeleton that mirrors the portrait-image card layout used by
 * ReleaseCardCatalog and PetCardCatalog. Prevents CLS during data loading.
 */
export function CatalogCardSkeleton({
  imagePaddingTop = '140%',
  cardSx,
  lines = 3,
}: CatalogCardSkeletonProps) {
  return (
    <Box
      sx={mergeSx(
        {
          backgroundColor: 'background.paper',
          borderRadius: { xs: 1.5, sm: 2 },
          overflow: 'hidden',
        },
        cardSx,
      )}
    >
      {/* Image placeholder — same aspect ratio as real card */}
      <Box sx={{ position: 'relative', width: '100%', paddingTop: imagePaddingTop }}>
        <Skeleton
          variant="rectangular"
          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </Box>

      {/* Content placeholder */}
      <Box sx={{ p: { xs: 1, sm: 1.5, md: 2 } }}>
        <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 0.5, width: '90%' }} />
        {lines >= 2 && (
          <Skeleton variant="text" sx={{ fontSize: '0.875rem', mb: 0.5, width: '70%' }} />
        )}
        {lines >= 3 && (
          <Skeleton variant="text" sx={{ fontSize: '0.75rem', width: '50%' }} />
        )}
      </Box>
    </Box>
  );
}
