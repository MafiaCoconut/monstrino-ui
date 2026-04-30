'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  Button,
  Grid,
} from '@mui/material';
import { useElementHeight } from './useElementHeight';
import { useReleasesList } from '@/shared/api/hooks';
import type { ReleaseModel } from '@entities/release';
import { GENERATIONS } from '@entities/shared';
import { RELEASE_RARITIES, RELEASE_TYPES } from '@entities/release';
import { useReleasesFilter, RELEASE_SORT_OPTIONS } from '@features/search';
import ReleaseCardCatalog from '@cards/release-card/ReleaseCardCatalog';
import { CatalogCardSkeleton } from '@/shared/ui/skeletons';
import {
  CatalogFiltersShell,
  CatalogHeader,
  CatalogLayout,
  CatalogPage,
  CatalogPagination,
  CatalogResultsToolbar,
  FilterSection,
} from '@/widgets/catalog';

// Defer mobile-only Drawer — not needed on initial paint (INP optimization)
const CatalogFiltersDrawer = dynamic(
  () => import('@/widgets/catalog/CatalogFiltersDrawer').then((m) => ({ default: m.CatalogFiltersDrawer })),
  { ssr: false, loading: () => null },
);

// ============================================
// WIDGET COMPONENTS
// ============================================

// Sort options defined in @features/search (RELEASE_SORT_OPTIONS)

