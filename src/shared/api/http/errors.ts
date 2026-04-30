// ─── API Error ────────────────────────────────────────────────────────────────

/** Thrown when the backend returns a non-2xx response or a Monstrino error envelope */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId?: string;

  constructor(message: string, code: string, status: number, requestId?: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.requestId = requestId;
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

// ─── Type guards ──────────────────────────────────────────────────────────────

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

export function isNetworkError(err: unknown): err is NetworkError {
  return err instanceof NetworkError;
}

export function isValidationError(err: unknown): err is ValidationError {
  return err instanceof ValidationError;
}
