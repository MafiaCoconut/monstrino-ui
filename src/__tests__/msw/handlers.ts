import { http, HttpResponse } from "msw";
import { MOCK_RELEASES, MOCK_SERIES, MOCK_CHARACTERS, MOCK_PETS } from "@/__mocks__/entities";

const BASE = "http://localhost:8000/api/v1";

export const handlers = [
  // ─── Releases ──────────────────────────────────────────────────────────────

  http.get(`${BASE}/releases`, () =>
    HttpResponse.json({
      status: "success",
      data: {
        items: MOCK_RELEASES,
        total: MOCK_RELEASES.length,
        page: 1,
        page_size: MOCK_RELEASES.length,
      },
      request_id: "req-test",
      correlation_id: null,
      trace_id: null,
      meta: {
        service: "catalog-api-service",
        version: "v1",
        timestamp: "2026-07-15T00:00:00Z",
      },
    }),
  ),

  http.get(`${BASE}/releases/:slug`, ({ params }) => {
    const release = MOCK_RELEASES.find((r) => r.slug === params.slug);
    if (!release) {
      return HttpResponse.json(
        {
          status: "error",
          data: null,
          error: { code: "NOT_FOUND", message: "Release not found", retryable: false },
          request_id: "req-test",
          correlation_id: null,
          trace_id: null,
          meta: {
            service: "catalog-api-service",
            version: "v1",
            timestamp: "2026-07-15T00:00:00Z",
          },
        },
        { status: 404 },
      );
    }
    return HttpResponse.json({
      status: "success",
      data: release,
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

  // ─── Series ────────────────────────────────────────────────────────────────

  http.get(`${BASE}/series`, () =>
    HttpResponse.json({ success: true, data: MOCK_SERIES }),
  ),

  http.get(`${BASE}/series/:id`, ({ params }) => {
    const series = MOCK_SERIES.find((s) => String(s.id) === params.id);
    if (!series) {
      return HttpResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Series not found" } },
        { status: 404 },
      );
    }
    return HttpResponse.json({ success: true, data: series });
  }),

  // ─── Characters ────────────────────────────────────────────────────────────

  http.get(`${BASE}/characters`, () =>
    HttpResponse.json({ success: true, data: MOCK_CHARACTERS }),
  ),

  http.get(`${BASE}/characters/:id`, ({ params }) => {
    const character = MOCK_CHARACTERS.find((c) => String(c.id) === params.id);
    if (!character) {
      return HttpResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Character not found" } },
        { status: 404 },
      );
    }
    return HttpResponse.json({ success: true, data: character });
  }),

  // ─── Pets ──────────────────────────────────────────────────────────────────

  http.get(`${BASE}/pets`, () =>
    HttpResponse.json({ success: true, data: MOCK_PETS }),
  ),

  http.get(`${BASE}/pets/:id`, ({ params }) => {
    const pet = MOCK_PETS.find((p) => String(p.id) === params.id);
    if (!pet) {
      return HttpResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Pet not found" } },
        { status: 404 },
      );
    }
    return HttpResponse.json({ success: true, data: pet });
  }),
];
