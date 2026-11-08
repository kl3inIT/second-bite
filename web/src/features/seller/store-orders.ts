import type { OrderBody } from "@/lib/api/generated";
import { plainText } from "@/lib/plain-text";

/**
 * The tabs of a store's order list (Figma Q5, Q5h, Q5i, Q5e, Q5f): the orders being prepared, the ones the seller
 * has marked ready, what was handed over, and what ended without a hand-over. A customer cancelling, the seller
 * refusing and a window that ran out are one tab, each with its reason. The first two are the customer's steps
 * Preparing and Ready (SEC-102).
 */
export const orderTabs = ["preparing", "ready", "delivered", "cancelled"] as const;

export type OrderTab = (typeof orderTabs)[number];

export function tabOfOrder(order: OrderBody): OrderTab {
  switch (order.status) {
    case "confirmed":
      return "preparing";
    case "ready":
      return "ready";
    case "collected":
      return "delivered";
    default:
      return "cancelled";
  }
}

/** The orders of each tab, in the backend's order (the soonest window first). */
export function groupOrders(orders: readonly OrderBody[]): Record<OrderTab, OrderBody[]> {
  const groups: Record<OrderTab, OrderBody[]> = {
    preparing: [],
    ready: [],
    delivered: [],
    cancelled: [],
  };
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
