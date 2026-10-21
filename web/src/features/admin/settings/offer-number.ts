/**
 * What a settings number field does as it is typed (docs: admin-web-flow › Cài đặt bài đăng): only digits; a number
 * over `max` becomes `max` at once; one under `min` stays on show as typed (`draft`) while the value under it is
 * `min`, so there is never a range error at the field. Empty stays empty on show.
 */
export function typedNumber(
  raw: string,
  min: number,
  max: number,
): { draft: string | undefined; value: number | undefined } {
  const digits = raw.replace(/\D/g, "").slice(0, 9);
  if (digits === "") return { draft: "", value: undefined };
  const typed = Number(digits);
  if (typed > max) return { draft: undefined, value: max };
  return { draft: typed < min ? digits : undefined, value: Math.max(typed, min) };
}

/** The value a number field keeps once it is left: what was typed, held to its bounds; empty is `min`. */
export function leftNumber(draft: string, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number(draft || min)));
}
