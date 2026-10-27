import { describe, expect, it } from "vitest";

import {
  byCheckout,
  canCancel,
  clampUnits,
  dayOf,
  isOpen,
  savingOf,
  unitsOf,
  type Order,
} from "./order";

function line(units: number, priceVnd: number, originalPriceVnd: number): Order["lines"][number] {
  const photo = { id: "ph", largePath: "", smallPath: "" };
  return { offerId: "of", name: "", unit: "", photo, units, priceVnd, originalPriceVnd };
}

const lines = [line(2, 20000, 50000), line(1, 30000, 75000)];

describe("an order", () => {
  it("is open while confirmed or ready", () => {
    expect(isOpen({ status: "confirmed" })).toBe(true);
    expect(isOpen({ status: "ready" })).toBe(true);
    for (const status of ["collected", "cancelled", "refused", "expired"] as const) {
      expect(isOpen({ status })).toBe(false);
    }
  });

  it("can be cancelled until the seller marks it ready", () => {
    expect(canCancel({ status: "confirmed" })).toBe(true);
    expect(canCancel({ status: "ready" })).toBe(false);
    expect(canCancel({ status: "cancelled" })).toBe(false);
  });

  it("counts its units and what the customer saves", () => {
    expect(unitsOf({ lines })).toBe(3);
    expect(savingOf({ lines, totalVnd: 70000 })).toBe(105000);
  });
});

describe("the units asked for", () => {
  it("are at least one and at most what is left", () => {
    expect(clampUnits("2", 5)).toBe(2);
    expect(clampUnits("9", 3)).toBe(3);
    expect(clampUnits("0", 3)).toBe(1);
    expect(clampUnits("abc", 3)).toBe(1);
    expect(clampUnits(undefined, 3)).toBe(1);
  });
});

describe("orders placed together", () => {
  const placed = (
    id: string,
    checkoutId: string,
    minute: number,
    status: Order["status"] = "confirmed",
  ) =>
    ({
      id,
      checkoutId,
      status,
      createdAt: `2026-10-20T20:${String(minute).padStart(2, "0")}:00+07:00`,
    }) as Order;

  it("are one group in the order their sellers were placed, and groups come newest first", () => {
    const groups = byCheckout([
      placed("nethue", "cart-2", 31),
      placed("alone", "cart-1", 10, "collected"),
      placed("laparis", "cart-2", 30, "collected"),
    ]);

    expect(groups.map((group) => group.map(({ id }) => id))).toEqual([
      ["laparis", "nethue"],
      ["alone"],
    ]);
  });
});

describe("the day of an ended order", () => {
  const timeZone = "Asia/Ho_Chi_Minh";
  const now = Date.parse("2026-10-20T22:30:00+07:00");

  it("is counted in the app's time zone", () => {
    // 00:30 in Hà Nội is still the evening before in UTC.
    expect(dayOf("2026-10-20T00:30:00+07:00", now, timeZone)).toBe("today");
    expect(dayOf("2026-10-19T23:30:00+07:00", now, timeZone)).toBe("week");
  });

  it("falls in the week for six days, and before after that", () => {
    expect(dayOf("2026-10-14T20:00:00+07:00", now, timeZone)).toBe("week");
    expect(dayOf("2026-10-13T20:00:00+07:00", now, timeZone)).toBe("before");
  });
});
