import { describe, expect, it } from "vitest";

import type { OrderBody } from "@/lib/api/generated";

import {
  deliveredTotal,
  endedBecause,
  groupOrders,
  matchesQuery,
  readDay,
  readOrderTab,
  shiftDay,
  tabOfOrder,
  unitsOf,
  vietnamToday,
} from "./store-orders";

function order(overrides: Partial<OrderBody> = {}): OrderBody {
  return {
    id: "or-1",
    number: "SB-10001",
    status: "confirmed",
    checkoutId: "ch-1",
    codeAttemptsLeft: 3,
    createdAt: "2026-10-21T03:00:00Z",
    customerName: "Lê Thu Hà",
    customerPhone: "0905111222",
    lines: [
      {
        offerId: "of-1",
        name: "Cơm sườn nướng",
        unit: "suất",
        priceVnd: 30000,
        originalPriceVnd: 60000,
        units: 1,
        photo: {
          id: "ph-1",
          largePath: "/photos/ph-1/1600.jpg",
          smallPath: "/photos/ph-1/400.jpg",
        },
      },
    ],
    seller: { id: "se-1", name: "Quán", address: "Tasco Mall", latitude: 21, longitude: 105 },
    totalVnd: 30000,
    windowStart: "2026-10-21T12:00:00Z",
    windowEnd: "2026-10-21T14:00:00Z",
    ...overrides,
  };
}

describe("the order tabs", () => {
  it("falls back to the orders still held", () => {
    expect(readOrderTab(undefined)).toBe("holding");
    expect(readOrderTab("nonsense")).toBe("holding");
    expect(readOrderTab("cancelled")).toBe("cancelled");
  });

  it("puts every way an order can end without a hand-over in one tab", () => {
    expect(tabOfOrder(order({ status: "confirmed" }))).toBe("holding");
    expect(tabOfOrder(order({ status: "ready" }))).toBe("holding");
    expect(tabOfOrder(order({ status: "collected" }))).toBe("delivered");
    for (const status of ["cancelled", "refused", "expired"] as const) {
      expect(tabOfOrder(order({ status }))).toBe("cancelled");
    }
  });

  it("groups the orders and keeps their order", () => {
    const groups = groupOrders([
      order({ id: "a" }),
      order({ id: "b", status: "collected" }),
      order({ id: "c" }),
      order({ id: "d", status: "refused", refuseReason: "no_show" }),
    ]);
    expect(groups.holding.map((o) => o.id)).toEqual(["a", "c"]);
    expect(groups.delivered.map((o) => o.id)).toEqual(["b"]);
    expect(groups.cancelled.map((o) => o.id)).toEqual(["d"]);
  });
});

describe("why an order ended", () => {
  it("tells the customer's cancelling from the seller's reason and a window that ran out", () => {
    expect(endedBecause(order({ status: "cancelled" }))).toBe("customer");
    expect(endedBecause(order({ status: "refused", refuseReason: "no_answer" }))).toBe("no_answer");
    expect(endedBecause(order({ status: "expired" }))).toBe("expired");
    expect(endedBecause(order({ status: "confirmed" }))).toBeUndefined();
  });
});

describe("the totals", () => {
  it("sums what was handed over and the units of an order", () => {
    expect(deliveredTotal([order({ totalVnd: 30000 }), order({ totalVnd: 114000 })])).toBe(144000);
    expect(deliveredTotal([])).toBe(0);
    expect(unitsOf(order())).toBe(1);
  });
});

describe("the search", () => {
  const found = order();

  it("finds by name, without accents or case", () => {
    expect(matchesQuery(found, "thu ha")).toBe(true);
    expect(matchesQuery(found, "LÊ")).toBe(true);
    expect(matchesQuery(found, "minh")).toBe(false);
  });

  it("finds by a part of the phone number, written with or without spaces", () => {
    expect(matchesQuery(found, "0905")).toBe(true);
    expect(matchesQuery(found, "0905 111")).toBe(true);
    expect(matchesQuery(found, "111222")).toBe(true);
    expect(matchesQuery(found, "0912")).toBe(false);
  });

  it("finds by dish, and everything when the search is empty", () => {
    expect(matchesQuery(found, "com suon")).toBe(true);
    expect(matchesQuery(found, "xoi")).toBe(false);
    expect(matchesQuery(found, "   ")).toBe(true);
  });
});

describe("the day", () => {
  it("reads Vietnam's day, which comes before UTC's at night", () => {
    expect(vietnamToday(new Date("2026-10-21T20:00:00Z"))).toBe("2026-10-22");
    expect(vietnamToday(new Date("2026-10-21T03:00:00Z"))).toBe("2026-10-21");
  });

  it("keeps a real day of the address and falls back to today for anything else", () => {
    expect(readDay("2026-10-19", "2026-10-21")).toBe("2026-10-19");
    expect(readDay("2026-02-30", "2026-10-21")).toBe("2026-10-21");
    expect(readDay("hôm qua", "2026-10-21")).toBe("2026-10-21");
    expect(readDay(undefined, "2026-10-21")).toBe("2026-10-21");
  });

  it("moves across months and years", () => {
    expect(shiftDay("2026-10-21", -1)).toBe("2026-10-20");
    expect(shiftDay("2026-10-31", 1)).toBe("2026-11-01");
    expect(shiftDay("2026-01-01", -1)).toBe("2025-12-31");
  });
});
