'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Box, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import type { ReleaseModel } from '@entities/release';
import { useRelease } from '@/shared/api/hooks';
import { BLUR_DATA_URL } from '@shared/ui/imagePlaceholder';

type ReleaseDetailViewProps = {
  id: string;
  initialModel: ReleaseModel;
};

export function ReleaseDetailView({ id, initialModel }: ReleaseDetailViewProps) {
  const { data } = useRelease(id, { initialData: initialModel });
  const model = data ?? initialModel;

  const infoRows: Array<{ label: string; value: string | number | undefined }> = [
    { label: 'Series', value: model.seriesName },
    { label: 'Character', value: model.characterName },
    { label: 'Release Date', value: model.releaseDateLabel ?? model.releaseDate },
    { label: 'Year', value: model.year },
    { label: 'SKU', value: model.sku },
    { label: 'Price', value: model.price },
    { label: 'Stock', value: model.stockStatusLabel ?? model.stockStatus },
    { label: 'Pack Size', value: model.packSize },
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
                alt={model.displayName ?? 'Release image'}
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

          {model.subtitle ? (
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
              {model.subtitle}
            </Typography>
          ) : null}

          {model.description ? (
            <Typography variant="body1" sx={{ mb: 2.5, whiteSpace: 'pre-wrap' }}>
              {model.description}
            </Typography>
          ) : null}

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2.5 }}>
            {model.generation ? <Chip label={model.generation} size="small" /> : null}
            {model.rarity ? <Chip label={model.rarity} size="small" /> : null}
            {model.releaseTypes.map((type) => (
              <Chip key={type} label={type} size="small" variant="outlined" />
            ))}
            {model.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
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

          {(model.seriesId || model.characterId) && (
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              {model.seriesId ? (
                <Link href={`/catalog/s/${model.seriesId}`}>Series Page</Link>
              ) : null}
              {model.characterId ? (
                <Link href={`/catalog/c/${model.characterId}`}>Character Page</Link>
              ) : null}
            </Stack>
          )}
        </Grid>
      </Grid>

      {(model.pricing.length > 0 || model.variants.length > 0) && <Divider sx={{ my: { xs: 3, md: 4 } }} />}

      {model.pricing.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
            Pricing by Region
          </Typography>
          <Stack spacing={1}>
            {model.pricing.map((region) => (
              <Typography key={`${region.code}-${region.currency}`} variant="body2" sx={{ color: 'text.secondary' }}>
                {region.code} ({region.currency}): MSRP {region.msrp}, Market {region.market}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}

      {model.variants.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
            Variants
          </Typography>
          <Stack spacing={1}>
            {model.variants.map((variant) => (
              <Typography key={`${variant.type}-${variant.name}`} variant="body2" sx={{ color: 'text.secondary' }}>
                {variant.type}: {variant.name} {variant.year ? `(${variant.year})` : ''}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
