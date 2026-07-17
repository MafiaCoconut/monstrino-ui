import { describe, expect, it } from "vitest";
import { delay, http, HttpResponse, type JsonBodyType } from "msw";
import { server } from "@/__tests__/msw/server";
import { successEnvelope, errorEnvelope } from "@/__tests__/msw/handlers";
import { httpGet } from "./httpClient";
import { ApiError, MalformedApiResponseError, NetworkError, TimeoutError } from "./errors";
import { getReleaseBySlug, getReleasesPage } from "../resources/releases";
import { MOCK_RELEASES } from "@/__mocks__/entities";

const OPT = { context: "client" } as const;
const BASE = "http://localhost:8000/api/v1";
const PATH = "/releases";

function respondWith(body: JsonBodyType, status = 200) {
  server.use(http.get(`${BASE}${PATH}`, () => HttpResponse.json(body, { status })));
}

describe("httpGet — canonical envelope parsing", () => {
  it("unwraps a canonical success envelope and returns only data", async () => {
    respondWith(successEnvelope({ hello: "world" }));
    await expect(httpGet(PATH, OPT)).resolves.toEqual({ hello: "world" });
  });

  it("unwraps a canonical accepted envelope", async () => {
    respondWith({ ...successEnvelope({ queued: true }), status: "accepted" }, 202);
    await expect(httpGet(PATH, OPT)).resolves.toEqual({ queued: true });
  });

  it("turns a canonical error envelope into ApiError with all fields", async () => {
    respondWith(
      errorEnvelope("NOT_FOUND", "Release not found", {
        retryable: true,
        details: { slug: "missing" },
      }),
      404,
    );
    const err = await httpGet(PATH, OPT).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).code).toBe("NOT_FOUND");
    expect((err as ApiError).message).toBe("Release not found");
    expect((err as ApiError).status).toBe(404);
    expect((err as ApiError).retryable).toBe(true);
    expect((err as ApiError).details).toEqual({ slug: "missing" });
  });

  it("reads request_id from the envelope top level, not from meta", async () => {
    const body = errorEnvelope("INTERNAL_ERROR", "Boom");
    (body as Record<string, unknown>).request_id = "req-top-level";
    (body.meta as Record<string, unknown>).request_id = "req-in-meta-must-be-ignored";
    respondWith(body, 500);
    const err = await httpGet(PATH, OPT).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).requestId).toBe("req-top-level");
  });

  it("treats HTTP 200 with status=error as an API error, not success", async () => {
    respondWith(errorEnvelope("SOFT_FAIL", "Failed despite 200"), 200);
    const err = await httpGet(PATH, OPT).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).code).toBe("SOFT_FAIL");
    expect((err as ApiError).status).toBe(200);
  });

  it("rejects a non-JSON 200 body with MalformedApiResponseError", async () => {
    server.use(http.get(`${BASE}${PATH}`, () => new HttpResponse("not-json", { status: 200 })));
    await expect(httpGet(PATH, OPT)).rejects.toThrow(MalformedApiResponseError);
  });

  it("rejects a non-object 200 body with MalformedApiResponseError", async () => {
    respondWith([1, 2, 3]);
    await expect(httpGet(PATH, OPT)).rejects.toThrow(MalformedApiResponseError);
  });

  it("rejects an envelope with a missing status", async () => {
    respondWith({ data: { hello: "world" }, request_id: "req-test" });
    await expect(httpGet(PATH, OPT)).rejects.toThrow(MalformedApiResponseError);
  });

  it("rejects an envelope with an unknown status", async () => {
    respondWith({ ...successEnvelope({}), status: "partial" });
    await expect(httpGet(PATH, OPT)).rejects.toThrow(MalformedApiResponseError);
  });

  it("rejects a success envelope without data", async () => {
    const body = successEnvelope(null) as Record<string, unknown>;
    delete body.data;
    respondWith(body);
    await expect(httpGet(PATH, OPT)).rejects.toThrow(MalformedApiResponseError);
  });

  it("rejects the legacy {success: true} shape", async () => {
    respondWith({ success: true, data: { hello: "world" } });
    await expect(httpGet(PATH, OPT)).rejects.toThrow(MalformedApiResponseError);
  });

  it("rejects the legacy {result} shape", async () => {
    respondWith({ result: { hello: "world" } });
    await expect(httpGet(PATH, OPT)).rejects.toThrow(MalformedApiResponseError);
  });

  it("does not retain the offending response body on malformed-envelope errors", async () => {
    respondWith({ status: "broken", access_token: "secret-token" });
    const err = await httpGet(PATH, OPT).catch((e) => e);
    expect(err).toBeInstanceOf(MalformedApiResponseError);
    expect(Object.prototype.hasOwnProperty.call(err, "body")).toBe(false);
    expect(String(err)).not.toContain("secret-token");
  });

  it("never passes raw body through for an unrecognized 200 shape", async () => {
    respondWith({ items: [], total: 0 });
    await expect(httpGet(PATH, OPT)).rejects.toThrow(MalformedApiResponseError);
  });

  it("maps an HTTP error with a malformed body to a generic ApiError", async () => {
    server.use(http.get(`${BASE}${PATH}`, () => new HttpResponse("boom", { status: 502 })));
    const err = await httpGet(PATH, OPT).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).code).toBe("HTTP_ERROR");
    expect((err as ApiError).status).toBe(502);
  });

  it("maps an HTTP error with a non-envelope JSON body to a generic ApiError", async () => {
    respondWith({}, 500);
    const err = await httpGet(PATH, OPT).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).code).toBe("HTTP_ERROR");
    expect((err as ApiError).status).toBe(500);
  });

  it("keeps network failures as NetworkError, not malformed-envelope errors", async () => {
    server.use(http.get(`${BASE}${PATH}`, () => HttpResponse.error()));
    await expect(httpGet(PATH, OPT)).rejects.toThrow(NetworkError);
  });
});

describe("release resources on top of the strict parser", () => {
  it("release list resource validates data after unwrap", async () => {
    const page = await getReleasesPage({ page: 1, pageSize: 12 }, OPT);
    expect(page.total).toBe(MOCK_RELEASES.length);
    expect(page.items[0].slug).toBe(MOCK_RELEASES[0].slug);
  });

  it("release detail resource validates data after unwrap", async () => {
    const dto = await getReleaseBySlug(MOCK_RELEASES[0].slug, OPT);
    expect(dto.id).toBe(MOCK_RELEASES[0].id);
  });
});

describe("bounded timeout and cancellation", () => {
  it("throws TimeoutError when the backend hangs past the bound", async () => {
    server.use(
      http.get(`${BASE}${PATH}`, async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }),
    );

    const err = await httpGet(PATH, { ...OPT, timeoutMs: 50 }).catch((e) => e);
    expect(err).toBeInstanceOf(TimeoutError);
    expect((err as TimeoutError).timeoutMs).toBe(50);
  });

  it("propagates caller cancellation untouched (not a backend failure)", async () => {
    server.use(
      http.get(`${BASE}${PATH}`, async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }),
    );

    const controller = new AbortController();
    const pending = httpGet(PATH, { ...OPT, signal: controller.signal, timeoutMs: 5_000 });
    controller.abort();

    const err = await pending.catch((e) => e);
    expect(err).not.toBeInstanceOf(TimeoutError);
    expect(err).not.toBeInstanceOf(NetworkError);
    expect((err as Error).name).toBe("AbortError");
  });

  it("fast responses are unaffected by the default timeout", async () => {
    respondWith(successEnvelope({ ok: true }));
    await expect(httpGet(PATH, OPT)).resolves.toEqual({ ok: true });
  });
});
