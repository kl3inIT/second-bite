import { describe, expect, it } from "vitest";

import {
  closingFirst,
  inShowingOrder,
  isAvailable,
  openingFirst,
  type OfferSummary,
} from "./offer";

function offer(
  id: string,
  status: OfferSummary["status"],
  unitsLeft: number,
  window: { start: string; end: string } = { start: "21:00", end: "21:45" },
): OfferSummary {
  return {
    id,
    sellerId: "s1",
    status,
    name: id,
    description: "",
    kind: "bakery",
    unit: "túi",
    units: 5,
    unitsLeft,
    priceVnd: 20_000,
    originalPriceVnd: 40_000,
    discountPercent: 50,
    photo: { id, largePath: `/photos/${id}/1600.jpg`, smallPath: `/photos/${id}/400.jpg` },
    windowStart: `2026-10-18T${window.start}:00+07:00`,
    windowEnd: `2026-10-18T${window.end}:00+07:00`,
    collectionPoint: { latitude: 21.0565, longitude: 105.8964, address: "Tầng 1, Tasco Mall" },
    createdAt: "2026-10-18T18:00:00+07:00",
    updatedAt: "2026-10-18T18:00:00+07:00",
    seller: { id: "s1", name: "Tiệm bánh", address: "Tầng 1, Tasco Mall" },
  };
}

describe("the home's order", () => {
  it("puts what can be ordered first, then what has sold out", () => {
    const list = [
      offer("sold-out", "sold_out", 0),
      offer("closing-first", "on_sale", 3),
      offer("closing-later", "on_sale", 1),
    ];

    expect(inShowingOrder(list).map((o) => o.id)).toEqual([
      "closing-first",
      "closing-later",
      "sold-out",
    ]);
  });

  it("keeps the backend's order within each group", () => {
    const list = [offer("a", "on_sale", 2), offer("b", "on_sale", 2), offer("c", "on_sale", 2)];

    expect(inShowingOrder(list).map((o) => o.id)).toEqual(["a", "b", "c"]);
  });

  it("counts only an offer on sale with units left as available", () => {
    expect(isAvailable(offer("a", "on_sale", 1))).toBe(true);
    expect(isAvailable(offer("b", "on_sale", 0))).toBe(false);
    expect(isAvailable(offer("c", "sold_out", 0))).toBe(false);
  });
});

describe("the home's rows", () => {
  const list = [
    offer("late", "on_sale", 2, { start: "20:00", end: "22:00" }),
    offer("sold-out", "sold_out", 0, { start: "19:00", end: "20:00" }),
    offer("soon", "on_sale", 1, { start: "20:30", end: "21:00" }),
  ];

  it("puts the window that closes first at the top, leaving out what cannot be ordered", () => {
    expect(closingFirst(list).map((o) => o.id)).toEqual(["soon", "late"]);
  });

  it("puts the window that opens first at the top, leaving out what cannot be ordered", () => {
    expect(openingFirst(list).map((o) => o.id)).toEqual(["late", "soon"]);
  });
});
