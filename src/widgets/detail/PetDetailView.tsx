'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import type { PetModel } from '@entities/pet';
import { usePet } from '@/shared/api/hooks';
import { BLUR_DATA_URL } from '@shared/ui/imagePlaceholder';

type PetDetailViewProps = {
  id: string;
  initialModel: PetModel;
};

export function PetDetailView({ id, initialModel }: PetDetailViewProps) {
  const { data } = usePet(id, { initialData: initialModel });
  const model = data ?? initialModel;

  const infoRows: Array<{ label: string; value: string | undefined }> = [
    { label: 'Species', value: model.species },
    { label: 'Generation', value: model.generation },
    { label: 'Type', value: model.type },
    { label: 'Subtype', value: model.subtype },
    { label: 'Rarity', value: model.rarity },
    { label: 'Exclusivity', value: model.exclusivity },
    { label: 'Owner', value: model.ownerName },
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
                alt={model.displayName ?? 'Pet image'}
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

          {model.exclusivityNote ? (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {model.exclusivityNote}
            </Typography>
          ) : null}

          {(model.ownerName || model.rarity || model.exclusivity) ? (
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {model.rarity ? <Chip label={model.rarity} size="small" /> : null}
              {model.exclusivity ? <Chip label={model.exclusivity} size="small" variant="outlined" /> : null}
            </Stack>
          ) : null}
        </Grid>
      </Grid>

      {model.owners.length > 0 ? (
        <Box sx={{ mt: { xs: 3, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.25 }}>
            Owners
          </Typography>
          <Stack spacing={0.75}>
            {model.owners.map((owner) => (
              <Typography key={`${owner.id}-${owner.name}`} variant="body2" sx={{ color: 'text.secondary' }}>
                {owner.name}
                {owner.role ? ` (${owner.role})` : ''}
              </Typography>
            ))}
          </Stack>
        </Box>
      ) : null}

      {model.releases.length > 0 ? (
        <Box sx={{ mt: { xs: 3, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.25 }}>
            Releases
          </Typography>
          <Stack spacing={0.75}>
            {model.releases.map((release) => (
              <Typography key={`${release.id}-${release.name}`} variant="body2" sx={{ color: 'text.secondary' }}>
                <Link href={`/catalog/r/${release.id}`}>{release.name}</Link>
                {release.year ? ` (${release.year})` : ''}
              </Typography>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
