import { logger } from "./logger";
import type { ErrorInfo } from "react";
import { isApiError, isNetworkError, isValidationError } from "@shared/api/http";

// ─── Report unhandled / boundary errors ──────────────────────────────────────

/**
 * Report an error caught by React ErrorBoundary or a global handler.
 * Attach componentStack when available.
 *
 * Future integration point: replace the logger call with
 * `Sentry.captureException(error, { extra: { componentStack } })`
 * or `faro.api.pushError(error)` for Grafana Faro.
 */
export function reportError(error: Error, errorInfo?: ErrorInfo): void {
  // Cast to unknown to allow discriminated type-guard narrowing
  const err: unknown = error;

  if (isApiError(err)) {
    logger.error(
      `[ApiError] ${err.message}`,
      `code=${err.code}`,
      `status=${err.status}`,
      err.requestId ? `requestId=${err.requestId}` : "",
    );
    return;
  }

  if (isNetworkError(err)) {
    logger.error(`[NetworkError] ${err.message}`);
    return;
  }

  if (isValidationError(err)) {
    logger.error(`[ValidationError] ${err.message}`, err.issues);
    return;
  }

  logger.error(`[${error.name}] ${error.message}`, errorInfo?.componentStack ?? "");
}

// ─── Report API errors from React Query or resource functions ─────────────────

/**
 * Report an error surfaced from a React Query `onError` or resource catch block.
 * Logs requestId so the backend log can be correlated.
 */
export function reportQueryError(error: unknown): void {
  if (error instanceof Error) {
    reportError(error);
  } else {
    logger.error("[UnknownQueryError]", error);
  }
}
