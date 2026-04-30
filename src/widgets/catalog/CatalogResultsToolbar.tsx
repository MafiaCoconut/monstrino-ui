import React from 'react';
import {
  Box,
  Button,
  Chip,
  Typography,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import { mergeSx } from '@/shared/ui/mergeSx';
import { SortSelect } from '@features/sorting';

export type CatalogSortOption = {
  value: string;
  label: string;
};

interface CatalogResultsToolbarProps {
  resultCount: number;
  sortBy: string;
  sortOptions: CatalogSortOption[];
  onSortChange: (value: string) => void;
  onFiltersClick?: () => void;
  activeFilterCount?: number;
  sx?: SxProps<Theme>;
  formControlSx?: SxProps<Theme>;
}

export const CatalogResultsToolbar: React.FC<CatalogResultsToolbarProps> = ({
  resultCount,
  sortBy,
  sortOptions,
  onSortChange,
  onFiltersClick,
  activeFilterCount = 0,
  sx,
  formControlSx,
}) => (
  <Box
    sx={mergeSx(
      {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: { xs: 1.5, sm: 2 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1.5, sm: 0 },
      },
      sx
    )}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={onFiltersClick}
        sx={{
          display: { xs: 'flex', md: 'none' },
          textTransform: 'none',
          flex: { xs: 1, sm: 'none' },
        }}
      >
        Filters
        {activeFilterCount > 0 && (
          <Chip
            label={activeFilterCount}
            size="small"
            sx={{
              ml: 1,
              height: 18,
              backgroundColor: 'primary.main',
              color: 'white',
              fontSize: '0.65rem',
            }}
          />
        )}
      </Button>

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontSize: { xs: '0.8125rem', sm: '0.875rem' },
          display: { xs: 'none', sm: 'block' },
        }}
      >
        {resultCount} result{resultCount !== 1 ? 's' : ''}
      </Typography>
    </Box>

    <SortSelect
      value={sortBy}
      options={sortOptions}
      onChange={onSortChange}
      sx={mergeSx(
        {
          minWidth: { xs: '100%', sm: 160 },
          flex: { xs: 1, sm: 'none' },
        },
        formControlSx
      )}
    />
  </Box>
);
