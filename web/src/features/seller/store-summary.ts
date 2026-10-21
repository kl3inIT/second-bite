import type { OfferBody, OrderBody } from "@/lib/api/generated";

import { groupOrders } from "./store-orders";

/** The reasons a seller gives when the customer did not come for an order (Figma Q5c). */
const missedReasons = new Set<OrderBody["refuseReason"]>(["no_show", "no_answer", "late"]);

/** A day of a store in numbers, for the home's overview (Figma Q1b): orders, cash, units and customers who did not come. */
export type DaySummary = {
  /** Orders still to hand over, and how many of them are marked ready. */
  held: number;
  ready: number;
  /** Cash taken at the counter for the orders handed over, and what the held ones will bring. */
  collectedVnd: number;
  heldVnd: number;
  /** Units ordered from the day's posts, the units posted, and those still on sale. */
  unitsSold: number;
  unitsPosted: number;
  unitsLeft: number;
  /** Orders whose customer did not come (refused as not come, not answering or late, or expired), of all the day's orders. */
  missed: number;
  orders: number;
};

/** Sums a day: its orders (from GET /sellers/{id}/orders?day=) and its posts (those whose window opens that day). */
export function summarizeDay(
  orders: readonly OrderBody[],
  offers: readonly OfferBody[],
): DaySummary {
  const groups = groupOrders(orders);
  const held = [...groups.preparing, ...groups.ready];
  const total = (list: readonly OrderBody[]) =>
    list.reduce((sum, order) => sum + order.totalVnd, 0);
  const posted = offers.filter((offer) => offer.status !== "withdrawn");

  return {
    held: held.length,
    ready: groups.ready.length,
    collectedVnd: total(groups.delivered),
    heldVnd: total(held),
    unitsSold: posted.reduce((sum, offer) => sum + offer.units - offer.unitsLeft, 0),
    unitsPosted: posted.reduce((sum, offer) => sum + offer.units, 0),
    unitsLeft: posted
      .filter((offer) => offer.status === "on_sale")
      .reduce((sum, offer) => sum + offer.unitsLeft, 0),
    missed: orders.filter(
      (order) =>
        order.status === "expired" ||
        (order.status === "refused" && missedReasons.has(order.refuseReason)),
    ).length,
    orders: orders.length,
  };
}
