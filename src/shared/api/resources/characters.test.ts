import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/__tests__/msw/server";
import { getCharacterById, getCharactersList } from "./characters";
import { ApiError, ValidationError } from "../http";
import { MOCK_CHARACTERS } from "@/__mocks__/entities";

const OPT = { context: "client" } as const;
const BASE = "http://localhost:8000/api/v1";

describe("getCharacterById", () => {
  it("returns a validated CharacterApiDto for an existing id", async () => {
    const dto = await getCharacterById("101", OPT);
    expect(dto.id).toBe("101");
    expect(dto.name).toBe("Frankie Stein");
  });

  it("throws ApiError for 404", async () => {
    await expect(getCharacterById("9999", OPT)).rejects.toThrow(ApiError);
  });

  it("throws ValidationError for unparseable body", async () => {
    server.use(
      http.get(`${BASE}/characters/:id`, () => new HttpResponse("bad", { status: 200 })),
    );
    await expect(getCharacterById("101", OPT)).rejects.toThrow(ValidationError);
  });
});

describe("getCharactersList", () => {
  it("returns an array of CharacterApiDto objects", async () => {
    const list = await getCharactersList(OPT);
    expect(Array.isArray(list)).toBe(true);
    expect(list).toHaveLength(MOCK_CHARACTERS.length);
  });

  it("throws ValidationError when response is not an array", async () => {
    server.use(
      http.get(`${BASE}/characters`, () =>
        HttpResponse.json({ success: true, data: "not-an-array" }),
      ),
    );
    await expect(getCharactersList(OPT)).rejects.toThrow(ValidationError);
  });

  it("throws ApiError on non-2xx response", async () => {
    server.use(
      http.get(`${BASE}/characters`, () => HttpResponse.json({}, { status: 503 })),
    );
    await expect(getCharactersList(OPT)).rejects.toThrow(ApiError);
  });
});
