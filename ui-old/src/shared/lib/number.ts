/** Numeric helpers for display-only formatting. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Parse a currency-like string into a number. */
export function parseMoney(value: string): number {
  const parsed = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Format a number as a fixed 2-decimal currency string. */
export function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}
