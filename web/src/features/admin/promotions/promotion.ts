import {
  first,
  oneOf,
  type PageSize,
  pageOf,
  pageSizeOf,
  type SearchParams,
  searchOf,
  type SortDirection,
} from "./list-query";

/**
 * Where a code, a banner or a sponsored place stands in its run (Figma AD-MK1, AD-MK3, AD-MK7): "Đang chạy",
 * "Lên lịch", "Tạm dừng", "Hết hạn".
 */
export type CampaignStatus = "running" | "scheduled" | "paused" | "ended";

/** A code takes a share off ("20%", up to a cap) or an amount ("15.000đ"). */
export type Discount =
  { kind: "percent"; percent: number; capVnd?: number } | { kind: "amount"; amountVnd: number };

/** A promotion code as the admin's list shows it (Figma AD-MK1). */
export type PromotionRow = {
  id: string;
  code: string;
  description: string;
  discount: Discount;
  used: number;
  limit: number;
  startsAt: string;
  endsAt: string;
  /** Every store, or the number of stores it was given to. */
  stores: { kind: "all" } | { kind: "some"; count: number };
  status: CampaignStatus;
};

/** The three summary cards: running, scheduled, and ended or paused together. */
export type CampaignCounts = { running: number; scheduled: number; inactive: number };

export type PromotionList = {
  items: PromotionRow[];
  total: number;
  /** Nothing until the backend counts them: the cards show "—", not a zero that looks measured. */
  counts?: CampaignCounts;
};

/** A filter by status: one card or "Tất cả". "inactive" is the third card, ended and paused. */
export const campaignFilters = ["all", "running", "scheduled", "inactive"] as const;
export type CampaignFilter = (typeof campaignFilters)[number];

export const promotionScopes = ["all", "everyStore", "someStores"] as const;
export type PromotionScope = (typeof promotionScopes)[number];

export const promotionSorts = ["period", "code"] as const;
export type PromotionSort = (typeof promotionSorts)[number];

export type PromotionQuery = {
  q: string;
  status: CampaignFilter;
  scope: PromotionScope;
  size: PageSize;
  page: number;
  sort: PromotionSort;
  dir: SortDirection;
};

/** The list opens on every code, newest run first, ten a page. */
export const promotionDefaults: PromotionQuery = {
  q: "",
  status: "all",
  scope: "all",
  size: 10,
  page: 1,
  sort: "period",
  dir: "desc",
};

/** The promotions list's query from its address; anything unknown falls back to its default. */
export function promotionQueryOf(params: SearchParams): PromotionQuery {
  return {
    q: searchOf(first(params, "q")),
    status: oneOf(first(params, "status"), campaignFilters, "all"),
    scope: oneOf(first(params, "scope"), promotionScopes, "all"),
    size: pageSizeOf(first(params, "size")),
    page: pageOf(first(params, "page")),
    sort: oneOf(first(params, "sort"), promotionSorts, "period"),
    dir: oneOf(first(params, "dir"), ["asc", "desc"] as const, "desc"),
  };
}

/** Whether the list is narrowed by anything, which changes what its empty state says. */
export function isFiltered(
  query: { q: string } & Record<string, unknown>,
  keys: string[],
): boolean {
  return query.q !== "" || keys.some((key) => query[key] !== "all");
}
