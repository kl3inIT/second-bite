import type { OfferSummary } from "@/features/offers/offer";

// The cart until orders exist (SEC-49 decision 7): one seller's dishes, each never more than its portions
// left, kept as the cards showed them so the confirmation (Figma K5) needs no request of its own.

export type CartLine = Pick<
  OfferSummary,
  "id" | "name" | "priceVnd" | "originalPriceVnd" | "unitsLeft" | "windowStart" | "windowEnd"
> & { quantity: number };

export type Cart = {
  seller: Pick<OfferSummary["seller"], "id" | "name" | "address" | "photo">;
  collectionPoint: OfferSummary["collectionPoint"];
  distanceMeters?: number;
  lines: CartLine[];
};

/** One more portion of the dish, or the cart that stands in its way when it holds another seller's dishes. */
export function addOne(
  cart: Cart | null,
  offer: OfferSummary,
): { cart: Cart; conflict?: never } | { conflict: Cart; cart?: never } {
  if (!cart) return { cart: startWith(offer) };
  if (cart.seller.id !== offer.sellerId) return { conflict: cart };
  const line = cart.lines.find(({ id }) => id === offer.id);
  const quantity = Math.min((line?.quantity ?? 0) + 1, offer.unitsLeft);
  const updated = { ...lineOf(offer), quantity };
  return {
    cart: {
      ...cart,
      lines: line
        ? cart.lines.map((each) => (each.id === offer.id ? updated : each))
        : [...cart.lines, updated],
    },
  };
}

/** A new cart holding one portion of the dish, in place of whatever was there. */
export function startWith(offer: OfferSummary): Cart {
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

/** One portion fewer; the dish leaves at none and the cart is gone with its last dish. */
export function removeOne(cart: Cart, offerId: string): Cart | null {
  const lines = cart.lines
    .map((line) => (line.id === offerId ? { ...line, quantity: line.quantity - 1 } : line))
    .filter((line) => line.quantity > 0);
  return lines.length > 0 ? { ...cart, lines } : null;
}

export function quantityOf(cart: Cart | null, offerId: string): number {
  return cart?.lines.find(({ id }) => id === offerId)?.quantity ?? 0;
}

/** The portions, what they cost tonight and what they would have cost: the bars of K4b and K5. */
export function totals(cart: Cart): { units: number; priceVnd: number; originalPriceVnd: number } {
  return cart.lines.reduce(
    (sum, line) => ({
      units: sum.units + line.quantity,
      priceVnd: sum.priceVnd + line.quantity * line.priceVnd,
      originalPriceVnd: sum.originalPriceVnd + line.quantity * line.originalPriceVnd,
    }),
    { units: 0, priceVnd: 0, originalPriceVnd: 0 },
  );
}

/** When every dish in the cart can be collected, or the earliest window when they share no time. */
export function collectionWindow(cart: Cart): { windowStart: string; windowEnd: string } {
  const starts = cart.lines.map(({ windowStart }) => Date.parse(windowStart));
  const ends = cart.lines.map(({ windowEnd }) => Date.parse(windowEnd));
  const start = Math.max(...starts);
  const end = Math.min(...ends);
  if (start < end) {
    return { windowStart: new Date(start).toISOString(), windowEnd: new Date(end).toISOString() };
  }
  const earliest = cart.lines.reduce((a, b) =>
    Date.parse(b.windowStart) < Date.parse(a.windowStart) ? b : a,
  );
  return { windowStart: earliest.windowStart, windowEnd: earliest.windowEnd };
}

/** Whether a value read back from storage is a cart, since anything may have written there. */
export function isCart(value: unknown): value is Cart {
  if (typeof value !== "object" || value === null) return false;
  const { seller, collectionPoint, lines } = value as Partial<Cart>;
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

function lineOf(offer: OfferSummary): Omit<CartLine, "quantity"> {
  const { id, name, priceVnd, originalPriceVnd, unitsLeft, windowStart, windowEnd } = offer;
  return { id, name, priceVnd, originalPriceVnd, unitsLeft, windowStart, windowEnd };
}

/** A dish of the cart with fewer portions left than it holds; none left when `left` is 0. */
export type CutLine = CartLine & { left: number };

/**
 * The cart cut down to the portions still left of each dish (Figma O7), and the dishes it cut: what someone
 * else ordered first between the cart and "Đặt món". Null when nothing is left to order.
 */
export function keepLeft(
  cart: Cart,
  left: Record<string, number>,
): { cart: Cart | null; cut: CutLine[] } {
  const cut = cart.lines
    .map((line) => ({ ...line, left: left[line.id] ?? 0 }))
    .filter((line) => line.left < line.quantity);
  const lines = cart.lines
    .map((line) => ({ ...line, quantity: Math.min(line.quantity, left[line.id] ?? 0) }))
    .filter((line) => line.quantity > 0);
  return { cart: lines.length > 0 ? { ...cart, lines } : null, cut };
}
