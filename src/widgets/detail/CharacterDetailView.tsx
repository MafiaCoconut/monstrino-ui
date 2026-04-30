'use client';

import Image from 'next/image';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import type { CharacterModel } from '@entities/character';
import { useCharacter } from '@/shared/api/hooks';
import { BLUR_DATA_URL } from '@shared/ui/imagePlaceholder';

type CharacterDetailViewProps = {
  id: string;
  initialModel: CharacterModel;
};

export function CharacterDetailView({ id, initialModel }: CharacterDetailViewProps) {
  const { data } = useCharacter(id, { initialData: initialModel });
  const model = data ?? initialModel;

  const infoRows: Array<{ label: string; value: string | number | undefined }> = [
    { label: 'Species', value: model.species },
    { label: 'Origin', value: model.origin },
    { label: 'Releases', value: model.releaseCount },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              width: '100%',
              aspectRatio: '3 / 4',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: '#fff',
              position: 'relative',
            }}
          >
            {model.imageUrl ? (
              <Image
                src={model.imageUrl}
                alt={model.displayName ?? 'Character image'}
                fill
                sizes="(max-width: 900px) 100vw, 400px"
                style={{ objectFit: 'contain' }}
                priority
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            ) : null}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1.5 }}>
            {model.displayName}
          </Typography>

          {model.description ? (
            <Typography variant="body1" sx={{ mb: 2.5, whiteSpace: 'pre-wrap' }}>
              {model.description}
            </Typography>
          ) : null}

          <Stack spacing={1.25} sx={{ mb: 2.5 }}>
            {infoRows
              .filter((row) => row.value !== undefined && row.value !== '')
              .map((row) => (
                <Box key={row.label} sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 120 }}>
                    {row.label}
                  </Typography>
                  <Typography variant="body1">{row.value}</Typography>
                </Box>
              ))}
          </Stack>

          {model.generations.length > 0 ? (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.75 }}>
                Generations
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {model.generations.map((generation) => (
                  <Chip key={generation} label={generation} size="small" />
                ))}
              </Stack>
            </Box>
          ) : null}

          {model.tags.length > 0 ? (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.75 }}>
                Tags
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {model.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          ) : null}

          {model.seriesAppearances.length > 0 ? (
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.75 }}>
                Series Appearances
              </Typography>
              <Stack spacing={0.5}>
                {model.seriesAppearances.map((seriesName) => (
                  <Typography key={seriesName} variant="body2" sx={{ color: 'text.secondary' }}>
                    {seriesName}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
}
