import { ApiError, MalformedApiResponseError, NetworkError } from "./errors";
import { backendUrl } from "@shared/config/env";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Canonical Monstrino API envelope (see monstrino_api.v1.contracts.responses).
 * Top-level: status, request_id, correlation_id, trace_id, data, error, meta.
 * Supported statuses: "success" | "accepted" | "error".
 */
const ENVELOPE_STATUSES = ["success", "accepted", "error"] as const;
type EnvelopeStatus = (typeof ENVELOPE_STATUSES)[number];

interface EnvelopeErrorBody {
  code: string;
  message: string;
  retryable?: boolean;
  details?: Record<string, unknown> | null;
}

/** ISR options — only available in server context */
export interface ServerCacheOptions {
  /** Revalidation TTL in seconds. Pass `false` to opt out of caching. */
  revalidate?: number | false;
  /** Cache tags for on-demand revalidation via revalidateTag() */
  tags?: string[];
}

export type FetchContext = "server" | "client";

export interface HttpGetOptions {
  context: FetchContext;
  cache?: ServerCacheOptions;
}

// ─── URL builder ─────────────────────────────────────────────────────────────

function getApiBase(): string {
  return (backendUrl ?? "").replace(/\/$/, "");
}

export function buildApiUrl(path: string): string {
  const base = getApiBase();
  if (!base) throw new NetworkError("NEXT_PUBLIC_BACKEND_URL is not configured");
  return `${base}/api/v1${path}`;
}

// ─── Strict envelope parser ───────────────────────────────────────────────────

function isEnvelopeStatus(value: unknown): value is EnvelopeStatus {
  return typeof value === "string" && (ENVELOPE_STATUSES as readonly string[]).includes(value);
}

function readErrorBody(value: unknown): EnvelopeErrorBody | null {
  if (value == null || typeof value !== "object") return null;
  const obj = value as Record<string, unknown>;
  if (typeof obj.code !== "string" || typeof obj.message !== "string") return null;
  return {
    code: obj.code,
    message: obj.message,
    retryable: typeof obj.retryable === "boolean" ? obj.retryable : undefined,
    details:
      obj.details == null || typeof obj.details !== "object"
        ? null
        : (obj.details as Record<string, unknown>),
  };
}

function readRequestId(obj: Record<string, unknown>): string | undefined {
  // request_id lives at the top level of the canonical envelope — never in meta.
  return typeof obj.request_id === "string" ? obj.request_id : undefined;
}

function buildApiErrorFromEnvelope(
  obj: Record<string, unknown>,
  error: EnvelopeErrorBody,
  httpStatus: number,
): ApiError {
  return new ApiError(error.message, error.code, httpStatus, readRequestId(obj), {
    retryable: error.retryable,
    details: error.details,
  });
}

/**
 * Parses the canonical Monstrino envelope of an HTTP 2xx response.
 * - status "success" | "accepted" with `data` present → returns `data`
 * - status "error" → throws ApiError (even on HTTP 200)
 * - anything else (legacy `success`/`result` shapes, unknown/missing status,
 *   missing data) → throws MalformedApiResponseError
 */
function parseEnvelope<T>(json: unknown, httpStatus: number): T {
  if (json == null || typeof json !== "object" || Array.isArray(json)) {
    throw new MalformedApiResponseError("API response is not an envelope object", json);
  }

  const obj = json as Record<string, unknown>;

  if (!("status" in obj)) {
    throw new MalformedApiResponseError("API envelope is missing 'status'", json);
  }
  if (!isEnvelopeStatus(obj.status)) {
    throw new MalformedApiResponseError(
      `API envelope has unknown status: ${String(obj.status)}`,
      json,
    );
  }

  if (obj.status === "error") {
    const error = readErrorBody(obj.error);
    if (!error) {
      throw new MalformedApiResponseError("API error envelope is missing 'error' body", json);
    }
    throw buildApiErrorFromEnvelope(obj, error, httpStatus);
  }

  if (!("data" in obj) || obj.data === undefined) {
    throw new MalformedApiResponseError(
      `API ${obj.status} envelope is missing 'data'`,
      json,
    );
  }

  return obj.data as T;
}

// ─── Core HTTP GET ────────────────────────────────────────────────────────────

/**
 * Performs a typed HTTP GET to the Monstrino API.
 * Throws ApiError, NetworkError, or MalformedApiResponseError — never returns null.
 */
export async function httpGet<T>(path: string, options: HttpGetOptions): Promise<T> {
  const url = buildApiUrl(path);

  const fetchInit: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } =
    options.context === "server"
      ? {
          next: {
            revalidate: options.cache?.revalidate,
            tags: options.cache?.tags,
          },
        }
      : {
          credentials: "include",
          cache: "no-store",
        };

  let response: Response;
  try {
    response = await fetch(url, fetchInit);
  } catch (err) {
    throw new NetworkError(`Network request failed: ${url}`, err);
  }

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = undefined;
    }

    if (body != null && typeof body === "object") {
      const obj = body as Record<string, unknown>;
      const error = obj.status === "error" ? readErrorBody(obj.error) : null;
      if (error) {
        throw buildApiErrorFromEnvelope(obj, error, response.status);
      }
    }

    throw new ApiError(
      `Request failed with status ${response.status}`,
      "HTTP_ERROR",
      response.status,
    );
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new MalformedApiResponseError("API response is not valid JSON");
  }

  return parseEnvelope<T>(json, response.status);
}
