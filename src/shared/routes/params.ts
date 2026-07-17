/**
 * URL path-parameter validation.
 *
 * Dynamic segments come straight from the address bar and must be validated
 * before they reach API paths or metadata. Garbage input short-circuits to
 * 404 instead of producing backend requests with junk paths.
 */

/** Release slugs: lowercase/uppercase alphanumerics, hyphens, underscores. */
const SLUG_PATTERN = /^[a-zA-Z0-9_-]{1,200}$/;

/** Internal entity ids (numeric or uuid-like tokens). */
const ID_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

export function isValidSlugParam(value: string): boolean {
  return SLUG_PATTERN.test(value);
}

export function isValidIdParam(value: string): boolean {
  return ID_PATTERN.test(value);
}
