'use client';

import React from 'react';
import Image from 'next/image';
import { Link as RouterLink } from '@/shared/router';
import { Box, Typography, Chip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { mergeSx } from '@/shared/ui/mergeSx';
import { useFavorites, FavoriteButton } from '@features/favorites';

const PLACEHOLDER_IMAGE = '/placeholder.svg';

type ReleaseCardCatalogData = {
  id: string | number;
  characterName: string;
  seriesName: string;
  releaseDate?: string;
  generation?: string;
  packSize?: number;
  releaseTypes?: string[];
  tags?: string[];
  imageUrl?: string;
};

interface ReleaseCardCatalogProps {
  release: ReleaseCardCatalogData;
  /** Pass true for above-the-fold cards (first ~4) to boost LCP */
  priority?: boolean;
  cardSx?: SxProps<Theme>;
  imageSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
}

const ReleaseCardCatalog: React.FC<ReleaseCardCatalogProps> = ({
  release,
  priority = false,
  cardSx,
  imageSx,
  contentSx,
}) => {
  const { isFavorited, toggle } = useFavorites();
  const favorited = isFavorited(String(release.id));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(String(release.id));
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const packSize = release.packSize ?? 1;
  const packLabel = packSize > 1 ? `${packSize}-Pack` : 'Single';
  const releaseTypes = release.releaseTypes ?? [];
  const releaseTags = release.tags ?? [];

  return (
    <Box
      component={RouterLink}
      to={`/catalog/r/${release.id}`}
      aria-label={`${release.characterName} release`}
      sx={mergeSx(
        {
          backgroundColor: 'background.paper',
          borderRadius: { xs: 1.5, sm: 2 },
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          textDecoration: 'none',
          color: 'inherit',
          height: { xs: 360, sm: 480, md: 580, lg: 630 },
          display: 'block',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(139, 92, 246, 0.15)',
          },
        },
        cardSx
      )}
    >
      {/* Portrait Image Container - ~1:1.5 aspect ratio */}
      <Box
        sx={mergeSx(
          {
            position: 'relative',
            width: '100%',
            paddingTop: { xs: '140%', sm: '145%', md: '150%' }, // Creates adaptive aspect ratio
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
          },
          imageSx
        )}
      >
        <Image
          src={release.imageUrl ?? PLACEHOLDER_IMAGE}
          alt={release.characterName}
          fill
          sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 25vw"
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          priority={priority}
        />
        {/* Favorite button */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 4, sm: 6 },
            right: { xs: 4, sm: 6 },
            zIndex: 1,
          }}
        >
          <FavoriteButton isFavorited={favorited} onToggle={handleFavoriteClick} />
        </Box>
      </Box>

      {/* Card Content */}
      <Box sx={mergeSx({ p: { xs: 1, sm: 1.5, md: 2 } }, contentSx)}>
        {/* Character Name */}
        <Typography
          variant="h6"
          sx={{
            color: 'text.primary',
            fontWeight: 700,
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9375rem', lg: '1rem' },
            lineHeight: 1.3,
            mb: { xs: 0.25, sm: 0.5 },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {release.characterName}
        </Typography>

        {/* Series */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8125rem', lg: '0.85rem' },
            mb: { xs: 0.75, sm: 1, md: 1.5 },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {release.seriesName}
        </Typography>

        {/* Generation + Pack Size */}
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
            mb: { xs: 0.25, sm: 0.5 },
            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
          }}
        >
          {release.generation} • {packLabel}
        </Typography>

        {/* Release Date */}
        <Typography
          variant="caption"
          sx={{
            color: '#6B7280',
            display: 'block',
            mb: { xs: 0.75, sm: 1, md: 1.5 },
            fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.75rem' },
          }}
        >
          {formatDate(release.releaseDate)}
        </Typography>

        {/* Type Tags */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.4, sm: 0.5 } }}>
          {releaseTypes.slice(0, 2).map((type) => (
            <Chip
              key={type}
              label={type}
              size="small"
              sx={{
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                color: '#A78BFA',
                fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem' },
                height: { xs: '18px', sm: '20px', md: '22px' },
                fontWeight: 500,
                '& .MuiChip-label': {
                  px: { xs: 0.5, sm: 0.75, md: 1 },
                },
              }}
            />
          ))}
          {releaseTags.includes('SDCC') && (
            <Chip
              label="SDCC"
              size="small"
              sx={{
                backgroundColor: 'rgba(217, 70, 239, 0.15)',
                color: '#E879F9',
                fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem' },
                height: { xs: '18px', sm: '20px', md: '22px' },
                fontWeight: 500,
                '& .MuiChip-label': {
                  px: { xs: 0.5, sm: 0.75, md: 1 },
                },
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ReleaseCardCatalog;
