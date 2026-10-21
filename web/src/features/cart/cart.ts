import type { OfferSummary } from "@/features/offers/offer";

// The cart until orders exist (SEC-49 decision 7): dishes of any sellers, each never more than its portions
// left, kept as the cards showed them so the confirmation (Figma K5) needs no request of its own. Each seller's
// dishes are a basket, ordered on its own since an order holds one seller's dishes (SEC-15).

export type CartLine = Pick<
  OfferSummary,
  "id" | "name" | "priceVnd" | "originalPriceVnd" | "unitsLeft" | "windowStart" | "windowEnd"
> & { quantity: number };

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
  const baskets = cart?.baskets ?? [];
  const basket = baskets.find(({ seller }) => seller.id === offer.sellerId);
  if (!basket) return { baskets: [...baskets, basketOf(offer)] };
  const line = basket.lines.find(({ id }) => id === offer.id);
  const updated = {
    ...lineOf(offer),
    quantity: Math.min((line?.quantity ?? 0) + 1, offer.unitsLeft),
  };
  const lines = line
    ? basket.lines.map((each) => (each.id === offer.id ? updated : each))
    : [...basket.lines, updated];
  return { baskets: baskets.map((each) => (each === basket ? { ...basket, lines } : each)) };
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

/**
 * The cart in a value read back from storage, since anything may have written there; null when it holds none.
 * A cart saved while it held one seller is that seller's basket.
 */
export function readCart(value: unknown): Cart | null {
  if (typeof value !== "object" || value === null) return null;
  const baskets: unknown = "baskets" in value ? value.baskets : [value];
  return Array.isArray(baskets) && baskets.length > 0 && baskets.every(isBasket)
    ? { baskets }
    : null;
}

function isBasket(value: unknown): value is Basket {
  if (typeof value !== "object" || value === null) return false;
  const { seller, collectionPoint, lines } = value as Partial<Basket>;
  return (
    typeof seller?.id === "string" &&
    typeof seller.name === "string" &&
    typeof collectionPoint?.latitude === "number" &&
    Array.isArray(lines) &&
    lines.length > 0 &&
    lines.every(
      (line) =>
        typeof line?.id === "string" &&
        typeof line.name === "string" &&
        Number.isInteger(line.quantity) &&
        line.quantity > 0 &&
        typeof line.priceVnd === "number" &&
        typeof line.originalPriceVnd === "number" &&
        typeof line.windowStart === "string" &&
        typeof line.windowEnd === "string",
    )
  );
}

function basketOf(offer: OfferSummary): Basket {
  return {
    seller: {
      id: offer.seller.id,
      name: offer.seller.name,
      address: offer.seller.address,
      photo: offer.seller.photo,
    },
    collectionPoint: offer.collectionPoint,
    distanceMeters: offer.distanceMeters,
    lines: [{ ...lineOf(offer), quantity: Math.min(1, offer.unitsLeft) }],
  };
}

function lineOf(offer: OfferSummary): Omit<CartLine, "quantity"> {
  const { id, name, priceVnd, originalPriceVnd, unitsLeft, windowStart, windowEnd } = offer;
  return { id, name, priceVnd, originalPriceVnd, unitsLeft, windowStart, windowEnd };
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
