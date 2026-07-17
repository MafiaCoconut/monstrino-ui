/**
 * Sanitization for metadata values (titles, descriptions, OG fields).
 *
 * Entity text comes from the backend API, whose content originates from
 * scraped source pages — it may contain HTML fragments, markup remnants and
 * irregular whitespace. Metadata must always be plain, normalized text.
 */

const TAG_PATTERN = /<[^>]*>/g;
// eslint-disable-next-line no-control-regex
const CONTROL_PATTERN = /[\u0000-\u001f\u007f]/g;

export const META_TITLE_MAX = 70;
export const META_DESCRIPTION_MAX = 300;

/** Strip HTML tags, control characters, and collapse whitespace. */
export function sanitizeMetaText(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(TAG_PATTERN, " ")
    .replace(CONTROL_PATTERN, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Truncate at a word boundary with an ellipsis. Never cuts mid-word unless a
 * single word exceeds the limit.
 */
export function truncateAtWord(value: string, max: number): string {
  if (value.length <= max) return value;
  const slice = value.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.5 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

/** Sanitized, length-bounded title (without the site suffix — the root layout template appends it). */
export function metaTitle(value: string | null | undefined): string {
  return truncateAtWord(sanitizeMetaText(value), META_TITLE_MAX);
}

/** Sanitized, length-bounded description. */
export function metaDescription(value: string | null | undefined): string {
  return truncateAtWord(sanitizeMetaText(value), META_DESCRIPTION_MAX);
}
