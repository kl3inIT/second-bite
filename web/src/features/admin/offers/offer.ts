import {
  BanIcon,
  CircleCheckIcon,
  ClockIcon,
  type LucideIcon,
  RotateCcwIcon,
  TriangleAlertIcon,
} from "lucide-react";

import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "@/components/ui/badge";
import type { OfferBody } from "@/lib/api/generated";

// Every post in the system, as the admin sees it (docs: admin-web-flow › Bài đăng, Figma AD-BD1 to AD-BD4). The
// offer module lists a store's posts but not every store's for an admin, and has no removal for a violation;
// these are the shapes the screens are drawn for.

/**
 * A post's status: the store's own (on sale, sold out, closed, `withdrawn` = "Đã gỡ" by the store) and `removed`
 * = "Gỡ do vi phạm", taken down by an admin (decided 20 October 2026).
 */
export const offerStatuses = ["on_sale", "sold_out", "closed", "withdrawn", "removed"] as const;
export type OfferStatus = (typeof offerStatuses)[number];

export type OfferKind = OfferBody["kind"];

export type AdminOfferRow = {
  id: string;
  name: string;
  /** The small photo's address, `/api/photos/…/400.jpg`. */
  photoUrl?: string;
  sellerId: string;
  sellerName: string;
  kind: OfferKind;
  priceVnd: number;
  originalPriceVnd: number;
  discountPercent: number;
  units: number;
  unitsLeft: number;
  /** Units customers hold and have not collected yet. */
  unitsHeld: number;
  /** What one unit is called: "túi", "suất". */
  unit: string;
  weightGrams?: number;
  windowStart: string;
  windowEnd: string;
  description: string;
  status: OfferStatus;
  createdAt: string;
  /** Who posted it, by email. */
  postedBy?: string;
};

export type OfferSeller = { id: string; name: string };

/** A badge's look: one of the shared Badge's own variants, and the icon that carries the status with its words. */
type BadgeLook = { variant: VariantProps<typeof badgeVariants>["variant"]; icon: LucideIcon };

const statusLooks: Record<OfferStatus, BadgeLook> = {
  on_sale: { variant: "fresh", icon: CircleCheckIcon },
  sold_out: { variant: "outline", icon: TriangleAlertIcon },
  closed: { variant: "outline", icon: ClockIcon },
  withdrawn: { variant: "outline", icon: RotateCcwIcon },
  removed: { variant: "destructive", icon: BanIcon },
};

/** A post's status as Figma AD-BD1 draws it in the table. */
export function statusLook(status: OfferStatus): BadgeLook {
  return statusLooks[status];
}

const cardLooks: Record<OfferStatus, BadgeLook> = {
  on_sale: { variant: "fresh", icon: CircleCheckIcon },
  sold_out: { variant: "outline", icon: ClockIcon },
  closed: { variant: "outline", icon: ClockIcon },
  withdrawn: { variant: "outline", icon: ClockIcon },
  removed: { variant: "destructive", icon: BanIcon },
};

/** A status's summary card as Figma AD-BD1 draws it: the badge of its icon (success, warning, error). */
export function cardLook(status: OfferStatus): BadgeLook {
  return cardLooks[status];
}

/** Whether an admin can still take a post down: it is not gone already. */
export function canRemove(status: OfferStatus): boolean {
  return status !== "removed" && status !== "withdrawn";
}

/** Why an admin takes a post down (Figma AD-BD3 › Lý do gỡ bài). */
export const removeReasons = ["food_safety", "price", "misleading", "other"] as const;
export type RemoveReason = (typeof removeReasons)[number];

export const offerKinds = [
  "bakery",
  "prepared_food",
  "ingredients",
  "drinks",
  "mixed_box",
  "other",
] as const satisfies readonly OfferKind[];

export type OfferSortKey = "name" | "seller" | "price" | "window";

export type OfferQuery = {
  /** The status card chosen, or every status. */
  status?: OfferStatus;
  page: number;
  q: string;
  seller?: string;
  kind?: OfferKind;
  /** Posted from and to, days as YYYY-MM-DD. */
  from?: string;
  to?: string;
  sort: OfferSortKey;
  direction: "asc" | "desc";
  /** The post open in the side panel. */
  offer?: string;
};

/** Ten posts a page, as Figma AD-BD1 shows them. */
export const pageSize = 10;

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

const day = /^\d{4}-\d{2}-\d{2}$/;
const sortKeys: readonly OfferSortKey[] = ["name", "seller", "price", "window"];

/** The list's state from its address: `?status=removed&q=…&seller=…&kind=…&from=…&to=…&sort=price&dir=asc`. */
export function readOfferQuery(params: SearchParams): OfferQuery {
  const page = Number(one(params.page));
  const from = one(params.from);
  const to = one(params.to);
  const sort = sortKeys.find((key) => key === one(params.sort)) ?? "window";
  return {
    status: offerStatuses.find((status) => status === one(params.status)),
    page: Number.isInteger(page) && page > 1 ? page : 1,
    q: one(params.q)?.trim() ?? "",
    seller: one(params.seller) || undefined,
    kind: offerKinds.find((kind) => kind === one(params.kind)),
    from: from && day.test(from) ? from : undefined,
    to: to && day.test(to) ? to : undefined,
    sort,
    direction: one(params.dir) === "asc" ? "asc" : "desc",
    offer: one(params.offer) || undefined,
  };
}

/** The list's address for a state, leaving out what is as it is by default. */
export function offersHref(query: OfferQuery): string {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.q) params.set("q", query.q);
  if (query.seller) params.set("seller", query.seller);
  if (query.kind) params.set("kind", query.kind);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.sort !== "window") params.set("sort", query.sort);
  if (query.direction !== "desc") params.set("dir", query.direction);
  if (query.page > 1) params.set("page", String(query.page));
  if (query.offer) params.set("offer", query.offer);
  const search = params.toString();
  return `/admin/offers${search ? `?${search}` : ""}`;
}

/**
 * Pressing a sortable heading: the column sorted another way round, or a new column sorted down first.
 */
export function toggleSort(query: OfferQuery, key: OfferSortKey): OfferQuery {
  const direction = query.sort === key && query.direction === "desc" ? "asc" : "desc";
  return { ...query, sort: key, direction, page: 1, offer: undefined };
}

/** A day of the date filter as the address writes it, in the day's own calendar: 2026-10-20. */
export function toDay(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** The address's day as a date at the start of that day where the browser is. */
export function fromDay(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const [year, month, date] = value.split("-").map(Number);
  return new Date(year, month - 1, date);
}
