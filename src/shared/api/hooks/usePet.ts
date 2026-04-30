"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { getPetById, getPetsList } from "../resources";
import { petFromApiDto, petToSummary } from "@entities/pet";
import type { PetModel, PetSummary } from "@entities/pet";

type UsePetOptions = {
  initialData?: PetModel;
};

export function usePet(id: string | undefined, options?: UsePetOptions) {
  return useQuery<PetModel>({
    queryKey: queryKeys.pet.detail(id ?? ""),
    queryFn: async () => {
      const dto = await getPetById(id!, { context: "client" });
      return petFromApiDto(dto);
    },
    enabled: !!id,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 10,
  });
}

export function usePetsList() {
  return useQuery<PetSummary[]>({
    queryKey: queryKeys.pet.list(),
    queryFn: async () => {
      const dtos = await getPetsList({ context: "client" });
      return dtos.map((dto) => petToSummary(petFromApiDto(dto)));
    },
    staleTime: 1000 * 60 * 5,
  });
}
