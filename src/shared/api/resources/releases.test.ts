import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/__tests__/msw/server";
import { getReleaseById, getReleasesList, searchReleases } from "./releases";
import { ApiError, ValidationError } from "../http";
import { MOCK_RELEASES } from "@/__mocks__/entities";

const OPT = { context: "client" } as const;
const BASE = "http://localhost:8000/api/v1";

describe("getReleaseById", () => {
  it("returns a validated ReleaseApiDto for an existing id", async () => {
    const dto = await getReleaseById("1", OPT);
    expect(dto.id).toBe("1");
    expect(dto.name).toBe("Frankie Stein Basic");
  });

  it("throws ApiError for 404", async () => {
    await expect(getReleaseById("9999", OPT)).rejects.toThrow(ApiError);
  });

  it("throws ApiError with correct status for 500", async () => {
    server.use(
      http.get(`${BASE}/releases/:id`, () => HttpResponse.json({}, { status: 500 })),
    );
    const err = await getReleaseById("1", OPT).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(500);
  });

  it("throws ValidationError when response body is not valid JSON", async () => {
    server.use(
      http.get(`${BASE}/releases/:id`, () => new HttpResponse("not-json", { status: 200 })),
    );
    await expect(getReleaseById("1", OPT)).rejects.toThrow(ValidationError);
  });
});

describe("getReleasesList", () => {
  it("returns an array of ReleaseApiDto objects", async () => {
    const list = await getReleasesList(OPT);
    expect(Array.isArray(list)).toBe(true);
    expect(list).toHaveLength(MOCK_RELEASES.length);
    expect(list[0].name).toBe("Frankie Stein Basic");
  });

  it("throws ValidationError when response is not an array", async () => {
    server.use(
      http.get(`${BASE}/releases`, () =>
        HttpResponse.json({ success: true, data: { wrong: "shape" } }),
      ),
    );
    await expect(getReleasesList(OPT)).rejects.toThrow(ValidationError);
  });

  it("throws ApiError on non-2xx response", async () => {
    server.use(
      http.get(`${BASE}/releases`, () => HttpResponse.json({}, { status: 503 })),
    );
    await expect(getReleasesList(OPT)).rejects.toThrow(ApiError);
  });
});

describe("searchReleases", () => {
  it("returns filtered list when query matches", async () => {
    // Default handler returns full list; filtering is server-side in production,
    // but we just check the function forwards the request and processes the response.
    const list = await searchReleases({ q: "frankie" }, OPT);
    expect(Array.isArray(list)).toBe(true);
  });

  it("returns full list when no params are given", async () => {
    const list = await searchReleases(undefined, OPT);
    expect(list).toHaveLength(MOCK_RELEASES.length);
  });
});
