"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { getReleaseBySlug, getReleasesList, getReleasesPage } from "../resources";
import { RELEASE_MAX_STALE_MS } from "../cachePolicy";
import { releaseFromApiDto } from "@entities/release";
import type { ReleaseModel } from "@entities/release";

export type UseReleasesPageParams = {
  page: number;
  pageSize: number;
};

/** Model-shaped release page, as returned by useReleasesPage. */
export type ReleasesPageModel = {
  items: ReleaseModel[];
  total: number;
  page: number;
  page_size: number;
};

type UseReleaseOptions = {
  initialData?: ReleaseModel;
};

export function useRelease(slug: string | undefined, options?: UseReleaseOptions) {
  return useQuery<ReleaseModel>({
    queryKey: queryKeys.release.detail(slug ?? ""),
    queryFn: async () => {
      const dto = await getReleaseBySlug(slug!, { context: "client" });
      return releaseFromApiDto(dto);
    },
    enabled: !!slug,
    initialData: options?.initialData,
    staleTime: RELEASE_MAX_STALE_MS,
  });
}

type UseReleasesPageOptions = {
  /** Server-rendered first page, used to hydrate without a client refetch. */
  initialData?: ReleasesPageModel;
};

export function useReleasesPage(
  params: UseReleasesPageParams,
  options?: UseReleasesPageOptions,
) {
  return useQuery<ReleasesPageModel>({
    queryKey: queryKeys.release.list(JSON.stringify(params)),
    queryFn: async () => {
      const page = await getReleasesPage(params, { context: "client" });
      return {
        ...page,
        items: page.items.map((dto) => releaseFromApiDto(dto)),
      };
    },
    initialData: options?.initialData,
    staleTime: RELEASE_MAX_STALE_MS,
  });
}

export function useReleasesList() {
  return useQuery<ReleaseModel[]>({
    queryKey: queryKeys.release.list("default"),
    queryFn: async () => {
      const dtos = await getReleasesList({ context: "client" });
      return dtos.map((dto) => releaseFromApiDto(dto));
    },
    staleTime: RELEASE_MAX_STALE_MS,
  });
}
