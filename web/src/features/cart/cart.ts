import { z } from "zod";

import type { OfferSummary } from "@/features/offers/offer";

// The cart until orders exist (SEC-49 decision 7): dishes of any sellers, each never more than its portions
// left, kept as the cards showed them so the confirmation (Figma K5) needs no request of its own. Each seller's
// dishes are a basket, ordered on its own since an order holds one seller's dishes (SEC-15).

export type CartLine = Pick<
  OfferSummary,
  "id" | "name" | "priceVnd" | "originalPriceVnd" | "unitsLeft" | "windowStart" | "windowEnd"
> & {
  quantity: number;
  /** The dish's photograph on the confirmation; a cart saved before it was kept has none. */
  photo?: OfferSummary["photo"];
};

/** One seller's dishes in the cart: one order. */
export type Basket = {
  seller: Pick<OfferSummary["seller"], "id" | "name" | "address" | "photo">;
  collectionPoint: OfferSummary["collectionPoint"];
  distanceMeters?: number;
  lines: CartLine[];
};

/** The baskets, in the order their sellers were first added; never empty. */
export type Cart = { baskets: Basket[] };

/** One more portion of the dish, in its seller's basket, never more than its portions left. */
export function addOne(cart: Cart | null, offer: OfferSummary): Cart {
  return addPortions(cart, offer, 1);
}

/** Some more portions of the dish, as the dish's sheet adds them (Figma K4a), never more than its portions left. */
export function addPortions(cart: Cart | null, offer: OfferSummary, count: number): Cart {
  const baskets = cart?.baskets ?? [];
  const basket = baskets.find(({ seller }) => seller.id === offer.sellerId);
  if (!basket) return { baskets: [...baskets, basketOf(offer, count)] };
  const line = basket.lines.find(({ id }) => id === offer.id);
  const updated = {
    ...lineOf(offer),
    quantity: Math.min((line?.quantity ?? 0) + count, offer.unitsLeft),
  };
  const lines = line
    ? basket.lines.map((each) => (each.id === offer.id ? updated : each))
    : [...basket.lines, updated];
  // The seller's details come from the dish just added, so a basket kept from earlier shows them as they are now.
  const { seller, collectionPoint, distanceMeters } = basketOf(offer, count);
  return {
    baskets: baskets.map((each) =>
      each === basket ? { ...basket, seller, collectionPoint, distanceMeters, lines } : each,
    ),
  };
}

/** One more portion of a dish already in the cart, as the confirmation adds it (Figma K5), never more than left. */
export function oneMore(cart: Cart, offerId: string): Cart {
  return {
    baskets: cart.baskets.map((basket) => ({
      ...basket,
      lines: basket.lines.map((line) =>
        line.id === offerId
          ? { ...line, quantity: Math.min(line.quantity + 1, line.unitsLeft) }
          : line,
      ),
    })),
  };
}

/** One portion fewer; the dish leaves at none, its basket with its last dish, the cart with its last basket. */
export function removeOne(cart: Cart, offerId: string): Cart | null {
  const baskets = cart.baskets
    .map((basket) => ({
      ...basket,
      lines: basket.lines
        .map((line) => (line.id === offerId ? { ...line, quantity: line.quantity - 1 } : line))
        .filter((line) => line.quantity > 0),
    }))
    .filter(({ lines }) => lines.length > 0);
  return baskets.length > 0 ? { baskets } : null;
}

/** The cart with a seller's basket put in place of theirs, or taken out when null. */
export function withBasket(cart: Cart, sellerId: string, basket: Basket | null): Cart | null {
  const baskets = cart.baskets.flatMap((each) =>
    each.seller.id !== sellerId ? [each] : basket ? [basket] : [],
  );
  return baskets.length > 0 ? { baskets } : null;
}

export function quantityOf(cart: Cart | null, offerId: string): number {
  for (const basket of cart?.baskets ?? []) {
    const line = basket.lines.find(({ id }) => id === offerId);
    if (line) return line.quantity;
  }
  return 0;
}

