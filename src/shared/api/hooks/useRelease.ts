"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { getReleaseById, getReleasesList, searchReleases } from "../resources";
import { releaseFromApiDto } from "@entities/release";
import type { ReleaseModel } from "@entities/release";
import type { ReleaseSearchParams } from "../resources";

// ─── Detail hook ──────────────────────────────────────────────────────────────

type UseReleaseOptions = {
  initialData?: ReleaseModel;
};

export function useRelease(id: string | undefined, options?: UseReleaseOptions) {
  return useQuery<ReleaseModel>({
    queryKey: queryKeys.release.detail(id ?? ""),
    queryFn: async () => {
      const dto = await getReleaseById(id!, { context: "client" });
      return releaseFromApiDto(dto);
    },
    enabled: !!id,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 10, // 10 minutes — releases don't change often
  });
}

// ─── List hook ────────────────────────────────────────────────────────────────

export function useReleasesList(filters?: ReleaseSearchParams) {
  const signature = JSON.stringify(filters ?? {});
  return useQuery<ReleaseModel[]>({
    queryKey: queryKeys.release.list(signature),
    queryFn: async () => {
      const dtos = filters
        ? await searchReleases(filters, { context: "client" })
        : await getReleasesList({ context: "client" });
      return dtos.map((dto) => releaseFromApiDto(dto));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
