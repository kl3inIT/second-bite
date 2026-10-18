import { describe, expect, it } from "vitest";

import { inShowingOrder, type OfferSummary } from "./offer";

function offer(id: string, state: OfferSummary["state"], units: number): OfferSummary {
  return {
    id,
    state,
    name: id,
    kind: "bakery",
    price: 20_000,
    originalPrice: 40_000,
    units,
    unit: "túi",
    collectFrom: "2026-10-18T21:00:00+07:00",
    collectUntil: "2026-10-18T21:45:00+07:00",
    photo: `/photos/${id}/400.jpg`,
    seller: { id: "s1", name: "Tiệm bánh", place: "Tầng 1" },
  };
}

describe("the home's order", () => {
  it("puts what can be ordered first, then what is expected, then what has sold out", () => {
    const list = [
      offer("sold-out", "on_sale", 0),
      offer("expected", "announced", 5),
      offer("closing-first", "on_sale", 3),
      offer("closing-later", "on_sale", 1),
    ];

    expect(inShowingOrder(list).map((o) => o.id)).toEqual([
      "closing-first",
      "closing-later",
      "expected",
      "sold-out",
    ]);
  });

  it("keeps the backend's order, soonest window first, within each group", () => {
    const list = [offer("a", "on_sale", 2), offer("b", "on_sale", 2), offer("c", "on_sale", 2)];

    expect(inShowingOrder(list).map((o) => o.id)).toEqual(["a", "b", "c"]);
  });
});
