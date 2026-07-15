'use client';

import Image from 'next/image';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import type { ReleaseModel } from '@entities/release';
import { BLUR_DATA_URL } from '@shared/ui/imagePlaceholder';

const PLACEHOLDER_IMAGE = '/placeholder-release.svg';

type ReleaseDetailViewProps = {
  model: ReleaseModel;
};

export function ReleaseDetailView({ model }: ReleaseDetailViewProps) {
  const infoRows: Array<{ label: string; value: string | number | undefined }> = [
    { label: 'Slug', value: model.slug },
    { label: 'Code', value: model.code },
    { label: 'MPN', value: model.mpn },
    { label: 'Year', value: model.year },
    { label: 'Created', value: model.createdAt },
    { label: 'Updated', value: model.updatedAt },
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
            <Image
              src={model.primaryImageUrl ?? PLACEHOLDER_IMAGE}
              alt={model.title}
              fill
              sizes="(max-width: 900px) 100vw, 400px"
              style={{ objectFit: 'contain' }}
              priority
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1.5 }}>
            {model.title}
          </Typography>

          {model.description ? (
            <Typography variant="body1" sx={{ mb: 2.5, whiteSpace: 'pre-wrap' }}>
              {model.description}
            </Typography>
          ) : null}

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

          {model.textFromBox ? (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
                Text From Box
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {model.textFromBox}
              </Typography>
            </>
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
}
