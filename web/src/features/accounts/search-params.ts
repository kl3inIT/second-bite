import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import type { Sorted } from "@/features/admin/data-table";

/** The tabs over the list: every account, customers, admins (`role` absent for every account). */
export const accountRoles = ["customer", "admin"] as const;

/** The columns the list sorts by, as the API names them; a leading '-' is descending. */
export const accountSortColumns = ["name", "created", "signedIn"] as const;
export type AccountSortColumn = (typeof accountSortColumns)[number];

const accountSorts = accountSortColumns.flatMap((column) => [column, `-${column}`] as const);

/** The rows a page may hold, as the "Số dòng" choice offers them. */
export const accountPageSizes = [10, 25, 50] as const;

/**
 * What the accounts list is filtered by, kept in the address (SEC-75 › Lists, `nuqs`): a role, words, the
 * order, the page and its size. Absent, the list shows every account, the newest first, 25 to a page.
 */
export const accountSearchParams = {
  role: parseAsStringLiteral(accountRoles),
  q: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(accountSorts),
  page: parseAsInteger.withDefault(1),
  size: parseAsNumberLiteral(accountPageSizes).withDefault(25),
};

export const loadAccountSearchParams = createLoader(accountSearchParams);
export const serializeAccountSearchParams = createSerializer(accountSearchParams);

/** The order asked, as the table heads show it; none is the newest first, by creation. */
export function sortedOf(sort: (typeof accountSorts)[number] | null): Sorted {
  if (sort === null) return { column: "created", direction: "descending" };
  return sort.startsWith("-")
    ? { column: sort.slice(1), direction: "descending" }
    : { column: sort, direction: "ascending" };
}

/** The sort to ask for a column and a direction. */
export function sortOf(column: AccountSortColumn, direction: Sorted["direction"]) {
  return direction === "descending" ? (`-${column}` as const) : column;
}
