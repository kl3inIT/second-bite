import type { VariantProps } from "class-variance-authority";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  InfoIcon,
  type LucideIcon,
  TriangleAlertIcon,
} from "lucide-react";

import type { badgeVariants } from "@/components/ui/badge";

// The admin's orders (SEC-62, Figma AD-DH1 to AD-DH5). SEC-15 has not built the `order` module yet, so these
// shapes follow the order's states as the team drew them (Figma "Đơn · SEC-15", 155:832: Đã xác nhận, Sẵn
// sàng, Đã nhận, Đã huỷ, Hết hạn, Bị từ chối) and the roadmap's SEC-15 line. They are replaced by the
// generated SDK's types once SEC-15 publishes its admin API; the screens keep their props.

/** Where an order is: held for its window (confirmed, then ready), then collected or closed without a sale. */
export type OrderStatus =
  "confirmed" | "ready" | "collected" | "cancelled" | "expired" | "rejected";

export const orderStatuses: readonly OrderStatus[] = [
  "confirmed",
  "ready",
  "collected",
  "cancelled",
  "expired",
  "rejected",
];

/** Still held for the customer: the order can be cancelled and its code still works. */
export function isOpen(status: OrderStatus): boolean {
  return status === "confirmed" || status === "ready";
}

/** One row of the orders table (AD-DH1). Times are ISO instants. */
export type AdminOrderRow = {
  id: string;
  /** "SB-24831", shown with a "#". */
  code: string;
  customerName: string;
  /** Searched but not shown: an account's page opens the list on it (`?q=`). */
  customerEmail?: string;
  sellerId: string;
  sellerName: string;
  sellerPhotoUrl?: string;
  items: { name: string; quantity: number }[];
  totalVnd: number;
  pickupStart: string;
  pickupEnd: string;
  status: OrderStatus;
};

/** The figures over the table (AD-DH1); none until the backend counts them. */
export type OrderSummary = { collectedToday: number; waiting: number; noShow: number };

/** A step of an order's history (AD-DH3 › Lịch sử đơn). `awaiting` is the step still to come. */
export type OrderEventKind =
  | "placed"
  | "confirmed"
  | "ready"
  | "collected"
  | "cancelled"
  | "rejected"
  | "expired"
  | "awaiting";

/** An order as its page shows it (AD-DH3). */
export type AdminOrder = {
  id: string;
  code: string;
  status: OrderStatus;
  placedAt: string;
  pickupStart: string;
  pickupEnd: string;
  /** When it was collected, cancelled, refused or expired. */
  closedAt?: string;
  totalVnd: number;
  items: {
    offerId: string;
    name: string;
    photoUrl?: string;
    quantity: number;
    priceVnd: number;
    originalPriceVnd: number;
  }[];
  customer: {
    name: string;
    phone: string;
    email: string;
    collectedBefore: number;
    noShowBefore: number;
    /** How many times in the last 30 days the customer did not come, this order included. */
    noShowsIn30Days?: number;
  };
  seller: {
    id: string;
    name: string;
    location: string;
    phone: string;
    status: "active" | "pending" | "rejected" | "blocked";
  };
  wrongCodeAttempts: number;
  maxCodeAttempts: number;
  history: { kind: OrderEventKind; at: string }[];
};

export type OrderStep = {
  key: string;
  kind: OrderEventKind;
  at: string;
  tone: "done" | "pending" | "error";
};

/**
 * The order's history as its timeline shows it (AD-DH3, AD-DH5): each step taken in green, a cancellation or
 * a refusal in red, the expiry in grey; an order still held ends with the step to come, "Chờ khách nhận bằng
 * mã", due when its window closes.
 */
export function orderSteps(
  order: Pick<AdminOrder, "status" | "pickupEnd" | "history">,
): OrderStep[] {
  const steps: OrderStep[] = order.history.map((event, index) => ({
    key: `${event.kind}-${index}`,
    kind: event.kind,
    at: event.at,
    tone:
      event.kind === "cancelled" || event.kind === "rejected"
        ? "error"
        : event.kind === "expired"
          ? "pending"
          : "done",
  }));
  if (isOpen(order.status)) {
    steps.push({ key: "awaiting", kind: "awaiting", at: order.pickupEnd, tone: "pending" });
  }
  return steps;
}

