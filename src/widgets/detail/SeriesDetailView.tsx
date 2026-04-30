'use client';

import Image from 'next/image';
import { Box, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import type { SeriesModel } from '@entities/series';
import { useSeries } from '@/shared/api/hooks';
import { BLUR_DATA_URL } from '@shared/ui/imagePlaceholder';

type SeriesDetailViewProps = {
  id: string;
  initialModel: SeriesModel;
};

export function SeriesDetailView({ id, initialModel }: SeriesDetailViewProps) {
  const { data } = useSeries(id, { initialData: initialModel });
  const model = data ?? initialModel;

  const years =
    model.yearStart && model.yearEnd
      ? `${model.yearStart}-${model.yearEnd}`
      : model.yearStart
        ? `${model.yearStart}`
        : undefined;

  const infoRows: Array<{ label: string; value: string | number | undefined }> = [
    { label: 'Generation', value: model.generation },
    { label: 'Type', value: model.seriesType },
    { label: 'Status', value: model.status },
    { label: 'Years', value: years },
    { label: 'Releases', value: model.releaseCount },
    { label: 'Characters', value: model.characterCount },
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
                alt={model.displayName ?? 'Series image'}
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

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2.5 }}>
            {model.generation ? <Chip label={model.generation} size="small" /> : null}
            {model.seriesType ? <Chip label={model.seriesType} size="small" variant="outlined" /> : null}
            {model.status ? <Chip label={model.status} size="small" variant="outlined" /> : null}
          </Stack>

          <Stack spacing={1.25}>
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
        </Grid>
      </Grid>

      {(model.concept || model.colorPalette.length > 0 || model.dolls.length > 0) && (
        <Divider sx={{ my: { xs: 3, md: 4 } }} />
      )}

      {model.concept ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.25 }}>
            Concept
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {model.concept}
          </Typography>
        </Box>
      ) : null}

      {model.colorPalette.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.25 }}>
            Color Palette
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {model.colorPalette.map((item) => (
              <Chip key={`${item.hex}-${item.name}`} label={`${item.name} (${item.hex})`} size="small" variant="outlined" />
            ))}
          </Stack>
        </Box>
      ) : null}

      {model.dolls.length > 0 ? (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.25 }}>
            Dolls
          </Typography>
          <Stack spacing={1}>
            {model.dolls.slice(0, 24).map((doll) => (
              <Typography key={`${doll.id}-${doll.character}`} variant="body2" sx={{ color: 'text.secondary' }}>
                {doll.character}
                {doll.variant ? ` - ${doll.variant}` : ''}
                {doll.year ? ` (${doll.year})` : ''}
              </Typography>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
