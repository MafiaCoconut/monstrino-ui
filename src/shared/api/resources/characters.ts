import { httpGet } from "@shared/api/http";
import type { HttpGetOptions, ServerCacheOptions } from "@shared/api/http";
import { characterApiDtoSchema } from "@entities/character";
import type { CharacterApiDto } from "@entities/character";
import { ValidationError } from "@shared/api/http";
import { ZodError } from "zod";
import { getMockCharacter, getMockCharactersList, isMockMode } from "../mockClient";

const DETAIL_TTL = 60 * 60 * 12;
const LIST_TTL = 60 * 60;

export async function getCharacterById(
  id: string,
  options: HttpGetOptions & { cache?: ServerCacheOptions },
): Promise<CharacterApiDto> {
  if (isMockMode()) return getMockCharacter(id);

  const cache: ServerCacheOptions =
    options.context === "server"
      ? { revalidate: DETAIL_TTL, tags: [`character-${id}`, "character-list"], ...options.cache }
      : {};

  const raw = await httpGet<unknown>(`/characters/${id}`, { ...options, cache });

  try {
    return characterApiDtoSchema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(`Invalid character response for id=${id}`, err.issues);
    }
    throw err;
  }
}

export async function getCharactersList(
  options: HttpGetOptions & { cache?: ServerCacheOptions },
): Promise<CharacterApiDto[]> {
  if (isMockMode()) return getMockCharactersList();

  const cache: ServerCacheOptions =
    options.context === "server"
      ? { revalidate: LIST_TTL, tags: ["character-list"], ...options.cache }
      : {};

  const raw = await httpGet<unknown[]>(`/characters`, { ...options, cache });

  if (!Array.isArray(raw)) {
    throw new ValidationError("Expected array for characters list", []);
  }

  return raw.map((item, i) => {
    try {
      return characterApiDtoSchema.parse(item);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new ValidationError(`Invalid character at index ${i}`, err.issues);
      }
      throw err;
    }
  });
}
