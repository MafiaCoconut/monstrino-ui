'use client';

import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useFavorites } from '@features/favorites';
import { useReleasesList } from '@/shared/api/hooks';
import ReleaseCardCatalog from '@cards/release-card/ReleaseCardCatalog';

const cardLayout = {
  cardSx: { height: { xs: 360, sm: 480, md: 580, lg: 630 } },
  imageSx: { paddingTop: { xs: '140%', sm: '145%', md: '150%' } },
  contentSx: { p: { xs: 1, sm: 1.5, md: 2 } },
};

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { data: apiReleases } = useReleasesList();
  const releasesSource = apiReleases ?? [];

  const favoriteReleases = releasesSource.filter((r) =>
    favorites.includes(String(r.id))
  );

  return (
    <Box
      sx={{
        maxWidth: 1600,
        mx: 'auto',
        px: { xs: 1.5, sm: 2, md: 4 },
        pt: { xs: 2, sm: 3 },
        pb: 8,
        minHeight: '60vh',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: { xs: 2, sm: 3 },
        }}
      >
        <FavoriteIcon sx={{ color: '#F43F5E', fontSize: { xs: 22, sm: 28 } }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.125rem', sm: '1.375rem', md: '1.5rem' },
          }}
        >
          My Favorites
        </Typography>
        {favoriteReleases.length > 0 && (
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', ml: 0.5 }}
          >
            ({favoriteReleases.length})
          </Typography>
        )}
      </Box>

      {/* Empty state */}
      {favoriteReleases.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 8, sm: 12 },
          }}
        >
          <FavoriteIcon
            sx={{
              fontSize: 56,
              color: 'rgba(255,255,255,0.08)',
              mb: 2,
              display: 'block',
              mx: 'auto',
            }}
          />
          <Typography
            variant="h6"
            sx={{ color: 'text.secondary', mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            No favorites yet
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#6B7280', fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
          >
            Tap the heart icon on any release to save it here.
          </Typography>
        </Box>
      )}

      {/* Grid */}
      {favoriteReleases.length > 0 && (
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
          {favoriteReleases.map((release) => (
            <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3 }} key={release.id}>
              <ReleaseCardCatalog
                release={release}
                cardSx={cardLayout.cardSx}
                imageSx={cardLayout.imageSx}
                contentSx={cardLayout.contentSx}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
