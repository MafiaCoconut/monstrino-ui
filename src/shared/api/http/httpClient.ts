import { ZodError } from "zod";
import { ApiError, NetworkError, ValidationError } from "./errors";
import { backendUrl } from "@shared/config/env";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Monstrino unified API envelope */
interface MonstrinoEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string } | null;
  meta?: { request_id?: string; version?: string };
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

// ─── Response unwrapper ───────────────────────────────────────────────────────

/**
 * Handles all three response shapes the backend may emit:
 *   - Monstrino envelope: { success, data, meta }
 *   - Legacy result wrapper: { result: T }
 *   - Direct data: T
 */
function unwrapResponse<T>(json: unknown): T {
  if (json == null || typeof json !== "object") return json as T;

  const obj = json as Record<string, unknown>;

  // Monstrino envelope
  if ("success" in obj) {
    const env = obj as unknown as MonstrinoEnvelope<T>;
    if (!env.success && env.error) {
      throw new ApiError(
        env.error.message ?? "API error",
        env.error.code ?? "UNKNOWN",
        422,
        env.meta?.request_id,
      );
    }
    if (env.data !== undefined) return env.data as T;
  }

  // Legacy result wrapper
  if ("result" in obj && obj.result !== undefined) return obj.result as T;

  // Legacy data wrapper (without 'success' key)
  if ("data" in obj && !("success" in obj) && obj.data !== undefined)
    return obj.data as T;

  return json as T;
}

// ─── Core HTTP GET ────────────────────────────────────────────────────────────

/**
 * Performs a typed HTTP GET to the Monstrino API.
 * Throws ApiError, NetworkError, or ValidationError — never returns null.
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
    let code = "HTTP_ERROR";
    let message = `Request failed with status ${response.status}`;
    let requestId: string | undefined;
    try {
      const errBody = (await response.json()) as Partial<MonstrinoEnvelope<never>>;
      if (errBody.error?.code) code = errBody.error.code;
      if (errBody.error?.message) message = errBody.error.message;
      if (errBody.meta?.request_id) requestId = errBody.meta.request_id;
    } catch {
      // ignore JSON parse failure on error body
    }
    throw new ApiError(message, code, response.status, requestId);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch (err) {
    throw new ValidationError("Failed to parse response JSON", [err]);
  }

  try {
    return unwrapResponse<T>(json);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError("Response did not match expected schema", err.issues);
    }
    throw err;
  }
}
