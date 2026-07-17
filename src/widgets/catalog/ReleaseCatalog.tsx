'use client';

import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import ReleaseCardCatalog from '@cards/release-card/ReleaseCardCatalog';
import { useReleasesPage } from '@/shared/api/hooks';
import type { ReleasesPageModel } from '@/shared/api/hooks';
import { CatalogCardSkeleton } from '@/shared/ui/skeletons';
import { CatalogHeader, CatalogLayout, CatalogPage, CatalogPagination } from '@/widgets/catalog';

const PAGE_SIZE = 12;

function ReleaseGridSkeleton() {
  return (
    <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
      {Array.from({ length: PAGE_SIZE }).map((_, index) => (
        <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3 }} key={index}>
          <CatalogCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

function EmptyResults() {
  return (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        No releases yet
      </Typography>
      <Typography variant="body2" color="text.secondary">
        The public catalog is empty right now.
      </Typography>
    </Box>
  );
}

type ErrorStateProps = {
  onRetry: () => void;
};

function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Failed to load releases
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        The catalog API did not return a usable response.
      </Typography>
      <Button variant="contained" onClick={onRetry}>
        Retry
      </Button>
    </Box>
  );
}

type ReleaseCatalogProps = {
  /**
   * First catalog page fetched on the server so crawlers and link previews
   * receive real release cards in the initial HTML. Client pagination and
   * refetching behave exactly as before.
   */
  initialPage?: ReleasesPageModel;
};

export default function ReleaseCatalog({ initialPage }: ReleaseCatalogProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isPending, isError, refetch } = useReleasesPage(
    {
      page: currentPage,
      pageSize: PAGE_SIZE,
    },
    currentPage === 1 && initialPage ? { initialData: initialPage } : undefined,
  );

  const releases = data?.items ?? [];
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

  return (
    <CatalogPage minHeight="100vh">
      <CatalogLayout>
        <Box sx={{ flex: 1, p: { xs: 1, sm: 1.5, md: 2 } }}>
          <CatalogHeader title="Releases Catalog" />

          {isPending ? <ReleaseGridSkeleton /> : null}
          {!isPending && isError ? <ErrorState onRetry={() => void refetch()} /> : null}
          {!isPending && !isError && releases.length === 0 ? <EmptyResults /> : null}

          {!isPending && !isError && releases.length > 0 ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {data?.total ?? releases.length} public release{(data?.total ?? releases.length) === 1 ? '' : 's'}
              </Typography>
              <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
                {releases.map((release, index) => (
                  <Grid size={{ xs: 6, sm: 4, md: 4, lg: 3 }} key={release.id}>
                    <ReleaseCardCatalog release={release} priority={index < 4} />
                  </Grid>
                ))}
              </Grid>
              {totalPages > 1 ? (
                <CatalogPagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              ) : null}
            </>
          ) : null}
        </Box>
      </CatalogLayout>
    </CatalogPage>
  );
}
