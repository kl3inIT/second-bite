import { describe, expect, it } from "vitest";

import type { OfferSummary } from "@/features/offers/offer";

import {
  addOne,
  collectionWindow,
  isCart,
  keepLeft,
  quantityOf,
  removeOne,
  startWith,
  totals,
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
  for (const step of steps) cart = addOne(cart, step).cart ?? cart;
  return cart;
}

describe("the cart", () => {
  it("starts with one portion of the first dish", () => {
    const cart = cartOf(offer("croissant"));

    expect(cart?.seller.id).toBe("s1");
    expect(quantityOf(cart, "croissant")).toBe(1);
  });

  it("never holds more of a dish than its portions left", () => {
    const croissant = offer("croissant", { unitsLeft: 2 });

    expect(quantityOf(cartOf(croissant, croissant, croissant), "croissant")).toBe(2);
  });

  it("holds one seller's dishes only, and names the cart in the way", () => {
    const cart = cartOf(offer("croissant"));
    const other = addOne(cart, offer("ha-cao", { sellerId: "s2" }));

    expect(other.cart).toBeUndefined();
    expect(other.conflict).toBe(cart);
    expect(startWith(offer("ha-cao", { sellerId: "s2" })).lines.map(({ id }) => id)).toEqual([
      "ha-cao",
    ]);
  });

  it("lets a dish go at none and is gone with its last dish", () => {
    const cart = cartOf(offer("croissant"), offer("croissant"), offer("eclair"))!;

    expect(quantityOf(removeOne(cart, "croissant"), "croissant")).toBe(1);
    expect(removeOne(removeOne(cart, "eclair")!, "croissant")?.lines).toHaveLength(1);
    expect(removeOne(cartOf(offer("eclair"))!, "eclair")).toBeNull();
  });

  it("adds up the portions, tonight's price and the price without the discount", () => {
    const cart = cartOf(offer("croissant"), offer("croissant"), offer("eclair"))!;

    expect(totals(cart)).toEqual({ units: 3, priceVnd: 60_000, originalPriceVnd: 150_000 });
  });

  it("collects when every dish's window is open, or at the earliest when they share no time", () => {
    const shared = cartOf(
      offer("croissant", { window: { start: "20:30", end: "21:30" } }),
      offer("eclair", { window: { start: "21:00", end: "21:45" } }),
    )!;
    const apart = cartOf(
      offer("croissant", { window: { start: "22:00", end: "22:30" } }),
      offer("eclair", { window: { start: "20:00", end: "20:30" } }),
    )!;

    expect(collectionWindow(shared)).toEqual({
      windowStart: "2026-10-20T14:00:00.000Z",
      windowEnd: "2026-10-20T14:30:00.000Z",
    });
    expect(collectionWindow(apart).windowStart).toBe("2026-10-20T20:00:00+07:00");
  });

  it("reads back only what is a cart", () => {
    expect(isCart(cartOf(offer("croissant")))).toBe(true);
    expect(isCart({ seller: { id: "s1" }, lines: [] })).toBe(false);
    expect(isCart("[]")).toBe(false);
  });
});

describe("what is left after someone else ordered first", () => {
  it("cuts each dish to its portions left and names the dishes it cut", () => {
    const cart = cartOf(offer("croissant"), offer("croissant"), offer("eclair"))!;

    const { cart: kept, cut } = keepLeft(cart, { croissant: 2, eclair: 0 });

    expect(cut.map(({ id }) => id)).toEqual(["eclair"]);
    expect(kept?.lines.map(({ id, quantity }) => [id, quantity])).toEqual([["croissant", 2]]);
  });

  it("leaves nothing when every dish is gone", () => {
    const cart = cartOf(offer("croissant"))!;

    expect(keepLeft(cart, {}).cart).toBeNull();
  });
});
