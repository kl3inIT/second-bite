import { describe, expect, it } from "vitest";

import {
  biggestDiscountFirst,
  closingFirst,
  directionsHref,
  groupBySeller,
  inShowingOrder,
  isAvailable,
  kindsByCount,
  type OfferSummary,
} from "./offer";

function offer(
  id: string,
  status: OfferSummary["status"],
  unitsLeft: number,
  window: { start: string; end: string } = { start: "21:00", end: "21:45" },
  discountPercent = 50,
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
    discountPercent,
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

  it("puts the biggest discount at the top, leaving out what cannot be ordered", () => {
    const discounts = [
      offer("half", "on_sale", 1, undefined, 50),
      offer("sold-out", "sold_out", 0, undefined, 80),
      offer("most", "on_sale", 2, undefined, 63),
    ];

    expect(biggestDiscountFirst(discounts).map((o) => o.id)).toEqual(["most", "half"]);
  });
});

describe("the search's sellers", () => {
  it("groups the offers by seller, in the order each seller first appears", () => {
    const fromSeller = (id: string, sellerId: string): OfferSummary => ({
      ...offer(id, "on_sale", 1),
      sellerId,
      seller: { id: sellerId, name: sellerId, address: "" },
    });
    const list = [fromSeller("a", "s2"), fromSeller("b", "s1"), fromSeller("c", "s2")];

    expect(
      groupBySeller(list).map((group) => [group.seller.id, group.offers.map((o) => o.id)]),
    ).toEqual([
      ["s2", ["a", "c"]],
      ["s1", ["b"]],
    ]);
  });
});

describe("the search's popular kinds", () => {
  it("counts what can still be ordered by kind, the most offers first", () => {
    const ofKind = (id: string, kind: OfferSummary["kind"], unitsLeft = 1): OfferSummary => ({
      ...offer(id, "on_sale", unitsLeft),
      kind,
    });
    const list = [
      ofKind("a", "bakery"),
      ofKind("b", "drinks"),
      ofKind("c", "drinks"),
      ofKind("d", "bakery", 0),
      ofKind("e", "other", 0),
    ];

    expect(kindsByCount(list)).toEqual([
      { kind: "drinks", count: 2 },
      { kind: "bakery", count: 1 },
    ]);
  });
});

describe("directions", () => {
  it("open the maps at the collection point", () => {
    expect(directionsHref({ latitude: 21.0565, longitude: 105.8964, address: "Tầng 1" })).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=21.0565,105.8964",
    );
  });
});
