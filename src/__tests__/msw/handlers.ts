import { http, HttpResponse } from "msw";
import { MOCK_RELEASES, MOCK_SERIES, MOCK_CHARACTERS, MOCK_PETS } from "@/__mocks__/entities";

const BASE = "http://localhost:8000/api/v1";

const META = {
  service: "catalog-api-service",
  version: "v1",
  timestamp: "2026-07-15T00:00:00Z",
};

/** Canonical Monstrino success envelope */
export function successEnvelope(data: unknown) {
  return {
    status: "success",
    data,
    error: null,
    request_id: "req-test",
    correlation_id: null,
    trace_id: null,
    meta: META,
  };
}

/** Canonical Monstrino error envelope */
export function errorEnvelope(
  code: string,
  message: string,
  options?: { retryable?: boolean; details?: Record<string, unknown> | null },
) {
  return {
    status: "error",
    data: null,
    error: {
      code,
      message,
      retryable: options?.retryable ?? false,
      details: options?.details ?? null,
    },
    request_id: "req-test",
    correlation_id: null,
    trace_id: null,
    meta: META,
  };
}

export const handlers = [
  // ─── Releases ──────────────────────────────────────────────────────────────

  http.get(`${BASE}/releases`, () =>
    HttpResponse.json(
      successEnvelope({
        items: MOCK_RELEASES,
        total: MOCK_RELEASES.length,
        page: 1,
        page_size: MOCK_RELEASES.length,
      }),
    ),
  ),

  http.get(`${BASE}/releases/:slug`, ({ params }) => {
    const release = MOCK_RELEASES.find((r) => r.slug === params.slug);
    if (!release) {
      return HttpResponse.json(errorEnvelope("NOT_FOUND", "Release not found"), { status: 404 });
    }
    return HttpResponse.json(successEnvelope(release));
  }),

  // ─── Series ────────────────────────────────────────────────────────────────

  http.get(`${BASE}/series`, () => HttpResponse.json(successEnvelope(MOCK_SERIES))),

  http.get(`${BASE}/series/:id`, ({ params }) => {
    const series = MOCK_SERIES.find((s) => String(s.id) === params.id);
    if (!series) {
      return HttpResponse.json(errorEnvelope("NOT_FOUND", "Series not found"), { status: 404 });
    }
    return HttpResponse.json(successEnvelope(series));
  }),

  // ─── Characters ────────────────────────────────────────────────────────────

  http.get(`${BASE}/characters`, () => HttpResponse.json(successEnvelope(MOCK_CHARACTERS))),

  http.get(`${BASE}/characters/:id`, ({ params }) => {
    const character = MOCK_CHARACTERS.find((c) => String(c.id) === params.id);
    if (!character) {
      return HttpResponse.json(errorEnvelope("NOT_FOUND", "Character not found"), { status: 404 });
    }
    return HttpResponse.json(successEnvelope(character));
  }),

  // ─── Pets ──────────────────────────────────────────────────────────────────

  http.get(`${BASE}/pets`, () => HttpResponse.json(successEnvelope(MOCK_PETS))),

  http.get(`${BASE}/pets/:id`, ({ params }) => {
    const pet = MOCK_PETS.find((p) => String(p.id) === params.id);
    if (!pet) {
      return HttpResponse.json(errorEnvelope("NOT_FOUND", "Pet not found"), { status: 404 });
    }
    return HttpResponse.json(successEnvelope(pet));
  }),
];
