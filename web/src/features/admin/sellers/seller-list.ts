import type { SellerBody } from "@/lib/api/generated";
import { isFeatureOn } from "../features";
import { type PageSize, pageSizes } from "../list-query";

/**
 * The stores list's state, kept in its address so it can be shared and survives a reload (docs: admin-web-flow ›
 * Style 6.1): the status card pressed, the search, the area, the change dates, the rows per page, the page and
 * the sort. The backend lists a status; searching, filtering and sorting happen here in the browser while the
 * pilot has 30 to 100 stores, and move to the backend when there are more.
 */
/** A store's status: the backend's three, and SEC-64's `rejected` behind the `storeReview` flag. */
export type SellerStatus = SellerBody["status"] | "rejected";
/** A store as the admin lists it, which may be `rejected` once SEC-64 gives that status. */
export type AdminSeller = Omit<SellerBody, "status"> & { status: SellerStatus };
export type SortKey = "name" | "address" | "updatedAt";
export type SortDirection = "asc" | "desc";

export type ListQuery = {
  status: SellerStatus;
  q: string;
  /** An area read from the addresses ("Tầng 1"), or "" for all. */
  area: string;
  /** The first and last day of the change date, `2026-10-20` in Vietnam's time, both included. */
  from?: string;
  to?: string;
  size: PageSize;
  page: number;
  sort: SortKey;
  dir: SortDirection;
};

/**
 * The statuses the list offers, in the order of its cards: today Đang hoạt động, Chờ duyệt, Bị chặn; with the
 * `storeReview` flag (SEC-64) the queue comes first, Chờ duyệt, Đang hoạt động, Bị từ chối, Bị chặn (AD-DS1).
 */
export function listStatuses(review: boolean): readonly SellerStatus[] {
  return review ? ["pending", "active", "rejected", "blocked"] : ["active", "pending", "blocked"];
}

/** The status the list opens on: the active stores today, the pending queue with the `storeReview` flag. */
export function defaultStatus(review: boolean): SellerStatus {
  return review ? "pending" : "active";
}

const sortKeys: readonly SortKey[] = ["name", "address", "updatedAt"];
const day = /^\d{4}-\d{2}-\d{2}$/;

export const defaultQuery: ListQuery = {
  status: "active",
  q: "",
  area: "",
  size: 10,
  page: 1,
  sort: "updatedAt",
  dir: "desc",
};

type Params = URLSearchParams | Record<string, string | string[] | undefined>;

function read(params: Params, name: string): string | undefined {
  if (params instanceof URLSearchParams) return params.get(name) ?? undefined;
  const value = params[name];
  return Array.isArray(value) ? value[0] : value;
}

/**
 * The status the address asks for, the list's first status when it names none or one the list does not offer
 * (`rejected` while the `storeReview` flag is off).
 */
export function readStatus(params: Params, review = isFeatureOn("storeReview")): SellerStatus {
  return (
    listStatuses(review).find((status) => status === read(params, "status")) ??
    defaultStatus(review)
  );
}

/** The list's state from its address; whatever is missing or wrong takes its default. */
export function readListQuery(params: Params, review = isFeatureOn("storeReview")): ListQuery {
  const size = Number(read(params, "size"));
  const page = Number(read(params, "page"));
  const sort = sortKeys.find((key) => key === read(params, "sort")) ?? defaultQuery.sort;
  const dir = read(params, "dir");
  const from = read(params, "from");
  const to = read(params, "to");
  return {
    status: readStatus(params, review),
    q: read(params, "q") ?? "",
    area: read(params, "area") ?? "",
    from: from && day.test(from) ? from : undefined,
    to: to && day.test(to) ? to : undefined,
    size: pageSizes.find((each) => each === size) ?? defaultQuery.size,
    page: Number.isInteger(page) && page > 0 ? page : 1,
    sort,
    dir: dir === "asc" || dir === "desc" ? dir : sort === "updatedAt" ? "desc" : "asc",
  };
}

/** The address's query for a state, leaving out what is at its default: `status=blocked&q=banh`. */
export function listQueryString(query: ListQuery, review = isFeatureOn("storeReview")): string {
  const params = new URLSearchParams();
  if (query.status !== defaultStatus(review)) params.set("status", query.status);
  if (query.q) params.set("q", query.q);
  if (query.area) params.set("area", query.area);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.size !== defaultQuery.size) params.set("size", String(query.size));
  if (query.page !== 1) params.set("page", String(query.page));
  if (query.sort !== defaultQuery.sort || query.dir !== defaultQuery.dir) {
    params.set("sort", query.sort);
    params.set("dir", query.dir);
  }
  return params.toString();
}