/** Why an admin cancels an order (AD-DH4); "other" needs a note. */
export type CancelReason = "sellerOutOfStock" | "customerAsked" | "other";

export const cancelReasons: readonly CancelReason[] = [
  "sellerOutOfStock",
  "customerAsked",
  "other",
];

export type CancelRequest = { reason: CancelReason; note: string };

/** Whether the cancel dialog may be sent: a reason is chosen, and "other" says what it is. */
export function canCancel(reason: CancelReason | undefined, note: string): reason is CancelReason {
  if (!reason) return false;
  return reason !== "other" || note.trim().length > 0;
}

/** The 4th figure of an order's strip: how long it is still held, or how it ended. */
export type OrderClock =
  | { kind: "held"; minutesLeft: number }
  | { kind: "overdue" }
  | { kind: "closed"; status: Exclude<OrderStatus, "confirmed" | "ready"> };

export function orderClock(order: Pick<AdminOrder, "status" | "pickupEnd">, now: Date): OrderClock {
  if (!isOpen(order.status)) {
    return { kind: "closed", status: order.status as Exclude<OrderStatus, "confirmed" | "ready"> };
  }
  const left = Math.ceil((new Date(order.pickupEnd).getTime() - now.getTime()) / 60_000);
  return left > 0 ? { kind: "held", minutesLeft: left } : { kind: "overdue" };
}

// The table's search, filters, sort and pages. Done in the browser while the pilot has a few hundred orders a
// day, as the stores list does (docs: admin-web-flow › Style 6.1); they move to the API with SEC-15.

/** The status filter: one state, every order still held ("waiting", the middle card), or all. */
export type OrderStatusFilter = OrderStatus | "waiting" | "all";

/** The status filter from the address (`?status=expired`), which the cards over the table link to. */
export function orderStatusFilter(value: string | string[] | undefined): OrderStatusFilter {
  const one = Array.isArray(value) ? value[0] : value;
  return one === "waiting" || orderStatuses.includes(one as OrderStatus)
    ? (one as OrderStatusFilter)
    : "all";
}

/** The search from the address (`?q=`): an account's page links "Xem đơn hàng" here with the email. */
export function orderSearch(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** The list's address for a status filter and a search, leaving out what is not set. */
export function ordersHref(list: string, { status, q }: { status: OrderStatusFilter; q: string }) {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (q.trim() !== "") params.set("q", q);
  const query = params.toString();
  return query ? `${list}?${query}` : list;
}

/** The days a list is filtered to, both ends included; neither end keeps every day. */
export type DateRangeValue = { from?: Date; to?: Date };

export type OrderFilters = {
  search: string;
  sellerId: string;
  status: OrderStatusFilter;
  range: DateRangeValue;
};

function matchesStatus(status: OrderStatus, filter: OrderStatusFilter): boolean {
  if (filter === "all") return true;
  if (filter === "waiting") return isOpen(status);
  return status === filter;
}

const vietnamDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });

/** The day an instant falls on in Vietnam, "2026-10-20", for comparing with a picked day. */
export function dayInVietnam(at: Date | string): string {
  return vietnamDay.format(typeof at === "string" ? new Date(at) : at);
}

/** Whether an instant's Vietnam day is within the picked range (both ends included); no range keeps all. */
export function inRange(at: string, range: DateRangeValue): boolean {
  const day = dayInVietnam(at);
  if (range.from && day < dayInVietnam(range.from)) return false;
  const last = range.to ?? range.from;
  if (last && day > dayInVietnam(last)) return false;
  return true;
}

