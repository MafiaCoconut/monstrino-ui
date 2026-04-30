"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { getSeriesById, getSeriesList } from "../resources";
import { seriesFromApiDto, seriesToSummary } from "@entities/series";
import type { SeriesModel, SeriesSummary } from "@entities/series";

type UseSeriesOptions = {
  initialData?: SeriesModel;
};

export function useSeries(id: string | undefined, options?: UseSeriesOptions) {
  return useQuery<SeriesModel>({
    queryKey: queryKeys.series.detail(id ?? ""),
    queryFn: async () => {
      const dto = await getSeriesById(id!, { context: "client" });
      return seriesFromApiDto(dto);
    },
    enabled: !!id,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSeriesList() {
  return useQuery<SeriesSummary[]>({
    queryKey: queryKeys.series.list(),
    queryFn: async () => {
      const dtos = await getSeriesList({ context: "client" });
      return dtos.map((dto) => seriesToSummary(seriesFromApiDto(dto)));
    },
    staleTime: 1000 * 60 * 5,
  });
}
