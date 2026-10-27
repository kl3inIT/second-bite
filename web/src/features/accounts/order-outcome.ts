import type { OrderBody } from "@/lib/api/generated";

/** How an order of an account ended, as admins read it: held, collected, not come for, cancelled, refused. */
export type OrderOutcome = "open" | "collected" | "missed" | "cancelled" | "refused";

/** The reasons staff end an order because its customer did not come; the server counts them as missed. */
const missedReasons: ReadonlyArray<OrderBody["refuseReason"]> = ["no_answer", "no_show", "late"];

export function outcomeOf(order: Pick<OrderBody, "status" | "refuseReason">): OrderOutcome {
  switch (order.status) {
    case "confirmed":
    case "ready":
      return "open";
    case "collected":
    case "cancelled":
      return order.status;
    case "expired":
      return "missed";
    case "refused":
      return missedReasons.includes(order.refuseReason) ? "missed" : "refused";
  }
}

/** The share of ended orders the customer came for, as a whole percent; none before any ended. */
export function pickupRate(collected: number, missed: number): number | undefined {
  const ended = collected + missed;
  return ended === 0 ? undefined : Math.round((collected / ended) * 100);
}

/** An order's lines as one line: "Croissant × 2, Bánh mì". */
export function linesOf(order: Pick<OrderBody, "lines">): string {
  return order.lines
    .map((line) => (line.units > 1 ? `${line.name} × ${line.units}` : line.name))
    .join(", ");
}