interface FiltersSidebarProps {
  activeFilterCount: number;
  clearAllFilters: () => void;
  seriesList: string[];
  charactersList: string[];
  releaseTypeList: string[];
  rarityList: string[];
  tagsList: string[];
  selectedGenerations: string[];
  selectedSeries: string[];
  selectedCharacters: string[];
  selectedReleaseTypes: string[];
  selectedRarities: string[];
  selectedTags: string[];
  setSelectedGenerations: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedSeries: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedCharacters: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedReleaseTypes: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedRarities: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  toggleArrayFilter: (
    value: string,
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => void;
  showMoreSeries: boolean;
  showMoreCharacters: boolean;
  showMoreReleaseTypes: boolean;
  showMoreRarities: boolean;
  showMoreTags: boolean;
  setShowMoreSeries: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMoreCharacters: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMoreReleaseTypes: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMoreRarities: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMoreTags: React.Dispatch<React.SetStateAction<boolean>>;
  catalogHeight?: number | null;
  isMobile?: boolean;
  onClose?: () => void;
}


const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  activeFilterCount,
  clearAllFilters,
  seriesList,
  charactersList,
  releaseTypeList,
  rarityList,
  tagsList,
  selectedGenerations,
  selectedSeries,
  selectedCharacters,
  selectedReleaseTypes,
  selectedRarities,
  selectedTags,
  setSelectedGenerations,
  setSelectedSeries,
  setSelectedCharacters,
  setSelectedReleaseTypes,
  setSelectedRarities,
  setSelectedTags,
  toggleArrayFilter,
  showMoreSeries,
  showMoreCharacters,
  showMoreReleaseTypes,
  showMoreRarities,
  showMoreTags,
  setShowMoreSeries,
  setShowMoreCharacters,
  setShowMoreReleaseTypes,
  setShowMoreRarities,
  setShowMoreTags,
  catalogHeight,
  isMobile = false,
  onClose,
}) => (
  <CatalogFiltersShell
    activeFilterCount={activeFilterCount}
    onClearAll={clearAllFilters}
    height={catalogHeight}
    isMobile={isMobile}
    onClose={onClose}
  >
    <FilterSection title="Generation">
      <FormGroup>
        {GENERATIONS.map((gen) => (
          <FormControlLabel
            key={gen}
            control={
              <Checkbox
                checked={selectedGenerations.includes(gen)}
                onChange={() => toggleArrayFilter(gen, setSelectedGenerations)}
                size="small"
                sx={{
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.9375rem', md: '0.8rem', lg: '0.85rem' },
                  fontWeight: 500,
                  color: selectedGenerations.includes(gen) ? 'text.primary' : 'text.secondary',
                  transition: 'color 0.2s',
                }}
              >
                {gen}
              </Typography>
            }
            sx={{
              mb: 0.25,
              ml: -0.5,
              py: 0.5,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.03)',
              },
            }}
          />
        ))}
      </FormGroup>
    </FilterSection>

    <FilterSection title="Series">
      <FormGroup>
        {(showMoreSeries ? seriesList : seriesList.slice(0, 8)).map((series) => (
          <FormControlLabel
            key={series}
            control={
              <Checkbox
                checked={selectedSeries.includes(series)}
                onChange={() => toggleArrayFilter(series, setSelectedSeries)}
                size="small"
                sx={{
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.9375rem', md: '0.8rem', lg: '0.85rem' },
                  fontWeight: 500,
                  color: selectedSeries.includes(series) ? 'text.primary' : 'text.secondary',
                  transition: 'color 0.2s',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: { xs: '100%', md: 140, lg: 160 },
                }}
              >
                {series}
              </Typography>
            }
            sx={{
              mb: 0.25,
              ml: -0.5,
              py: 0.5,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.03)',
              },
            }}
          />
        ))}
      </FormGroup>
      {seriesList.length > 8 && (
        <Button
          onClick={() => setShowMoreSeries(!showMoreSeries)}
          size="small"
          sx={{
            mt: 1,
            fontSize: { xs: '0.8125rem', md: '0.75rem', lg: '0.8rem' },
            color: 'primary.main',
            textTransform: 'none',
            fontWeight: 500,
            px: 0,
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          {showMoreSeries ? 'Show less' : `Show more (${seriesList.length - 8})`}
        </Button>
      )}
    </FilterSection>

    <FilterSection title="Character" defaultOpen={false}>
      <FormGroup>
        {(showMoreCharacters ? charactersList : charactersList.slice(0, 8)).map((char) => (
          <FormControlLabel
            key={char}
            control={
              <Checkbox
                checked={selectedCharacters.includes(char)}
                onChange={() => toggleArrayFilter(char, setSelectedCharacters)}
                size="small"
                sx={{
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.9375rem', md: '0.8rem', lg: '0.85rem' },
                  fontWeight: 500,
                  color: selectedCharacters.includes(char) ? 'text.primary' : 'text.secondary',
                  transition: 'color 0.2s',
                }}
              >
                {char}
              </Typography>
            }
            sx={{
              mb: 0.25,
              ml: -0.5,
              py: 0.5,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.03)',
              },
            }}
          />
        ))}
      </FormGroup>
      {charactersList.length > 8 && (
        <Button
          onClick={() => setShowMoreCharacters(!showMoreCharacters)}
          size="small"
          sx={{
            mt: 1,
            fontSize: { xs: '0.8125rem', md: '0.75rem', lg: '0.8rem' },
            color: 'primary.main',
            textTransform: 'none',
            fontWeight: 500,
            px: 0,
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          {showMoreCharacters ? 'Show less' : `Show more (${charactersList.length - 8})`}
        </Button>
      )}
    </FilterSection>

    <FilterSection title="Release Type" defaultOpen={false}>
      <FormGroup>
        {(showMoreReleaseTypes ? releaseTypeList : releaseTypeList.slice(0, 8)).map((type) => (
          <FormControlLabel
            key={type}
            control={
              <Checkbox
                checked={selectedReleaseTypes.includes(type)}
                onChange={() => toggleArrayFilter(type, setSelectedReleaseTypes)}
                size="small"
                sx={{
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.9375rem', md: '0.8rem', lg: '0.85rem' },
                  fontWeight: 500,
                  color: selectedReleaseTypes.includes(type) ? 'text.primary' : 'text.secondary',
                  transition: 'color 0.2s',
                }}
              >
                {type}
              </Typography>
            }
            sx={{
              mb: 0.25,
              ml: -0.5,
              py: 0.5,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.03)',
              },
            }}
          />
        ))}
      </FormGroup>
      {releaseTypeList.length > 8 && (
        <Button
          onClick={() => setShowMoreReleaseTypes(!showMoreReleaseTypes)}
          size="small"
          sx={{
            mt: 1,
            fontSize: { xs: '0.8125rem', md: '0.75rem', lg: '0.8rem' },
            color: 'primary.main',
            textTransform: 'none',
            fontWeight: 500,
            px: 0,
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          {showMoreReleaseTypes ? 'Show less' : `Show more (${releaseTypeList.length - 8})`}
        </Button>
      )}
    </FilterSection>

    <FilterSection title="Rarity" defaultOpen={false}>
      <FormGroup>
        {(showMoreRarities ? rarityList : rarityList.slice(0, 8)).map((rarity) => (
          <FormControlLabel
            key={rarity}
            control={
              <Checkbox
                checked={selectedRarities.includes(rarity)}
                onChange={() => toggleArrayFilter(rarity, setSelectedRarities)}
                size="small"
                sx={{
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.9375rem', md: '0.8rem', lg: '0.85rem' },
                  fontWeight: 500,
                  color: selectedRarities.includes(rarity) ? 'text.primary' : 'text.secondary',
                  transition: 'color 0.2s',
                }}
              >
                {rarity}
              </Typography>
            }
            sx={{
              mb: 0.25,
              ml: -0.5,
              py: 0.5,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.03)',
              },
            }}
          />
        ))}
      </FormGroup>
      {rarityList.length > 8 && (
        <Button
          onClick={() => setShowMoreRarities(!showMoreRarities)}
          size="small"
          sx={{
            mt: 1,
            fontSize: { xs: '0.8125rem', md: '0.75rem', lg: '0.8rem' },
            color: 'primary.main',
            textTransform: 'none',
            fontWeight: 500,
            px: 0,
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          {showMoreRarities ? 'Show less' : `Show more (${rarityList.length - 8})`}
        </Button>
      )}
    </FilterSection>

    <FilterSection title="Tags" defaultOpen={false}>
      <FormGroup>
        {(showMoreTags ? tagsList : tagsList.slice(0, 8)).map((tag) => (
          <FormControlLabel
            key={tag}
            control={
              <Checkbox
                checked={selectedTags.includes(tag)}
                onChange={() => toggleArrayFilter(tag, setSelectedTags)}
                size="small"
                sx={{
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.9375rem', md: '0.8rem', lg: '0.85rem' },
                  fontWeight: 500,
                  color: selectedTags.includes(tag) ? 'text.primary' : 'text.secondary',
                  transition: 'color 0.2s',
                }}
              >
                {tag}
              </Typography>
            }
            sx={{
              mb: 0.25,
              ml: -0.5,
              py: 0.5,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.03)',
              },
            }}
          />
        ))}
      </FormGroup>
      {tagsList.length > 8 && (
        <Button
          onClick={() => setShowMoreTags(!showMoreTags)}
          size="small"
          sx={{
            mt: 1,
            fontSize: { xs: '0.8125rem', md: '0.75rem', lg: '0.8rem' },
            color: 'primary.main',
            textTransform: 'none',
            fontWeight: 500,
            px: 0,
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          {showMoreTags ? 'Show less' : `Show more (${tagsList.length - 8})`}
        </Button>
      )}
    </FilterSection>
  </CatalogFiltersShell>
);

const releaseCatalogCardLayout = {
  cardSx: {
    height: { xs: 360, sm: 480, md: 580, lg: 630 },
  },
  imageSx: { paddingTop: { xs: '140%', sm: '145%', md: '150%' } },
  contentSx: { p: { xs: 1, sm: 1.5, md: 2 } },
};

interface ReleaseGridProps {
  releases: ReleaseModel[];
}

const ReleaseGrid: React.FC<ReleaseGridProps> = ({ releases }) => (
  <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
    {releases.map((release, index) => (
      <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3 }} key={release.id}>
        <ReleaseCardCatalog
          release={release}
          priority={index < 4}
          cardSx={releaseCatalogCardLayout.cardSx}
          imageSx={releaseCatalogCardLayout.imageSx}
          contentSx={releaseCatalogCardLayout.contentSx}
        />
      </Grid>
    ))}
  </Grid>
);

