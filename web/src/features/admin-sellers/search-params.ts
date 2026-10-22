import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsIsoDate,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import type { Sorted } from "@/features/admin/data-table";
import type { AdminSellerBody } from "@/lib/api/generated";

export type SellerStatus = AdminSellerBody["status"];

/** The tabs of a store's page (Figma AD-Q3, AD-QD6), the first as it opens. */
export const sellerTabs = ["overview", "posts", "members", "orders"] as const;

/** The cards over the list, each a status it filters by (Figma AD-Q1); rejected stores have none. */
export const cardStatuses = [
  "active",
  "pending",
  "blocked",
] as const satisfies readonly SellerStatus[];

/** The columns the list sorts by, as the API names them; a leading '-' is descending. */
export const sellerSortColumns = ["name", "address", "changed"] as const;
export type SellerSortColumn = (typeof sellerSortColumns)[number];

const sellerSorts = sellerSortColumns.flatMap((column) => [column, `-${column}`] as const);

/** The rows a page may hold, as the "Số dòng" choice offers them. */
export const sellerPageSizes = [10, 25, 50] as const;

/**
 * What the stores list is filtered by, kept in the address (SEC-75 › Lists, `nuqs`): a status, words, a
 * range of days of the last change, the order, the page and its size. Absent, the list shows every store in the server's queue order, 10 a page
 * as Figma AD-Q1 draws it.
 */
export const sellerSearchParams = {
  status: parseAsStringLiteral(cardStatuses),
  q: parseAsString.withDefault(""),
  province: parseAsInteger,
  from: parseAsIsoDate,
  to: parseAsIsoDate,
  sort: parseAsStringLiteral(sellerSorts),
  page: parseAsInteger.withDefault(1),
  size: parseAsNumberLiteral(sellerPageSizes).withDefault(10),
};

export const loadSellerSearchParams = createLoader(sellerSearchParams);
export const serializeSellerSearchParams = createSerializer(sellerSearchParams);

/** The order asked, as the table heads show it; none is the server's queue, which no head shows. */
export function sortedOf(sort: (typeof sellerSorts)[number] | null): Sorted | null {
  if (sort === null) return null;
  return sort.startsWith("-")
    ? { column: sort.slice(1), direction: "descending" }
    : { column: sort, direction: "ascending" };
}

/** The sort to ask for a column and a direction. */
export function sortOf(column: SellerSortColumn, direction: Sorted["direction"]) {
  return direction === "descending" ? (`-${column}` as const) : column;
}
