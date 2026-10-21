import type { OrderBody } from "@/lib/api/generated";
import { plainText } from "@/lib/plain-text";

/**
 * The tabs of a store's order list (Figma Q5, Q5e, Q5f): what customers hold and the seller still has to hand
 * over, what was handed over, and what ended without a hand-over. A customer cancelling, the seller refusing
 * and a window that ran out are one tab, each with its reason.
 */
export const orderTabs = ["holding", "delivered", "cancelled"] as const;

export type OrderTab = (typeof orderTabs)[number];

export function readOrderTab(value: string | undefined): OrderTab {
  return orderTabs.find((tab) => tab === value) ?? "holding";
}

export function tabOfOrder(order: OrderBody): OrderTab {
  switch (order.status) {
    case "confirmed":
    case "ready":
      return "holding";
    case "collected":
      return "delivered";
    default:
      return "cancelled";
  }
}

/** The orders of each tab, in the backend's order (the soonest window first). */
export function groupOrders(orders: readonly OrderBody[]): Record<OrderTab, OrderBody[]> {
  const groups: Record<OrderTab, OrderBody[]> = { holding: [], delivered: [], cancelled: [] };
  for (const order of orders) groups[tabOfOrder(order)].push(order);
  return groups;
}

/** The reasons the seller may give for "Hủy đơn" (Figma Q5c), in the order the dialog shows them. */
export const cancelReasons = ["no_answer", "no_show", "late", "sold_out", "other"] as const;

export type CancelReason = (typeof cancelReasons)[number];

/** Why an order of the cancelled tab ended: the customer's own cancelling, the seller's reason, or a window that ran out. */
export function endedBecause(
  order: OrderBody,
): "customer" | "expired" | NonNullable<OrderBody["refuseReason"]> | undefined {
  switch (order.status) {
    case "cancelled":
      return "customer";
    case "refused":
      return order.refuseReason ?? "other";
    case "expired":
      return "expired";
    default:
      return undefined;
  }
}

/** What the seller collected in cash: the total of the orders handed over. */
export function deliveredTotal(orders: readonly OrderBody[]): number {
  return orders.reduce((sum, order) => sum + order.totalVnd, 0);
}

/** The units held: the orders still to hand over, summed over their lines. */
export function unitsOf(order: OrderBody): number {
  return order.lines.reduce((sum, line) => sum + line.units, 0);
}

/** Whether an order answers a search: by the customer's name, a part of their phone number, or a dish. */
export function matchesQuery(order: OrderBody, query: string): boolean {
  const wanted = plainText(query.trim());
  if (!wanted) return true;
  const digits = wanted.replace(/\D/g, "");
  if (digits.length >= 3 && order.customerPhone.includes(digits)) return true;
  return [order.customerName, ...order.lines.map((line) => line.name)].some((text) =>
    plainText(text).includes(wanted),
  );
}

const vietnamDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });

/** Today in Vietnam's time as `2026-10-21`, the day the order list opens on. */
export function vietnamToday(now: Date = new Date()): string {
  return vietnamDay.format(now);
}

const dayPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

/** The day in the address when it is a real one, today otherwise. */
export function readDay(value: string | undefined, today: string = vietnamToday()): string {
  const match = dayPattern.exec(value ?? "");
  if (!match) return today;
  const [, year, month, date] = match.map(Number);
  const moment = new Date(Date.UTC(year, month - 1, date));
  const real =
    moment.getUTCFullYear() === year &&
    moment.getUTCMonth() === month - 1 &&
    moment.getUTCDate() === date;
  return real ? (value as string) : today;
}

/** The day `by` days after (or before) another, as `YYYY-MM-DD`. */
export function shiftDay(day: string, by: number): string {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, date + by)).toISOString().slice(0, 10);
}
