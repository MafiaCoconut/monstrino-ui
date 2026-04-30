'use client';

import React from 'react';
import Image from 'next/image';
import { Link as RouterLink } from '@/shared/router';
import { Box, Typography, Chip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { mergeSx } from '@/shared/ui/mergeSx';

// Design tokens matching SeriesIndex theme
const tokens = {
  colors: {
    background: 'hsl(240, 6%, 5%)',
    foreground: 'hsl(0, 0%, 98%)',
    card: 'hsl(240, 5%, 8%)',
    primary: 'hsl(270, 25%, 60%)',
    secondary: 'hsl(240, 4%, 14%)',
    mutedForeground: 'hsl(240, 5%, 58%)',
    border: 'hsl(240, 4%, 18%)',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
  },
  fontWeights: {
    semibold: 600,
  },
};

interface DollRelease {
  id: string | number;
  releaseId?: string | number;
  character: string;
  variant?: string;
  imageUrl?: string;
  rarity?: string;
  year?: string | number;
}

interface ReleaseCardMinimalProps {
  doll: DollRelease;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  size?: 'compact' | 'full' | 'reduced';
  enableHoverLift?: boolean;
  /** Pass true for above-the-fold cards to boost LCP */
  priority?: boolean;
  containerSx?: SxProps<Theme>;
  cardSx?: SxProps<Theme>;
  imageSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
}

// Rarity badge styling helper
const getRarityStyle = (rarity: string): React.CSSProperties => {
  switch (rarity) {
    case 'Ultra Rare':
      return { backgroundColor: tokens.colors.primary, color: tokens.colors.foreground };
    case 'Rare':
      return { backgroundColor: `${tokens.colors.primary}33`, color: tokens.colors.primary };
    default:
      return { backgroundColor: tokens.colors.secondary, color: tokens.colors.foreground };
  }
};

const ReleaseCardMinimal: React.FC<ReleaseCardMinimalProps> = ({
  doll,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  size = 'compact',
  enableHoverLift = false,
  priority = false,
  containerSx,
  cardSx,
  imageSx,
  contentSx,
}) => {
  const isFull = size === 'full';
  const isReduced = size === 'reduced';
  const cardMaxWidth = isFull ? '100%' : isReduced ? '220px' : '180px';
  const cardMinWidth = isFull ? 0 : isReduced ? '160px' : '140px';
  const rarity = doll.rarity ?? 'Common';
  const releaseHref = `/catalog/r/${doll.releaseId ?? doll.id}`;

  return (
    <Box
      component={RouterLink}
      to={releaseHref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={mergeSx(
        {
          textDecoration: 'none',
          color: 'inherit',
          display: isReduced ? 'flex' : 'block',
          justifyContent: isReduced ? 'center' : 'flex-start',
          height: isFull ? '100%' : 'auto',
          width: '100%',
        },
        containerSx
      )}
    >
      <Box
        sx={mergeSx(
          {
            borderRadius: '0.5rem',
            border: `1px solid ${isHovered ? `${tokens.colors.primary}80` : tokens.colors.border}`,
            backgroundColor: tokens.colors.card,
            cursor: 'pointer',
            transition: enableHoverLift
              ? 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.3s'
              : 'border-color 0.3s',
            width: '100%',
            maxWidth: cardMaxWidth,
            minWidth: cardMinWidth,
            height: isFull ? '100%' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            ...(enableHoverLift
              ? {
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-4px)' },
                    boxShadow: { xs: 'none', md: '0 8px 24px rgba(236, 72, 153, 0.15)' },
                  },
                }
              : {}),
          },
          cardSx
        )}
      >
        {/* Image Container */}
        <Box
          sx={mergeSx(
            {
              height: '0',
              paddingTop: '140%', // Aspect ratio для изображения
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '0.375rem 0.375rem 0 0',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s',
              position: 'relative',
              flexShrink: 0,
            },
            imageSx
          )}
        >
          <Image
            src={doll.imageUrl ?? '/placeholder.svg'}
            alt={doll.variant ?? doll.character}
            fill
            sizes="(max-width: 600px) 50vw, 220px"
            style={{ objectFit: 'contain', objectPosition: 'center' }}
            priority={priority}
          />
        </Box>

        {/* Content */}
        <Box sx={mergeSx({ p: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }, contentSx)}>
          {/* Character Name */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: tokens.fontWeights.semibold,
              color: tokens.colors.foreground,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '0.875rem',
            }}
          >
            {doll.character}
          </Typography>

          {/* Variant */}
          <Typography
            sx={{
              fontSize: tokens.fontSizes.xs,
              color: tokens.colors.mutedForeground,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {doll.variant}
          </Typography>

          {/* Footer: Rarity and Year */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.375rem',
              marginTop: 'auto',
            }}
          >
            <Chip
              label={rarity}
              size="small"
              sx={{
                fontSize: '10px',
                height: '20px',
                padding: '0 0.375rem',
                ...getRarityStyle(rarity),
                border: 'none',
              }}
            />
            <Typography
              component="span"
              sx={{
                fontSize: tokens.fontSizes.sm,
                color: tokens.colors.mutedForeground,
              }}
            >
              {doll.year}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ReleaseCardMinimal;