/** Whether the person narrowed the list: a search, an area or change dates. */
export function isFiltered(query: ListQuery): boolean {
  return Boolean(query.q.trim() || query.area || query.from || query.to);
}

/** Pressing a sortable heading: the column sorted the other way, or a new column in its natural order. */
export function toggleSort(query: ListQuery, key: SortKey): Pick<ListQuery, "sort" | "dir"> {
  if (query.sort === key) return { sort: key, dir: query.dir === "asc" ? "desc" : "asc" };
  return { sort: key, dir: key === "updatedAt" ? "desc" : "asc" };
}

/** Words without their marks and in lower case, so "banh" finds "Bánh" and "Đ" finds "đ". */
export function fold(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/gi, "d").toLowerCase();
}

/**
 * The area of an address, as the stores of Tasco Mall write it: "Tầng 1", "Tầng B1", "Tầng hầm". The seller
 * keeps no area of its own yet (Cài đặt › Khu vực is to come), so it is read from the address.
 */
export function areaOf(address: string): string | undefined {
  const match = /t[ầa]ng\s+([\p{L}\p{N}]+)/iu.exec(address);
  return match ? `Tầng ${match[1]}` : undefined;
}

/** The areas the stores' addresses name, in order: "Tầng B1", "Tầng 1", "Tầng 2", "Tầng hầm". */
export function areasOf(rows: readonly Pick<SellerBody, "address">[]): string[] {
  const areas = new Set(
    rows.map((row) => areaOf(row.address)).filter((area) => area !== undefined),
  );
  return [...areas].toSorted(collator.compare);
}

const collator = new Intl.Collator("vi", { numeric: true, sensitivity: "base" });
const vietnamDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });

/** The day a moment falls on in Vietnam: `2026-10-20`. */
export function dayOf(at: string | Date): string {
  return vietnamDay.format(typeof at === "string" ? new Date(at) : at);
}

function compare(a: AdminSeller, b: AdminSeller, key: SortKey): number {
  if (key === "updatedAt") return Date.parse(a.updatedAt) - Date.parse(b.updatedAt);
  return collator.compare(a[key], b[key]);
}

/** The stores in a column's order; ties keep the name's order, so a page never shuffles between two renders. */
export function sortSellers(
  rows: readonly AdminSeller[],
  { sort, dir }: Pick<ListQuery, "sort" | "dir">,
): AdminSeller[] {
  const sign = dir === "asc" ? 1 : -1;
  return rows.toSorted((a, b) => sign * compare(a, b, sort) || collator.compare(a.name, b.name));
}

/**
 * The stores before and after one in its status's list as it first opens (the newest change first), for the
 * ‹ › of a store's page, and where it stands: "1 / 5".
 */
export function neighboursOf(
  rows: readonly AdminSeller[],
  sellerId: string,
): { previous?: string; next?: string; position: number; total: number } {
  const sorted = sortSellers(rows, defaultQuery);
  const index = sorted.findIndex((row) => row.id === sellerId);
  if (index < 0) return { position: 0, total: sorted.length };
  return {
    previous: sorted[index - 1]?.id,
    next: sorted[index + 1]?.id,
    position: index + 1,
    total: sorted.length,
  };
}

/** The stores the state asks for, sorted, then the page of them: the rows shown and how many matched. */
export function applyListQuery(
  rows: readonly AdminSeller[],
  query: ListQuery,
): { rows: AdminSeller[]; total: number; page: number } {
  const words = fold(query.q.trim());
  const matched = rows.filter(
    (row) =>
      (!words || fold(row.name).includes(words) || fold(row.address).includes(words)) &&
      (!query.area || areaOf(row.address) === query.area) &&
      (!query.from || dayOf(row.updatedAt) >= query.from) &&
      (!query.to || dayOf(row.updatedAt) <= query.to),
  );
  const sorted = sortSellers(matched, query);
  const pages = Math.max(1, Math.ceil(sorted.length / query.size));
  const page = Math.min(query.page, pages);
  return {
    rows: sorted.slice((page - 1) * query.size, page * query.size),
    total: sorted.length,
    page,
  };
}
