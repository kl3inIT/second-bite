import { describe, expect, it } from "vitest";

import type { OfferSummary } from "@/features/offers/offer";

import {
  addOne,
  collectionWindow,
  keepLeft,
  quantityOf,
  readCart,
  removeOne,
  totals,
  withBasket,
  type Basket,
  type Cart,
} from "./cart";

function offer(
  id: string,
  {
    sellerId = "s1",
    unitsLeft = 3,
    window = { start: "21:00", end: "21:45" },
  }: { sellerId?: string; unitsLeft?: number; window?: { start: string; end: string } } = {},
): OfferSummary {
  return {
    id,
    sellerId,
    status: unitsLeft > 0 ? "on_sale" : "sold_out",
    name: id,
    description: "",
    kind: "bakery",
    unit: "chiếc",
    units: 5,
    unitsLeft,
    priceVnd: 20_000,
    originalPriceVnd: 50_000,
    discountPercent: 60,
    photo: { id, largePath: `/photos/${id}/1600.jpg`, smallPath: `/photos/${id}/400.jpg` },
    windowStart: `2026-10-20T${window.start}:00+07:00`,
    windowEnd: `2026-10-20T${window.end}:00+07:00`,
    collectionPoint: { latitude: 21.0565, longitude: 105.8964, address: "Tầng 1" },
    createdAt: "2026-10-20T18:00:00+07:00",
    updatedAt: "2026-10-20T18:00:00+07:00",
    seller: { id: sellerId, name: `Quán ${sellerId}`, address: "Tầng 1" },
  };
}

function cartOf(...steps: OfferSummary[]): Cart | null {
  let cart: Cart | null = null;
  for (const step of steps) cart = addOne(cart, step);
  return cart;
}

function basketOf(...steps: OfferSummary[]): Basket {
  return cartOf(...steps)!.baskets[0];
}

describe("the cart", () => {
  it("starts with one portion of the first dish", () => {
    const cart = cartOf(offer("croissant"));

    expect(cart?.baskets.map(({ seller }) => seller.id)).toEqual(["s1"]);
    expect(quantityOf(cart, "croissant")).toBe(1);
  });

  it("never holds more of a dish than its portions left", () => {
    const croissant = offer("croissant", { unitsLeft: 2 });

    expect(quantityOf(cartOf(croissant, croissant, croissant), "croissant")).toBe(2);
  });

  it("keeps each seller's dishes in their own basket, in the order they were added", () => {
    const cart = cartOf(offer("croissant"), offer("ha-cao", { sellerId: "s2" }), offer("eclair"))!;

    expect(cart.baskets.map(({ seller, lines }) => [seller.id, lines.map(({ id }) => id)])).toEqual(
      [
        ["s1", ["croissant", "eclair"]],
        ["s2", ["ha-cao"]],
      ],
    );
    expect(withBasket(cart, "s1", null)?.baskets.map(({ seller }) => seller.id)).toEqual(["s2"]);
    expect(withBasket(withBasket(cart, "s1", null)!, "s2", null)).toBeNull();
  });

  it("lets a dish go at none and is gone with its last dish", () => {
    const cart = cartOf(offer("croissant"), offer("croissant"), offer("eclair"))!;

    expect(quantityOf(removeOne(cart, "croissant"), "croissant")).toBe(1);
    expect(removeOne(removeOne(cart, "eclair")!, "croissant")?.baskets[0].lines).toHaveLength(1);
    expect(removeOne(cartOf(offer("eclair"))!, "eclair")).toBeNull();
  });

  it("adds up the portions, tonight's price and the price without the discount", () => {
    const cart = cartOf(
      offer("croissant"),
      offer("croissant"),
      offer("eclair", { sellerId: "s2" }),
    )!;

    expect(totals(cart)).toEqual({ units: 3, priceVnd: 60_000, originalPriceVnd: 150_000 });
  });

  it("collects when every dish's window is open, or at the earliest when they share no time", () => {
    const shared = basketOf(
      offer("croissant", { window: { start: "20:30", end: "21:30" } }),
      offer("eclair", { window: { start: "21:00", end: "21:45" } }),
    )!;
    const apart = basketOf(
      offer("croissant", { window: { start: "22:00", end: "22:30" } }),
      offer("eclair", { window: { start: "20:00", end: "20:30" } }),
    )!;

    expect(collectionWindow(shared)).toEqual({
      windowStart: "2026-10-20T14:00:00.000Z",
      windowEnd: "2026-10-20T14:30:00.000Z",
    });
    expect(collectionWindow(apart).windowStart).toBe("2026-10-20T20:00:00+07:00");
  });

  it("reads back only what is a cart, and a cart saved with one seller as that seller's basket", () => {
    const cart = cartOf(offer("croissant"))!;

    expect(readCart(cart)).toEqual(cart);
    expect(readCart(cart.baskets[0])).toEqual(cart);
    expect(readCart({ seller: { id: "s1" }, lines: [] })).toBeNull();
    expect(readCart({ baskets: [] })).toBeNull();
    expect(readCart("[]")).toBeNull();
  });
});

describe("what is left after someone else ordered first", () => {
  it("cuts each dish to its portions left and names the dishes it cut", () => {
    const basket = basketOf(offer("croissant"), offer("croissant"), offer("eclair"), offer("tart"));

    const { basket: kept, cut } = keepLeft(basket, { croissant: 1, eclair: 0, tart: 3 });

    expect(cut.map(({ id, left }) => [id, left])).toEqual([
      ["croissant", 1],
      ["eclair", 0],
    ]);
    expect(kept?.lines.map(({ id, quantity }) => [id, quantity])).toEqual([
      ["croissant", 1],
      ["tart", 1],
    ]);
  });

  it("leaves nothing when every dish is gone", () => {
    expect(keepLeft(basketOf(offer("croissant")), {}).basket).toBeNull();
  });
});
