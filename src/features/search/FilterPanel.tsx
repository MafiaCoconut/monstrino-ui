"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import type { SxProps, Theme } from "@mui/material/styles";
import { SearchInput } from "./SearchInput";
import { MultiSelect } from "./MultiSelect";
import type { ReleasesFilter } from "./types";

interface FilterPanelProps {
  filter: ReleasesFilter;
  onFilterChange: (patch: Partial<ReleasesFilter>) => void;
  onClear: () => void;
  generationOptions?: string[];
  seriesOptions?: string[];
  releaseTypeOptions?: string[];
  rarityOptions?: string[];
  searchPlaceholder?: string;
  sx?: SxProps<Theme>;
}

export function FilterPanel({
  filter,
  onFilterChange,
  onClear,
  generationOptions = [],
  seriesOptions = [],
  releaseTypeOptions = [],
  rarityOptions = [],
  searchPlaceholder = "Search...",
  sx,
}: FilterPanelProps) {
  const hasActiveFilters =
    !!filter.q ||
    (filter.generations?.length ?? 0) > 0 ||
    (filter.series?.length ?? 0) > 0 ||
    (filter.releaseTypes?.length ?? 0) > 0 ||
    (filter.rarities?.length ?? 0) > 0;

  return (
    <Box
      sx={[
        {
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
          p: { xs: 1.5, sm: 2 },
          backgroundColor: "rgba(255,255,255,0.02)",
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.06)",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <TuneIcon sx={{ color: "text.secondary", fontSize: 18, flexShrink: 0 }} />

      <Box sx={{ flex: "1 1 180px", maxWidth: 280 }}>
        <SearchInput
          value={filter.q ?? ""}
          onChange={(q) => onFilterChange({ q: q || undefined })}
          placeholder={searchPlaceholder}
        />
      </Box>

      {generationOptions.length > 0 && (
        <MultiSelect
          label="Generation"
          options={generationOptions}
          value={(filter.generations as string[]) ?? []}
          onChange={(v) =>
            onFilterChange({ generations: v.length ? (v as ReleasesFilter["generations"]) : undefined })
          }
          maxWidth={160}
        />
      )}

      {seriesOptions.length > 0 && (
        <MultiSelect
          label="Series"
          options={seriesOptions}
          value={filter.series ?? []}
          onChange={(v) => onFilterChange({ series: v.length ? v : undefined })}
          maxWidth={200}
        />
      )}

      {releaseTypeOptions.length > 0 && (
        <MultiSelect
          label="Type"
          options={releaseTypeOptions}
          value={(filter.releaseTypes as string[]) ?? []}
          onChange={(v) =>
            onFilterChange({ releaseTypes: v.length ? (v as ReleasesFilter["releaseTypes"]) : undefined })
          }
          maxWidth={180}
        />
      )}

      {rarityOptions.length > 0 && (
        <MultiSelect
          label="Rarity"
          options={rarityOptions}
          value={(filter.rarities as string[]) ?? []}
          onChange={(v) =>
            onFilterChange({ rarities: v.length ? (v as ReleasesFilter["rarities"]) : undefined })
          }
          maxWidth={160}
        />
      )}

      {hasActiveFilters && (
        <Button
          size="small"
          onClick={onClear}
          sx={{
            textTransform: "none",
            fontSize: "0.75rem",
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
            flexShrink: 0,
          }}
        >
          Clear
        </Button>
      )}
    </Box>
  );
}
