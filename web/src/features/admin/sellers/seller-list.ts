import type { VariantProps } from "class-variance-authority";
import {
  BanIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  InfoIcon,
  type LucideIcon,
  TriangleAlertIcon,
} from "lucide-react";

import type { badgeVariants } from "@/components/ui/badge";
import type { AdminSellerBody, SellerBody } from "@/lib/api/generated";
import { isFeatureOn } from "../features";
import { type PageSize, pageSizes, searchOf } from "../list-query";

/**
 * The stores list's state, kept in its address so it can be shared and survives a reload (docs: admin-web-flow ›
 * Style 6.1): the status card pressed, the search, the rows per page and the page. `GET /admin/sellers` searches
 * and pages them, in its own order: the pending ones first, the oldest first, then the latest change first.
 */
/** A store's status: pending, active, rejected or blocked. */
export type SellerStatus = SellerBody["status"];
/**
 * A store as `GET /admin/sellers` lists it: the store and its owner's address. The backend embeds the store's
 * fields in each item, which api/openapi.yaml's `AdminSellerBody` leaves out (only `ownerEmail` is described).
 */
export type AdminSeller = SellerBody & AdminSellerBody;

export type ListQuery = {
  status: SellerStatus;
  q: string;
  size: PageSize;
  page: number;
};

/**
 * The statuses the list offers, in the order of its cards: Đang hoạt động, Chờ duyệt, Bị chặn; with the
 * `storeReview` flag the queue comes first, Chờ duyệt, Đang hoạt động, Bị từ chối, Bị chặn (AD-DS1).
 */
export function listStatuses(review: boolean): readonly SellerStatus[] {
  return review ? ["pending", "active", "rejected", "blocked"] : ["active", "pending", "blocked"];
}

/** The status the list opens on: the active stores, or the pending queue with the `storeReview` flag. */
export function defaultStatus(review: boolean): SellerStatus {
  return review ? "pending" : "active";
}

export const defaultQuery: ListQuery = { status: "active", q: "", size: 10, page: 1 };

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
  return {
    status: readStatus(params, review),
    q: searchOf(read(params, "q")),
    size: pageSizes.find((each) => each === size) ?? defaultQuery.size,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** The address's query for a state, leaving out what is at its default: `status=blocked&q=banh`. */
export function listQueryString(query: ListQuery, review = isFeatureOn("storeReview")): string {
  const params = new URLSearchParams();
  if (query.status !== defaultStatus(review)) params.set("status", query.status);
  if (query.q) params.set("q", query.q);
  if (query.size !== defaultQuery.size) params.set("size", String(query.size));
  if (query.page !== 1) params.set("page", String(query.page));
  return params.toString();
}

/** Whether the person narrowed the list with a search. */
export function isFiltered(query: ListQuery): boolean {
  return Boolean(query.q.trim());
}

/**
 * The stores before and after one in its status's list, in the backend's order, for the ‹ › of a store's page,
 * and where it stands: "1 / 5".
 */
export function neighboursOf(
  rows: readonly Pick<SellerBody, "id">[],
  sellerId: string,
): { previous?: string; next?: string; position: number; total: number } {
  const index = rows.findIndex((row) => row.id === sellerId);
  if (index < 0) return { position: 0, total: rows.length };
  return {
    previous: rows[index - 1]?.id,
    next: rows[index + 1]?.id,
    position: index + 1,
    total: rows.length,
  };
}

/** How a status reads on the stores' screens: done, waiting, refused, a plain fact, or nothing to act on. */
export type BadgeTone = "success" | "warning" | "error" | "info" | "neutral";

/**
 * Each tone on the closest of the shared Badge's own variants (components/ui/badge.tsx); the icon and the words
 * carry the status, never the colour alone.
 */
export const toneBadge: Record<
  BadgeTone,
  NonNullable<VariantProps<typeof badgeVariants>["variant"]>
> = {
  success: "fresh",
  warning: "outline",
  error: "destructive",
  info: "secondary",
  neutral: "outline",
};

/** The icon a tone shows when its status names none of its own. */
export const toneIcon: Record<BadgeTone, LucideIcon> = {
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  error: CircleXIcon,
  info: InfoIcon,
  neutral: ClockIcon,
};

/** A store's status as a Badge: "Đang hoạt động", "Chờ duyệt", "Bị từ chối", "Bị chặn", each with its icon. */
export const sellerStatusLook: Record<SellerStatus, { tone: BadgeTone; icon: LucideIcon }> = {
  active: { tone: "success", icon: CircleCheckIcon },
  pending: { tone: "warning", icon: ClockIcon },
  rejected: { tone: "neutral", icon: CircleXIcon },
  blocked: { tone: "error", icon: BanIcon },
};

/** How many pages a list of `total` rows takes; a missing total (the backend sent none) is an empty list. */
export function pageCount(total: number | undefined, pageSize: number): number {
  const rows = Number.isFinite(total) ? Math.max(0, total as number) : 0;
  return Math.max(1, Math.ceil(rows / pageSize));
}
