import { httpGet } from "@shared/api/http";
import type { HttpGetOptions, ServerCacheOptions } from "@shared/api/http";
import { petApiDtoSchema } from "@entities/pet";
import type { PetApiDto } from "@entities/pet";
import { ValidationError } from "@shared/api/http";
import { ZodError } from "zod";
import { getMockPet, getMockPetsList, isMockMode } from "../mockClient";

const DETAIL_TTL = 60 * 60 * 12;
const LIST_TTL = 60 * 60;

export async function getPetById(
  id: string,
  options: HttpGetOptions & { cache?: ServerCacheOptions },
): Promise<PetApiDto> {
  if (isMockMode()) return getMockPet(id);

  const cache: ServerCacheOptions =
    options.context === "server"
      ? { revalidate: DETAIL_TTL, tags: [`pet-${id}`, "pet-list"], ...options.cache }
      : {};

  const raw = await httpGet<unknown>(`/pets/${encodeURIComponent(id)}`, { ...options, cache });

  try {
    return petApiDtoSchema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(`Invalid pet response for id=${id}`, err.issues);
    }
    throw err;
  }
}

export async function getPetsList(
  options: HttpGetOptions & { cache?: ServerCacheOptions },
): Promise<PetApiDto[]> {
  if (isMockMode()) return getMockPetsList();

  const cache: ServerCacheOptions =
    options.context === "server"
      ? { revalidate: LIST_TTL, tags: ["pet-list"], ...options.cache }
      : {};

  const raw = await httpGet<unknown[]>(`/pets`, { ...options, cache });

  if (!Array.isArray(raw)) {
    throw new ValidationError("Expected array for pets list", []);
  }

  return raw.map((item, i) => {
    try {
      return petApiDtoSchema.parse(item);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new ValidationError(`Invalid pet at index ${i}`, err.issues);
      }
      throw err;
    }
  });
}
