import type { OrderBody } from "@/lib/api/generated";

// An order as `GET /orders/{orderId}` answers it (SEC-15 › docs/specs/order.md): its lines, its window, its
// status and, to its customer once it may be shown, the four-digit collection code.

export type Order = OrderBody;

export type OrderStatus = Order["status"];

/** Whether the order is still to be collected: confirmed or ready, and its window not over. */
export function isOpen(order: Pick<Order, "status">): boolean {
  return order.status === "confirmed" || order.status === "ready";
}

/** Whether its customer may still cancel it, free of charge: open, and its window not yet opened. */
export function canCancel(order: Pick<Order, "status" | "windowStart">, now: number): boolean {
  return isOpen(order) && now < Date.parse(order.windowStart);
}

/** How many units the order holds, across its lines. */
export function unitsOf(order: Pick<Order, "lines">): number {
  return order.lines.reduce((sum, line) => sum + line.units, 0);
}

/** What the order would have cost at the original prices, less what it costs: the customer's saving. */
export function savingOf(order: Pick<Order, "lines" | "totalVnd">): number {
  const original = order.lines.reduce((sum, line) => sum + line.originalPriceVnd * line.units, 0);
  return Math.max(original - order.totalVnd, 0);
}

/** The units the order page lets a customer ask for: at least one, at most what is left. */
export function clampUnits(value: unknown, unitsLeft: number): number {
  const wanted = Number.parseInt(typeof value === "string" ? value : "", 10);
  if (!Number.isFinite(wanted) || wanted < 1) return 1;
  return Math.min(wanted, Math.max(unitsLeft, 1));
}
