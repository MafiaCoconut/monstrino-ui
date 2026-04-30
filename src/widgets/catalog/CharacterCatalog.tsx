'use client';

import React, { useMemo, useState } from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { useCharactersList } from '@/shared/api/hooks';
import { CharacterCard } from '@cards/character-card';
import { CharacterCardSkeleton } from '@/shared/ui/skeletons';
import {
  CatalogHeader,
  CatalogPage,
  CatalogPagination,
  CatalogResultsToolbar,
  type CatalogSortOption,
} from '@/widgets/catalog';

const SORT_OPTIONS: CatalogSortOption[] = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'releaseCount', label: 'Release Count' },
  { value: 'species', label: 'Species' },
];

const ITEMS_PER_PAGE = 12;

const CharacterCatalog: React.FC = () => {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const { data: characters = [], isPending } = useCharactersList();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? characters.filter((item) => {
          const haystack = `${item.name} ${item.species}`.toLowerCase();
          return haystack.includes(q);
        })
      : characters.slice();

    base.sort((a, b) => {
      if (sortBy === 'releaseCount') {
        return (b.releaseCount ?? 0) - (a.releaseCount ?? 0);
      }
      if (sortBy === 'species') {
        return a.species.localeCompare(b.species);
      }
      return a.name.localeCompare(b.name);
    });

    return base;
  }, [characters, query, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <CatalogPage minHeight="100vh">
      <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 1.5, sm: 2, md: 4 }, py: { xs: 2, sm: 3 } }}>
        <CatalogHeader title="Characters Catalog" />

        <TextField
          fullWidth
          size="small"
          placeholder="Search characters..."
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
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} key={i}>
                <CharacterCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
            {paginated.map((character, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} key={character.id}>
                <CharacterCard {...character} priority={index < 6} />
              </Grid>
            ))}
          </Grid>
        )}

        {!isPending && filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 8 } }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              No characters found
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

export default CharacterCatalog;
