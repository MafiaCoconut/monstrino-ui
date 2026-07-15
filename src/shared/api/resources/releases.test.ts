import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/__tests__/msw/server";
import { getReleaseBySlug, getReleasesList, getReleasesPage } from "./releases";
import { ApiError, ValidationError } from "../http";
import { MOCK_RELEASES } from "@/__mocks__/entities";

const OPT = { context: "client" } as const;
const BASE = "http://localhost:8000/api/v1";

describe("getReleaseBySlug", () => {
  it("returns a validated ReleaseApiDto for an existing slug", async () => {
    const dto = await getReleaseBySlug("frankie-stein-basic-000000000001", OPT);
    expect(dto.id).toBe("1");
    expect(dto.title).toBe("Frankie Stein Basic");
  });

  it("throws ApiError for 404", async () => {
    await expect(getReleaseBySlug("missing-slug", OPT)).rejects.toThrow(ApiError);
  });

  it("throws ApiError with correct status for 500", async () => {
    server.use(
      http.get(`${BASE}/releases/:slug`, () => HttpResponse.json({}, { status: 500 })),
    );
    const err = await getReleaseBySlug("frankie-stein-basic-000000000001", OPT).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(500);
  });

  it("throws ValidationError when response body is not valid JSON", async () => {
    server.use(
      http.get(`${BASE}/releases/:slug`, () => new HttpResponse("not-json", { status: 200 })),
    );
    await expect(getReleaseBySlug("frankie-stein-basic-000000000001", OPT)).rejects.toThrow(
      ValidationError,
    );
  });
});

describe("getReleasesPage", () => {
  it("returns a validated paginated response", async () => {
    const page = await getReleasesPage({ page: 1, pageSize: 12 }, OPT);
    expect(page.total).toBe(MOCK_RELEASES.length);
    expect(page.items).toHaveLength(MOCK_RELEASES.length);
    expect(page.items[0].title).toBe("Frankie Stein Basic");
  });

  it("uses limit/offset query params for pagination", async () => {
    server.use(
      http.get(`${BASE}/releases`, ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("limit")).toBe("12");
        expect(url.searchParams.get("offset")).toBe("12");
        return HttpResponse.json({
          status: "success",
          data: {
            items: MOCK_RELEASES,
            total: MOCK_RELEASES.length,
            page: 2,
            page_size: 12,
          },
          request_id: "req-test",
          correlation_id: null,
          trace_id: null,
          meta: {
            service: "catalog-api-service",
            version: "v1",
            timestamp: "2026-07-15T00:00:00Z",
          },
        });
      }),
    );

    const page = await getReleasesPage({ page: 2, pageSize: 12 }, OPT);
    expect(page.page).toBe(2);
  });

  it("throws ValidationError when response is not a release page", async () => {
    server.use(
      http.get(`${BASE}/releases`, () =>
        HttpResponse.json({ status: "success", data: { wrong: "shape" } }),
      ),
    );
    await expect(getReleasesPage({ page: 1, pageSize: 12 }, OPT)).rejects.toThrow(
      ValidationError,
    );
  });

  it("throws ApiError on non-2xx response", async () => {
    server.use(
      http.get(`${BASE}/releases`, () => HttpResponse.json({}, { status: 503 })),
    );
    await expect(getReleasesPage({ page: 1, pageSize: 12 }, OPT)).rejects.toThrow(ApiError);
  });
});

describe("getReleasesList", () => {
  it("returns the first page items for callers that only need an array", async () => {
    const list = await getReleasesList(OPT);
    expect(list).toHaveLength(MOCK_RELEASES.length);
    expect(list[1].slug).toBe("draculaura-signature-000000000002");
  });
});
