'use client';
import Image from 'next/image';
import { Link as RouterLink } from '@/shared/router';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { mergeSx } from '@/shared/ui/mergeSx';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const PLACEHOLDER_IMAGE = '/placeholder.svg';

interface ReleaseCardSpotlightProps {
  slug: string;
  title: string;
  code: string;
  year?: number;
  imageUrl?: string;
  chipLabel?: string;
  /** Pass true for above-the-fold spotlight cards to boost LCP */
  priority?: boolean;
  cardSx?: SxProps<Theme>;
  mediaSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
}

const ReleaseCardSpotlight = ({
  slug,
  title,
  code,
  year,
  imageUrl,
  chipLabel,
  priority = false,
  cardSx,
  mediaSx,
  contentSx,
}: ReleaseCardSpotlightProps) => {
  return (
    <Card
      component={RouterLink}
      to={`/catalog/r/${slug}`}
      sx={mergeSx(
        {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          textDecoration: 'none',
          position: 'relative',
          overflow: 'visible',
        },
        cardSx
      )}
    >
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'rgba(255, 20, 147, 0.2)',
            color: 'primary.main',
          },
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <FavoriteBorderIcon fontSize="small" />
      </IconButton>

      <Box
        sx={mergeSx(
          {
            height: 340,
            backgroundColor: 'background.default',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(to top, rgba(20, 20, 32, 0.9) 0%, transparent 100%)',
              zIndex: 1,
            },
          },
          mediaSx
        )}
      >
        <Image
          src={imageUrl ?? PLACEHOLDER_IMAGE}
          alt={title}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 400px"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          priority={priority}
        />
      </Box>

      <CardContent sx={mergeSx({ flex: 1, pt: 2 }, contentSx)}>
        <Typography
          variant="body2"
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            fontSize: '0.75rem',
            mb: 0.5,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {code}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={chipLabel ?? slug}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: 'text.secondary',
                fontSize: '0.7rem',
              }}
            />
            {year && (
              <Typography variant="caption" color="text.secondary">
                {year}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReleaseCardSpotlight;
