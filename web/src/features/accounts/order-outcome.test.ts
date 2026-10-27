import { describe, expect, it } from "vitest";

import { linesOf, outcomeOf, pickupRate } from "./order-outcome";

describe("an account's orders, as admins read them", () => {
  it("count a no-show or a lapsed window as missed, a refusal for the food as refused", () => {
    expect(outcomeOf({ status: "ready" })).toBe("open");
    expect(outcomeOf({ status: "expired" })).toBe("missed");
    expect(outcomeOf({ status: "refused", refuseReason: "no_show" })).toBe("missed");
    expect(outcomeOf({ status: "refused", refuseReason: "sold_out" })).toBe("refused");
    expect(outcomeOf({ status: "cancelled" })).toBe("cancelled");
  });

  it("rate the pickups among ended orders only", () => {
    expect(pickupRate(0, 0)).toBeUndefined();
    expect(pickupRate(5, 1)).toBe(83);
  });

  it("join the lines with their units", () => {
    const line = (name: string, units: number) => ({ name, units }) as never;
    expect(linesOf({ lines: [line("Croissant", 2), line("Bánh mì", 1)] })).toBe(
      "Croissant × 2, Bánh mì",
    );
  });
});