/** Folds case and Vietnamese marks, so "banh mi" finds "Bánh mì". */
export function folded(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export function filterOrders(rows: AdminOrderRow[], filters: OrderFilters): AdminOrderRow[] {
  const needle = folded(filters.search.trim().replace(/^#/, ""));
  return rows.filter(
    (row) =>
      matchesStatus(row.status, filters.status) &&
      (filters.sellerId === "all" || row.sellerId === filters.sellerId) &&
      inRange(row.pickupStart, filters.range) &&
      (needle === "" ||
        [row.code, row.customerName, row.customerEmail ?? "", row.sellerName].some((text) =>
          folded(text).includes(needle),
        )),
  );
}

export type OrderSortKey = "seller" | "total" | "pickup";
export type Sort<Key extends string> = { key: Key; direction: "asc" | "desc" };

/** The table's default: the latest pickup window first, as Figma marks "Khung nhận ↓". */
export const defaultOrderSort: Sort<OrderSortKey> = { key: "pickup", direction: "desc" };

export function sortOrders(rows: AdminOrderRow[], sort: Sort<OrderSortKey>): AdminOrderRow[] {
  const sign = sort.direction === "asc" ? 1 : -1;
  const compare = (a: AdminOrderRow, b: AdminOrderRow) => {
    if (sort.key === "seller") return a.sellerName.localeCompare(b.sellerName, "vi");
    if (sort.key === "total") return a.totalVnd - b.totalVnd;
    return a.pickupStart.localeCompare(b.pickupStart);
  };
  return rows.toSorted((a, b) => sign * compare(a, b));
}

/** Pressing a sortable heading: the same column flips, another starts descending. */
export function toggleSort<Key extends string>(sort: Sort<Key>, key: Key): Sort<Key> {
  if (sort.key !== key) return { key, direction: "desc" };
  return { key, direction: sort.direction === "desc" ? "asc" : "desc" };
}

/**
 * One page of rows: `page` counts from 1 and is kept within the `pages` there are; `from` and `to` number its
 * first and last row for "Hiển thị 1–10 trên 34".
 */
export function pageOf<Row>(
  rows: Row[],
  page: number,
  size: number,
): { rows: Row[]; page: number; pages: number; from: number; to: number } {
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(Math.max(1, page), pages);
  return {
    rows: rows.slice((current - 1) * size, current * size),
    page: current,
    pages,
    from: rows.length === 0 ? 0 : (current - 1) * size + 1,
    to: Math.min(rows.length, current * size),
  };
}

/**
 * A day filter's range in words (Figma Admin/DateRange 238:55307): "01/10 – 20/10/2026", or `any` ("Mọi lúc")
 * when none is chosen. Each end is written on its own, as Figma writes it, since Intl's own range drops the
 * two-digit month in Vietnamese; the start loses its year when both ends share one.
 */
export function dayRangeLabel(
  { from, to }: DateRangeValue,
  words: { day: (at: Date) => string; dayMonth: (at: Date) => string; any: string },
): string {
  if (from && to) {
    const start = from.getFullYear() === to.getFullYear() ? words.dayMonth(from) : words.day(from);
    return `${start} – ${words.day(to)}`;
  }
  return from ? words.day(from) : words.any;
}

/** How a state shows in the shared Badge: the variant of its tone and its icon, beside its words. */
export type BadgeLook = {
  variant: NonNullable<VariantProps<typeof badgeVariants>["variant"]>;
  icon: LucideIcon | null;
};

/** An order's state (Figma AD-DH1 › Trạng thái): "Sẵn sàng", "Hết hạn", each with its icon. */
export const orderStatusLooks: Record<OrderStatus, BadgeLook> = {
  confirmed: { variant: "outline", icon: ClockIcon },
  ready: { variant: "secondary", icon: InfoIcon },
  collected: { variant: "fresh", icon: CircleCheckIcon },
  expired: { variant: "outline", icon: TriangleAlertIcon },
  cancelled: { variant: "destructive", icon: CircleXIcon },
  rejected: { variant: "destructive", icon: CircleXIcon },
};

/** A step's dot in a history (Figma Admin/Timeline): done in green, one to come in grey, a failure in red. */
export const stepDots: Record<OrderStep["tone"], string> = {
  done: "bg-success",
  pending: "bg-muted-foreground",
  error: "bg-destructive",
};

/** The stores the rows come from, for the "Cửa hàng" filter, by name. */
export function sellersOf(rows: { sellerId: string; sellerName: string }[]) {
  const names = new Map(rows.map((row) => [row.sellerId, row.sellerName]));
  return [...names]
    .map(([id, name]) => ({ id, name }))
    .toSorted((a, b) => a.name.localeCompare(b.name, "vi"));
}
