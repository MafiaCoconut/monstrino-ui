import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/__tests__/msw/server";
import { getPetById, getPetsList } from "./pets";
import { ApiError, ValidationError } from "../http";
import { MOCK_PETS } from "@/__mocks__/entities";

const OPT = { context: "client" } as const;
const BASE = "http://localhost:8000/api/v1";

describe("getPetById", () => {
  it("returns a validated PetApiDto for an existing id", async () => {
    const dto = await getPetById("1", OPT);
    expect(dto.id).toBe("1");
    expect(dto.name).toBe("Watzit");
  });

  it("throws ApiError for 404", async () => {
    await expect(getPetById("9999", OPT)).rejects.toThrow(ApiError);
  });

  it("throws ValidationError for unparseable body", async () => {
    server.use(
      http.get(`${BASE}/pets/:id`, () => new HttpResponse("bad", { status: 200 })),
    );
    await expect(getPetById("1", OPT)).rejects.toThrow(ValidationError);
  });
});

describe("getPetsList", () => {
  it("returns an array of PetApiDto objects", async () => {
    const list = await getPetsList(OPT);
    expect(Array.isArray(list)).toBe(true);
    expect(list).toHaveLength(MOCK_PETS.length);
  });

  it("throws ValidationError when response is not an array", async () => {
    server.use(
      http.get(`${BASE}/pets`, () =>
        HttpResponse.json({ success: true, data: { bad: "shape" } }),
      ),
    );
    await expect(getPetsList(OPT)).rejects.toThrow(ValidationError);
  });

  it("throws ApiError on non-2xx response", async () => {
    server.use(
      http.get(`${BASE}/pets`, () => HttpResponse.json({}, { status: 500 })),
    );
    await expect(getPetsList(OPT)).rejects.toThrow(ApiError);
  });
});
