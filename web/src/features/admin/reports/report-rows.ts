/**
 * A store's line of the report (Figma AD-BC1 › Table): its held orders, the portions customers collected, the share
 * of orders collected and what it took at the counter. All of it comes from orders (SEC-15) and the reports
 * (SEC-13), which do not exist yet.
 */
export type ReportSellerRow = {
  sellerId: string;
  name: string;
  photoUrl?: string;
  orders: number;
  portionsSaved: number;
  /** Collected orders over held orders, 0 to 1. */
  collectionRate: number;
  /** Taken at the counter, estimated from the posts' prices: customers pay there. */
  revenueVnd: number;
};

export type ReportSortKey = Exclude<keyof ReportSellerRow, "sellerId" | "photoUrl">;

export type ReportSort = { key: ReportSortKey; direction: "asc" | "desc" };

/** Figma AD-BC1 sorts the stores by orders, most first. */
export const defaultReportSort: ReportSort = { key: "orders", direction: "desc" };

/** The rows in the order a heading asks for; names in Vietnamese order, ties kept as they came. */
export function sortReportRows(rows: ReportSellerRow[], { key, direction }: ReportSort) {
  const sign = direction === "asc" ? 1 : -1;
  return rows.toSorted((a, b) => {
    const left = a[key];
    const right = b[key];
    const order =
      typeof left === "string" && typeof right === "string"
        ? left.localeCompare(right, "vi")
        : Number(left) - Number(right);
    return order * sign;
  });
}

/** What pressing a heading does: the sorted column turns over; another column starts most first, names A to Z. */
export function nextReportSort(current: ReportSort, key: ReportSortKey): ReportSort {
  if (current.key === key) return { key, direction: current.direction === "asc" ? "desc" : "asc" };
  return { key, direction: key === "name" ? "asc" : "desc" };
}
