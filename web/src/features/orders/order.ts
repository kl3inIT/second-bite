import type { OrderBody } from "@/lib/api/generated";

// An order as `GET /orders/{orderId}` answers it (SEC-15 › docs/specs/order.md): its lines, its window, its
// status and, to its customer once it may be shown, the four-digit collection code.

export type Order = OrderBody;

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

/** A span of time as whole hours and minutes, for "còn 1 giờ 12 phút"; never below zero. */
export function hoursAndMinutes(milliseconds: number): { hours: number; minutes: number } {
  const minutes = Math.max(Math.ceil(milliseconds / 60000), 0);
  return { hours: Math.floor(minutes / 60), minutes: minutes % 60 };
}

/** Where the order stands against its window at a moment: before it opens, while it is open, or after. */
export function windowPhase(
  order: Pick<Order, "windowStart" | "windowEnd">,
  now: number,
): "before" | "open" | "over" {
  if (now < Date.parse(order.windowStart)) return "before";
  return now < Date.parse(order.windowEnd) ? "open" : "over";
}

/** A link that opens the way to the collection point in Google Maps. */
export function directionsTo(seller: Pick<Order["seller"], "latitude" | "longitude">): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${seller.latitude},${seller.longitude}`;
}

/** Google Maps' embedded map of the collection point, its pin on the seller, in the page's language. */
export function mapOf(
  seller: Pick<Order["seller"], "latitude" | "longitude">,
  locale: string,
): string {
  const query = new URLSearchParams({
    q: `${seller.latitude},${seller.longitude}`,
    z: "17",
    hl: locale,
    output: "embed",
  });
  return `https://www.google.com/maps?${query}`;
}

/**
 * Orders placed together from one cart, one per seller (SEC-76 › decision 8), as one: each group in the order
 * its sellers' orders were placed, the groups newest first.
 */
export function byCheckout(orders: Order[]): Order[][] {
  const groups = new Map<string, Order[]>();
  for (const order of orders)
    groups.set(order.checkoutId, [...(groups.get(order.checkoutId) ?? []), order]);
  const placed = (order: Order) => Date.parse(order.createdAt);
  return [...groups.values()]
    .map((group) => group.toSorted((a, b) => placed(a) - placed(b)))
    .toSorted((a, b) => placed(b.at(-1)!) - placed(a.at(-1)!));
}

/** Where a list of ended orders puts one (Figma D4): today, the six days before, or earlier. */
export type Day = "today" | "week" | "before";

/** The calendar day of a moment in a time zone, as whole days since 1970, so two days subtract. */
function dayNumber(at: number, timeZone: string): number {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone }).format(at);
  return Date.parse(`${date}T00:00:00Z`) / 86_400_000;
}

/** The day an order falls on against now, counted in the app's time zone, not the server's. */
export function dayOf(at: string, now: number, timeZone: string): Day {
  const daysAgo = dayNumber(now, timeZone) - dayNumber(Date.parse(at), timeZone);
  if (daysAgo <= 0) return "today";
  return daysAgo < 7 ? "week" : "before";
}
