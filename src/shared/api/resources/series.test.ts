import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/__tests__/msw/server";
import { getSeriesById, getSeriesList } from "./series";
import { ApiError, MalformedApiResponseError, ValidationError } from "../http";
import { MOCK_SERIES } from "@/__mocks__/entities";

const OPT = { context: "client" } as const;
const BASE = "http://localhost:8000/api/v1";

describe("getSeriesById", () => {
  it("returns a validated SeriesApiDto for an existing id", async () => {
    const dto = await getSeriesById("1", OPT);
    expect(dto.id).toBe("1");
    expect(dto.name).toBe("Original Monster High");
  });

  it("throws ApiError for 404", async () => {
    await expect(getSeriesById("9999", OPT)).rejects.toThrow(ApiError);
  });

  it("throws MalformedApiResponseError for unparseable body", async () => {
    server.use(
      http.get(`${BASE}/series/:id`, () => new HttpResponse("bad", { status: 200 })),
    );
    await expect(getSeriesById("1", OPT)).rejects.toThrow(MalformedApiResponseError);
  });
});

describe("getSeriesList", () => {
  it("returns an array of SeriesApiDto objects", async () => {
    const list = await getSeriesList(OPT);
    expect(Array.isArray(list)).toBe(true);
    expect(list).toHaveLength(MOCK_SERIES.length);
  });

  it("throws ValidationError when response is not an array", async () => {
    server.use(
      http.get(`${BASE}/series`, () =>
        HttpResponse.json({ status: "success", data: { bad: "shape" }, request_id: "req-test" }),
      ),
    );
    await expect(getSeriesList(OPT)).rejects.toThrow(ValidationError);
  });

  it("throws ApiError on non-2xx response", async () => {
    server.use(
      http.get(`${BASE}/series`, () => HttpResponse.json({}, { status: 500 })),
    );
    await expect(getSeriesList(OPT)).rejects.toThrow(ApiError);
  });
});
