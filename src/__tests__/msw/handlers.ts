import { http, HttpResponse } from "msw";
import { MOCK_RELEASES, MOCK_SERIES, MOCK_CHARACTERS, MOCK_PETS } from "@/__mocks__/entities";

const BASE = "http://localhost:8000/api/v1";

export const handlers = [
  // ─── Releases ──────────────────────────────────────────────────────────────

  http.get(`${BASE}/releases`, () =>
    HttpResponse.json({ success: true, data: MOCK_RELEASES }),
  ),

  http.get(`${BASE}/releases/:id`, ({ params }) => {
    const release = MOCK_RELEASES.find((r) => String(r.id) === params.id);
    if (!release) {
      return HttpResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Release not found" } },
        { status: 404 },
      );
    }
    return HttpResponse.json({ success: true, data: release });
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
