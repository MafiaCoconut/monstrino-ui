"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "@/shared/router";
import type { ReleasesFilter, ReleaseSortKey } from "./types";
import { FILTER_PARAM_KEYS, VALID_SORT_KEYS } from "./types";

function getMulti(params: URLSearchParams, key: string): string[] {
  return params.getAll(key).filter(Boolean);
}

export function useReleasesFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ─── Read ───────────────────────────────────────────────────────────────────

  const filter: ReleasesFilter = useMemo(() => {
    const sortRaw = searchParams.get(FILTER_PARAM_KEYS.sort) as ReleaseSortKey | null;
    return {
      q: searchParams.get(FILTER_PARAM_KEYS.q) ?? undefined,
      generations: getMulti(searchParams, FILTER_PARAM_KEYS.generations) as ReleasesFilter["generations"],
      series: getMulti(searchParams, FILTER_PARAM_KEYS.series),
      characters: getMulti(searchParams, FILTER_PARAM_KEYS.characters),
      releaseTypes: getMulti(searchParams, FILTER_PARAM_KEYS.releaseTypes) as ReleasesFilter["releaseTypes"],
      rarities: getMulti(searchParams, FILTER_PARAM_KEYS.rarities) as ReleasesFilter["rarities"],
      tags: getMulti(searchParams, FILTER_PARAM_KEYS.tags) as ReleasesFilter["tags"],
      sort: sortRaw && VALID_SORT_KEYS.includes(sortRaw) ? sortRaw : "releaseDate",
    };
  }, [searchParams]);

  // ─── Write ──────────────────────────────────────────────────────────────────

  const setFilter = useCallback(
    (patch: Partial<ReleasesFilter>) => {
      const next: ReleasesFilter = { ...filter, ...patch };
      const params = new URLSearchParams(searchParams.toString());

      // Clear only filter-managed keys, preserve unrelated query params.
      Object.values(FILTER_PARAM_KEYS).forEach((key) => {
        params.delete(key);
      });

      if (next.q) params.set(FILTER_PARAM_KEYS.q, next.q);
      next.generations?.forEach((v) => params.append(FILTER_PARAM_KEYS.generations, v));
      next.series?.forEach((v) => params.append(FILTER_PARAM_KEYS.series, v));
      next.characters?.forEach((v) => params.append(FILTER_PARAM_KEYS.characters, v));
      next.releaseTypes?.forEach((v) => params.append(FILTER_PARAM_KEYS.releaseTypes, v));
      next.rarities?.forEach((v) => params.append(FILTER_PARAM_KEYS.rarities, v));
      next.tags?.forEach((v) => params.append(FILTER_PARAM_KEYS.tags, v));
      if (next.sort && next.sort !== "releaseDate") params.set(FILTER_PARAM_KEYS.sort, next.sort);

      setSearchParams(params, { replace: true, scroll: false });
    },
    [filter, searchParams, setSearchParams],
  );

  const clearFilter = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true, scroll: false });
  }, [setSearchParams]);

  // ─── Adapter: Dispatch<SetStateAction<string[]>> shim for existing sidebars ─

  const makeArraySetter = useCallback(
    (key: keyof ReleasesFilter) =>
      (valueOrFn: string[] | ((prev: string[]) => string[])) => {
        const current = (filter[key] as string[] | undefined) ?? [];
        const next =
          typeof valueOrFn === "function" ? valueOrFn(current) : valueOrFn;
        setFilter({ [key]: next.length > 0 ? next : undefined } as Partial<ReleasesFilter>);
      },
    [filter, setFilter],
  );

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filter.q) count++;
    if (filter.generations?.length) count++;
    if (filter.series?.length) count++;
    if (filter.characters?.length) count++;
    if (filter.releaseTypes?.length) count++;
    if (filter.rarities?.length) count++;
    if (filter.tags?.length) count++;
    return count;
  }, [filter]);

  return {
    filter,
    setFilter,
    clearFilter,
    makeArraySetter,
    activeFilterCount,
  };
}
