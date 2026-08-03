/** Parses a user-entered numeric string for use as an API filter value.
 * Rejects anything that isn't a finite positive number — empty, NaN,
 * negative, zero, and Infinity (e.g. from "1e999") all become undefined
 * instead of reaching the backend as an invalid query param. */
export function toPositiveNumber(value?: string): number | undefined {
  if (!value) return undefined
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : undefined
}

/** A min/max pair only makes sense as a range — the backend rejects
 * minPrice > maxPrice outright. Rather than surface that as an error for
 * what's a normal mid-typing state (e.g. lowering maxPrice below an
 * already-set minPrice), swap the pair so min is always the smaller one. */
export function normalizeRange(
  min: number | undefined,
  max: number | undefined
): { min: number | undefined; max: number | undefined } {
  if (min !== undefined && max !== undefined && min > max) {
    return { min: max, max: min }
  }
  return { min, max }
}
