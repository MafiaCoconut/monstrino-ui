'use client';

import React from 'react';
import Image from 'next/image';
import { Link as RouterLink } from '@/shared/router';
import { Box, Chip, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReleaseModel } from '@entities/release';
import { mergeSx } from '@/shared/ui/mergeSx';
import { useFavorites, FavoriteButton } from '@features/favorites';

const PLACEHOLDER_IMAGE = '/placeholder-release.svg';

interface ReleaseCardCatalogProps {
  release: ReleaseModel;
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

  return (
    <Box
      component={RouterLink}
      to={`/catalog/r/${release.slug}`}
      aria-label={release.title}
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
        cardSx,
      )}
    >
      <Box
        sx={mergeSx(
          {
            position: 'relative',
            width: '100%',
            paddingTop: { xs: '140%', sm: '145%', md: '150%' },
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
          },
          imageSx,
        )}
      >
        <Image
          src={release.primaryImageUrl ?? PLACEHOLDER_IMAGE}
          alt={release.title}
          fill
          sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 25vw"
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          priority={priority}
        />
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

      <Box sx={mergeSx({ p: { xs: 1, sm: 1.5, md: 2 } }, contentSx)}>
        <Typography
          variant="h6"
          sx={{
            color: 'text.primary',
            fontWeight: 700,
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9375rem', lg: '1rem' },
            lineHeight: 1.3,
            mb: { xs: 0.5, sm: 0.75 },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {release.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8125rem', lg: '0.85rem' },
            mb: { xs: 0.75, sm: 1 },
          }}
        >
          {release.code}
          {release.year ? ` • ${release.year}` : ''}
        </Typography>

        {release.mpn ? (
          <Typography
            variant="caption"
            sx={{
              color: '#6B7280',
              display: 'block',
              mb: { xs: 0.75, sm: 1.25 },
              fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.75rem' },
            }}
          >
            MPN: {release.mpn}
          </Typography>
        ) : null}

        {release.description ? (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              lineHeight: 1.5,
              mb: 1.25,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {release.description}
          </Typography>
        ) : null}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.4, sm: 0.5 } }}>
          <Chip
            label={release.slug}
            size="small"
            sx={{
              backgroundColor: 'rgba(139, 92, 246, 0.12)',
              color: '#7C3AED',
              fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem' },
              height: { xs: '18px', sm: '20px', md: '22px' },
              fontWeight: 500,
              '& .MuiChip-label': {
                px: { xs: 0.5, sm: 0.75, md: 1 },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ReleaseCardCatalog;
