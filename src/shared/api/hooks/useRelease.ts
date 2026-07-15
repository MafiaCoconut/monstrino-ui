"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { getReleaseBySlug, getReleasesList, getReleasesPage } from "../resources";
import { releaseFromApiDto } from "@entities/release";
import type { ReleaseModel } from "@entities/release";

export type UseReleasesPageParams = {
  page: number;
  pageSize: number;
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
    staleTime: 1000 * 60 * 10, // 10 minutes — releases don't change often
  });
}

export function useReleasesPage(params: UseReleasesPageParams) {
  return useQuery({
    queryKey: queryKeys.release.list(JSON.stringify(params)),
    queryFn: async () => {
      const page = await getReleasesPage(params, { context: "client" });
      return {
        ...page,
        items: page.items.map((dto) => releaseFromApiDto(dto)),
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useReleasesList() {
  return useQuery<ReleaseModel[]>({
    queryKey: queryKeys.release.list("default"),
    queryFn: async () => {
      const dtos = await getReleasesList({ context: "client" });
      return dtos.map((dto) => releaseFromApiDto(dto));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