const SKELETON_COUNT = 12;

const ReleaseGridSkeleton: React.FC = () => (
  <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
      <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3 }} key={i}>
        <CatalogCardSkeleton
          imagePaddingTop="145%"
          cardSx={releaseCatalogCardLayout.cardSx}
        />
      </Grid>
    ))}
  </Grid>
);

const EmptyResults: React.FC = () => (
  <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 8 } }}>
    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
      No releases found
    </Typography>
    <Typography variant="body2" sx={{ color: '#6B7280', fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
      Try adjusting your filters or search query
    </Typography>
  </Box>
);

// ============================================
// MAIN CATALOG COMPONENT
// ============================================

const ReleaseCatalog: React.FC = () => {
  const { ref: catalogRef, height: catalogHeight } = useElementHeight<HTMLDivElement>();

  // ─── URL-persisted filter state (4.4) ────────────────────────────────────────
  const { filter, setFilter, clearFilter, makeArraySetter, activeFilterCount } =
    useReleasesFilter();

  const searchQuery = filter.q ?? '';
  const selectedGenerations = (filter.generations as string[]) ?? [];
  const selectedSeries = filter.series ?? [];
  const selectedCharacters = filter.characters ?? [];
  const selectedReleaseTypes = (filter.releaseTypes as string[]) ?? [];
  const selectedRarities = (filter.rarities as string[]) ?? [];
  const selectedTags = (filter.tags as string[]) ?? [];
  const sortBy = filter.sort ?? 'releaseDate';
  const apiFilters = useMemo(
    () => ({
      q: searchQuery || undefined,
      generations: selectedGenerations.length > 0 ? selectedGenerations : undefined,
      series: selectedSeries.length > 0 ? selectedSeries : undefined,
      characters: selectedCharacters.length > 0 ? selectedCharacters : undefined,
      releaseTypes: selectedReleaseTypes.length > 0 ? selectedReleaseTypes : undefined,
      rarities: selectedRarities.length > 0 ? selectedRarities : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      sort: sortBy !== 'releaseDate' ? sortBy : undefined,
    }),
    [
      searchQuery,
      selectedGenerations,
      selectedSeries,
      selectedCharacters,
      selectedReleaseTypes,
      selectedRarities,
      selectedTags,
      sortBy,
    ],
  );
  const { data: allReleasesData } = useReleasesList();
  const { data: apiReleases, isPending: isReleasesPending } = useReleasesList(apiFilters);
  const allReleases = allReleasesData ?? [];
  const seriesList = useMemo(
    () => Array.from(new Set(allReleases.map((release) => release.seriesName).filter(Boolean))).sort(),
    [allReleases],
  );
  const charactersList = useMemo(() => {
    const set = new Set<string>();
    allReleases.forEach((release) => {
      if (release.characterName) set.add(release.characterName);
      release.characters?.forEach((character) => {
        if (character?.name) set.add(character.name);
      });
    });
    return Array.from(set).sort();
  }, [allReleases]);
  const releaseTypeList = useMemo(() => {
    const set = new Set<string>();
    allReleases.forEach((release) => {
      release.releaseTypes.forEach((type) => set.add(type));
    });
    return set.size > 0 ? Array.from(set).sort() : [...RELEASE_TYPES];
  }, [allReleases]);
  const rarityList = useMemo(() => {
    const set = new Set<string>();
    allReleases.forEach((release) => {
      if (release.rarity) set.add(release.rarity);
    });
    return set.size > 0 ? Array.from(set).sort() : [...RELEASE_RARITIES];
  }, [allReleases]);
  const tagsList = useMemo(() => {
    const set = new Set<string>();
    allReleases.forEach((release) => {
      release.tags.forEach((tag) => set.add(tag));
    });
    return Array.from(set).sort();
  }, [allReleases]);

  // Dispatch-compatible setters for FiltersSidebar (write to URL params)
  const setSelectedGenerations = makeArraySetter('generations') as React.Dispatch<React.SetStateAction<string[]>>;
  const setSelectedSeries = makeArraySetter('series') as React.Dispatch<React.SetStateAction<string[]>>;
  const setSelectedCharacters = makeArraySetter('characters') as React.Dispatch<React.SetStateAction<string[]>>;
  const setSelectedReleaseTypes = makeArraySetter('releaseTypes') as React.Dispatch<React.SetStateAction<string[]>>;
  const setSelectedRarities = makeArraySetter('rarities') as React.Dispatch<React.SetStateAction<string[]>>;
  const setSelectedTags = makeArraySetter('tags') as React.Dispatch<React.SetStateAction<string[]>>;

  // Show more state for each filter
  const [showMoreSeries, setShowMoreSeries] = useState(false);
  const [showMoreCharacters, setShowMoreCharacters] = useState(false);
  const [showMoreReleaseTypes, setShowMoreReleaseTypes] = useState(false);
  const [showMoreRarities, setShowMoreRarities] = useState(false);
  const [showMoreTags, setShowMoreTags] = useState(false);

  // Mobile drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedGenerations.join(','),
    selectedSeries.join(','),
    selectedCharacters.join(','),
    selectedReleaseTypes.join(','),
    selectedRarities.join(','),
    selectedTags.join(','),
  ]);

  // Toggle helpers (compatible with FiltersSidebar's setSelected signature)
  const toggleArrayFilter = (
    value: string,
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Clear all filters (delegates to URL state)
  const clearAllFilters = () => {
    clearFilter();
    setCurrentPage(1);
  };

  // Server-side filtered/sorted releases from API.
  const filteredReleases = useMemo<Array<ReleaseModel>>(() => apiReleases ?? [], [apiReleases]);

  // Pagination
  const totalPages = Math.ceil(filteredReleases.length / itemsPerPage);
  const paginatedReleases = filteredReleases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <CatalogPage minHeight="100vh">
      <CatalogFiltersDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      >
        <FiltersSidebar
          activeFilterCount={activeFilterCount}
          clearAllFilters={clearAllFilters}
          seriesList={seriesList}
          charactersList={charactersList}
          releaseTypeList={releaseTypeList}
          rarityList={rarityList}
          tagsList={tagsList}
          selectedGenerations={selectedGenerations}
          selectedSeries={selectedSeries}
          selectedCharacters={selectedCharacters}
          selectedReleaseTypes={selectedReleaseTypes}
          selectedRarities={selectedRarities}
          selectedTags={selectedTags}
          setSelectedGenerations={setSelectedGenerations}
          setSelectedSeries={setSelectedSeries}
          setSelectedCharacters={setSelectedCharacters}
          setSelectedReleaseTypes={setSelectedReleaseTypes}
          setSelectedRarities={setSelectedRarities}
          setSelectedTags={setSelectedTags}
          toggleArrayFilter={toggleArrayFilter}
          showMoreSeries={showMoreSeries}
          showMoreCharacters={showMoreCharacters}
          showMoreReleaseTypes={showMoreReleaseTypes}
          showMoreRarities={showMoreRarities}
          showMoreTags={showMoreTags}
          setShowMoreSeries={setShowMoreSeries}
          setShowMoreCharacters={setShowMoreCharacters}
          setShowMoreReleaseTypes={setShowMoreReleaseTypes}
          setShowMoreRarities={setShowMoreRarities}
          setShowMoreTags={setShowMoreTags}
          catalogHeight={catalogHeight}
          isMobile={true}
          onClose={() => setMobileFiltersOpen(false)}
        />
      </CatalogFiltersDrawer>

      <CatalogLayout
        sidebar={
          <FiltersSidebar
            activeFilterCount={activeFilterCount}
            clearAllFilters={clearAllFilters}
            seriesList={seriesList}
            charactersList={charactersList}
            releaseTypeList={releaseTypeList}
            rarityList={rarityList}
            tagsList={tagsList}
            selectedGenerations={selectedGenerations}
            selectedSeries={selectedSeries}
            selectedCharacters={selectedCharacters}
            selectedReleaseTypes={selectedReleaseTypes}
            selectedRarities={selectedRarities}
            selectedTags={selectedTags}
            setSelectedGenerations={setSelectedGenerations}
            setSelectedSeries={setSelectedSeries}
            setSelectedCharacters={setSelectedCharacters}
            setSelectedReleaseTypes={setSelectedReleaseTypes}
            setSelectedRarities={setSelectedRarities}
            setSelectedTags={setSelectedTags}
            toggleArrayFilter={toggleArrayFilter}
            showMoreSeries={showMoreSeries}
            showMoreCharacters={showMoreCharacters}
            showMoreReleaseTypes={showMoreReleaseTypes}
            showMoreRarities={showMoreRarities}
            showMoreTags={showMoreTags}
            setShowMoreSeries={setShowMoreSeries}
            setShowMoreCharacters={setShowMoreCharacters}
            setShowMoreReleaseTypes={setShowMoreReleaseTypes}
            setShowMoreRarities={setShowMoreRarities}
            setShowMoreTags={setShowMoreTags}
            catalogHeight={catalogHeight}
          />
        }
      >
        <Box ref={catalogRef} sx={{ flex: 1, p: { xs: 1, sm: 1.5, md: 2 } }}>
          <CatalogHeader title="Releases Catalog" />

          <CatalogResultsToolbar
            resultCount={filteredReleases.length}
            sortBy={sortBy}
            sortOptions={RELEASE_SORT_OPTIONS}
            onSortChange={(v) => setFilter({ sort: v as typeof sortBy })}
            onFiltersClick={() => setMobileFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
            sx={{ mb: { xs: 1.5, sm: 1 } }}
            formControlSx={{ minWidth: { xs: '100%', sm: 140 }, flex: { xs: 1, sm: 'none' } }}
          />

          {isReleasesPending && filteredReleases.length === 0 ? (
            <ReleaseGridSkeleton />
          ) : (
            <ReleaseGrid releases={paginatedReleases} />
          )}

          {!isReleasesPending && filteredReleases.length === 0 && <EmptyResults />}

          {totalPages > 1 && (
            <CatalogPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </Box>
      </CatalogLayout>
    </CatalogPage>
  );
};

export default ReleaseCatalog;
