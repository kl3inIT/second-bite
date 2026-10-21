import { describe, expect, it } from "vitest";

import type { OfferBody, OrderBody } from "@/lib/api/generated";

import { summarizeDay } from "./store-summary";

const order = (
  status: OrderBody["status"],
  totalVnd: number,
  refuseReason?: OrderBody["refuseReason"],
) => ({ status, totalVnd, refuseReason }) as OrderBody;

const offer = (status: OfferBody["status"], units: number, unitsLeft: number) =>
  ({ status, units, unitsLeft }) as OfferBody;

describe("a store's day in numbers", () => {
  it("counts the orders still held, the cash taken and the cash still to take", () => {
    const day = summarizeDay(
      [
        order("confirmed", 30000),
        order("confirmed", 114000),
        order("ready", 57000),
        order("collected", 30000),
        order("collected", 114000),
        order("cancelled", 30000),
      ],
      [],
    );
    expect(day.held).toBe(3);
    expect(day.ready).toBe(1);
    expect(day.collectedVnd).toBe(144000);
    expect(day.heldVnd).toBe(201000);
    expect(day.orders).toBe(6);
  });

  it("counts as missed only the customers who did not come, not a customer's own cancelling", () => {
    const day = summarizeDay(
      [
        order("refused", 30000, "no_show"),
        order("refused", 30000, "no_answer"),
        order("refused", 30000, "late"),
        order("refused", 30000, "sold_out"),
        order("expired", 30000),
        order("cancelled", 30000),
      ],
      [],
    );
    expect(day.missed).toBe(4);
  });

  it("sums the units of the day's posts, leaving out withdrawn ones, and what is still on sale", () => {
    const day = summarizeDay(
      [],
      [
        offer("on_sale", 8, 3),
        offer("sold_out", 4, 0),
        offer("closed", 3, 3),
        offer("withdrawn", 5, 5),
      ],
    );
    expect(day.unitsSold).toBe(9);
    expect(day.unitsPosted).toBe(15);
    expect(day.unitsLeft).toBe(3);
  });
});
