"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { getCharacterById, getCharactersList } from "../resources";
import { characterFromApiDto, characterToSummary } from "@entities/character";
import type { CharacterModel, CharacterSummary } from "@entities/character";

type UseCharacterOptions = {
  initialData?: CharacterModel;
};

export function useCharacter(id: string | undefined, options?: UseCharacterOptions) {
  return useQuery<CharacterModel>({
    queryKey: queryKeys.character.detail(id ?? ""),
    queryFn: async () => {
      const dto = await getCharacterById(id!, { context: "client" });
      return characterFromApiDto(dto);
    },
    enabled: !!id,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 30, // 30 minutes — characters rarely change
  });
}

export function useCharactersList() {
  return useQuery<CharacterSummary[]>({
    queryKey: queryKeys.character.list(),
    queryFn: async () => {
      const dtos = await getCharactersList({ context: "client" });
      return dtos.map((dto) => characterToSummary(characterFromApiDto(dto)));
    },
    staleTime: 1000 * 60 * 30,
  });
}
