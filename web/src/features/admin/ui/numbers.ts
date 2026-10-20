/** A number held to its bounds: an admin number field never holds a value outside them. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** The pages a Pagination shows: all of them up to seven, otherwise the first, the last and those around the current one. */
export function pageNumbers(page: number, pages: number): (number | "gap")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, index) => index + 1);
  const around = [page - 1, page, page + 1].filter((n) => n > 1 && n < pages);
  const shown = [1, ...around, pages];
  return shown.flatMap((n, index) =>
    index > 0 && n - shown[index - 1] > 1 ? (["gap", n] as const) : [n],
  );
}