/** The portions, what they cost tonight and what they would have cost: the bars of K4b and K5. */
export function totals(of: Cart | Basket): {
  units: number;
  priceVnd: number;
  originalPriceVnd: number;
} {
  const lines = "baskets" in of ? of.baskets.flatMap((basket) => basket.lines) : of.lines;
  return lines.reduce(
    (sum, line) => ({
      units: sum.units + line.quantity,
      priceVnd: sum.priceVnd + line.quantity * line.priceVnd,
      originalPriceVnd: sum.originalPriceVnd + line.quantity * line.originalPriceVnd,
    }),
    { units: 0, priceVnd: 0, originalPriceVnd: 0 },
  );
}

/** When every dish in the basket can be collected, or the earliest window when they share no time. */
export function collectionWindow(basket: Basket): { windowStart: string; windowEnd: string } {
  const starts = basket.lines.map(({ windowStart }) => Date.parse(windowStart));
  const ends = basket.lines.map(({ windowEnd }) => Date.parse(windowEnd));
  const start = Math.max(...starts);
  const end = Math.min(...ends);
  if (start < end) {
    return { windowStart: new Date(start).toISOString(), windowEnd: new Date(end).toISOString() };
  }
  const earliest = basket.lines.reduce((a, b) =>
    Date.parse(b.windowStart) < Date.parse(a.windowStart) ? b : a,
  );
  return { windowStart: earliest.windowStart, windowEnd: earliest.windowEnd };
}

const photo = z.object({ id: z.string(), largePath: z.string(), smallPath: z.string() });

const storedBasket = z.object({
  seller: z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    photo: photo.optional(),
  }),
  collectionPoint: z.object({ address: z.string(), latitude: z.number(), longitude: z.number() }),
  distanceMeters: z.number().optional(),
  lines: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        priceVnd: z.number(),
        originalPriceVnd: z.number(),
        unitsLeft: z.number(),
        windowStart: z.string(),
        windowEnd: z.string(),
        quantity: z.int().positive(),
        photo: photo.optional(),
      }),
    )
    .min(1),
}) satisfies z.ZodType<Basket>;

/**
 * The cart as kept in storage, read back through this since anything may have written there. A cart saved while
 * it held one seller is that seller's basket.
 */
export const storedCart = z.union([
  z.object({ baskets: z.array(storedBasket).min(1) }),
  storedBasket.transform((basket) => ({ baskets: [basket] })),
]) satisfies z.ZodType<Cart>;

function basketOf(offer: OfferSummary, count: number): Basket {
  return {
    seller: {
      id: offer.seller.id,
      name: offer.seller.name,
      address: offer.seller.address,
      photo: offer.seller.photo,
    },
    collectionPoint: offer.collectionPoint,
    distanceMeters: offer.distanceMeters,
    lines: [{ ...lineOf(offer), quantity: Math.min(count, offer.unitsLeft) }],
  };
}

function lineOf(offer: OfferSummary): Omit<CartLine, "quantity"> {
  const { id, name, priceVnd, originalPriceVnd, unitsLeft, windowStart, windowEnd, photo } = offer;
  return { id, name, priceVnd, originalPriceVnd, unitsLeft, windowStart, windowEnd, photo };
}

/** A dish of a basket with fewer portions left than it holds; none left when `left` is 0. */
export type CutLine = CartLine & { left: number };

/**
 * A basket cut down to the portions still left of each dish (Figma O7), and the dishes it cut: what someone
 * else ordered first between the cart and "Đặt món". Null when nothing is left to order.
 */
export function keepLeft(
  basket: Basket,
  left: Record<string, number>,
): { basket: Basket | null; cut: CutLine[] } {
  const cut = basket.lines
    .map((line) => ({ ...line, left: left[line.id] ?? 0 }))
    .filter((line) => line.left < line.quantity);
  const lines = basket.lines
    .map((line) => ({ ...line, quantity: Math.min(line.quantity, left[line.id] ?? 0) }))
    .filter((line) => line.quantity > 0);
  return { basket: lines.length > 0 ? { ...basket, lines } : null, cut };
}
