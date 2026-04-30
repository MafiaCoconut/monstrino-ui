'use client';

import React, { useMemo, useState } from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { useSeriesList } from '@/shared/api/hooks';
import { SeriesCard } from '@cards/series-card';
import { SeriesCardSkeleton } from '@/shared/ui/skeletons';
import {
  CatalogHeader,
  CatalogPage,
  CatalogPagination,
  CatalogResultsToolbar,
  type CatalogSortOption,
} from '@/widgets/catalog';

const SORT_OPTIONS: CatalogSortOption[] = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'year', label: 'Year Label' },
  { value: 'releaseCount', label: 'Release Count' },
];

const ITEMS_PER_PAGE = 12;

const SeriesCatalog: React.FC = () => {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const { data: series = [], isPending } = useSeriesList();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? series.filter((item) => item.name.toLowerCase().includes(q))
      : series.slice();

    base.sort((a, b) => {
      if (sortBy === 'releaseCount') {
        return (b.releaseCount ?? 0) - (a.releaseCount ?? 0);
      }
      if (sortBy === 'year') {
        return (a.yearLabel ?? '').localeCompare(b.yearLabel ?? '');
      }
      return a.name.localeCompare(b.name);
    });

    return base;
  }, [series, query, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <CatalogPage minHeight="100vh">
      <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 1.5, sm: 2, md: 4 }, py: { xs: 2, sm: 3 } }}>
        <CatalogHeader title="Series Catalog" />

        <TextField
          fullWidth
          size="small"
          placeholder="Search series..."
          value={query}
          onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }}
          sx={{ mb: 2 }}
        />

        <CatalogResultsToolbar
          resultCount={filtered.length}
          sortBy={sortBy}
          sortOptions={SORT_OPTIONS}
          onSortChange={(v) => { setSortBy(v); setCurrentPage(1); }}
          sx={{ mb: { xs: 1.5, sm: 1 } }}
          formControlSx={{ minWidth: { xs: '100%', sm: 180 }, flex: { xs: 1, sm: 'none' } }}
        />

        {isPending && filtered.length === 0 ? (
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                <SeriesCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
            {paginated.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
                <SeriesCard {...item} />
              </Grid>
            ))}
          </Grid>
        )}

        {!isPending && filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 8 } }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              No series found
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
              Try adjusting your search query
            </Typography>
          </Box>
        )}

        {totalPages > 1 && (
          <CatalogPagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
        )}
      </Box>
    </CatalogPage>
  );
};

export default SeriesCatalog;
