// ─── API Error ────────────────────────────────────────────────────────────────

/** Thrown when the backend returns a non-2xx response or a Monstrino error envelope */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId?: string;
  readonly retryable: boolean;
  readonly details?: Record<string, unknown> | null;

  constructor(
    message: string,
    code: string,
    status: number,
    requestId?: string,
    options?: { retryable?: boolean; details?: Record<string, unknown> | null },
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.requestId = requestId;
    this.retryable = options?.retryable ?? false;
    this.details = options?.details;
  }
}

// ─── Network Error ────────────────────────────────────────────────────────────

/** Thrown when the network request itself fails (no response received) */
export class NetworkError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "NetworkError";
    this.cause = cause;
  }
}

// ─── Timeout Error ────────────────────────────────────────────────────────────

/**
 * Thrown when a request exceeds its bounded timeout (AbortSignal.timeout).
 * Distinct from NetworkError so callers can tell "backend slow/hung" from
 * "connection failed"; both classify as backend-unavailable for pages.
 */
export class TimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(message: string, timeoutMs: number) {
    super(message);
    this.name = "TimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

// ─── Validation Error ─────────────────────────────────────────────────────────

/** Thrown when a backend response fails Zod schema validation */
export class ValidationError extends Error {
  readonly issues: unknown[];

  constructor(message: string, issues: unknown[]) {
    super(message);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

// ─── Malformed API Response Error ─────────────────────────────────────────────

/**
 * Thrown when an HTTP 2xx body is not a valid Monstrino API envelope
 * (not JSON, missing/unknown `status`, missing `data`, legacy shapes, …).
 * Distinct from ValidationError: the envelope itself is broken, not the
 * resource payload inside it.
 */
export class MalformedApiResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MalformedApiResponseError";
  }
}

// ─── Type guards ──────────────────────────────────────────────────────────────

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

export function isNetworkError(err: unknown): err is NetworkError {
  return err instanceof NetworkError;
}

export function isTimeoutError(err: unknown): err is TimeoutError {
  return err instanceof TimeoutError;
}

export function isValidationError(err: unknown): err is ValidationError {
  return err instanceof ValidationError;
}

export function isMalformedApiResponseError(err: unknown): err is MalformedApiResponseError {
  return err instanceof MalformedApiResponseError;
}
