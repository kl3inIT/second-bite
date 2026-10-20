/**
 * A marketing list's filters, sort and page in its address (`?status=running&page=2`), so a filtered list can be
 * shared and the back button returns to it. Each list names its own keys and defaults; what is left at its
 * default stays out of the address. Used by the marketing lists: promotions, banners, notifications and sponsors (SEC-62).
 */

export type SearchParams = Record<string, string | string[] | undefined>;

/** The "Số dòng" choices of a filter bar. */
export const pageSizes = [10, 20, 50] as const;
export type PageSize = (typeof pageSizes)[number];

export type SortDirection = "asc" | "desc";

export type ListQueryValue = string | number;

/** The first value of a parameter, which the address may repeat. */
export function first(params: SearchParams, key: string): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

/** A value kept only when it is one of `allowed`, else `fallback`. */
export function oneOf<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.find((each) => each === value) ?? fallback;
}

/** "Số dòng" from the address, 10 unless it is one of the choices. */
export function pageSizeOf(value: string | undefined): PageSize {
  return pageSizes.find((size) => String(size) === value) ?? 10;
}

/** A page from the address: a whole number from 1, else 1. */
export function pageOf(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

/** The search words from the address, trimmed and at most 100 characters. */
export function searchOf(value: string | undefined): string {
  return (value ?? "").trim().slice(0, 100);
}

/**
 * The search string of a list after `change`: a change to anything but the page goes back to the first page
 * (when the list has pages),
 * and a value equal to its default, or empty, is left out. "" when nothing is left.
 */
export function listSearch<Query extends Record<string, ListQueryValue>>(
  query: Query,
  change: Partial<Query>,
  defaults: Query,
): string {
  const next: Record<string, ListQueryValue> = { ...query, ...change };
  const movesPage = Object.keys(change).some((key) => key !== "page" && change[key] !== query[key]);
  if (movesPage && "page" in query) next.page = 1;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) {
    if (value === "" || value === defaults[key]) continue;
    params.set(key, String(value));
  }
  const search = params.toString();
  return search ? `?${search}` : "";
}

/**
 * The sort after pressing a column's heading: the same column turns around, another column starts with its own
 * first direction.
 */
export function toggledSort<Key extends string>(
  current: { sort: Key; dir: SortDirection },
  key: Key,
  firstDirection: SortDirection,
): { sort: Key; dir: SortDirection } {
  if (current.sort !== key) return { sort: key, dir: firstDirection };
  return { sort: key, dir: current.dir === "asc" ? "desc" : "asc" };
}
