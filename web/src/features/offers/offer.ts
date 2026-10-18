import type { FoundBody } from "@/lib/api/generated";

// An offer as `GET /offers` returns it (SEC-11 › Finding offers), with its seller and, near a point,
// its distance. Announcements of expected surplus join the list with SEC-11 step 5.

export const offerKinds = [
  "bakery",
  "prepared_food",
  "ingredients",
  "drinks",
  "mixed_box",
  "other",
] as const satisfies readonly FoundBody["kind"][];

export type OfferKind = (typeof offerKinds)[number];

export type OfferSummary = FoundBody;

/** Whether the offer can still be ordered: on sale with units left. */
export function isAvailable(offer: OfferSummary): boolean {
  return offer.status === "on_sale" && offer.unitsLeft > 0;
}

/** The list in the order the home shows it: what can be ordered, then what has sold out, each in the backend's order. */
export function inShowingOrder(offers: readonly OfferSummary[]): OfferSummary[] {
  return [...offers.filter(isAvailable), ...offers.filter((offer) => !isAvailable(offer))];
}

/** What can still be ordered, the window that closes first at the top: the home's "Sắp hết giờ lấy". */
export function closingFirst(offers: readonly OfferSummary[]): OfferSummary[] {
  return offers
    .filter(isAvailable)
    .toSorted((a, b) => Date.parse(a.windowEnd) - Date.parse(b.windowEnd));
}

/** What can still be ordered, the biggest discount at the top: the tickets of the home's deal card. */
export function biggestDiscountFirst(offers: readonly OfferSummary[]): OfferSummary[] {
  return offers.filter(isAvailable).toSorted((a, b) => b.discountPercent - a.discountPercent);
}

/**
 * The bags still open tonight, as units left across what can be ordered, and the end of the window that
 * closes last; undefined when nothing can be ordered.
 */
export function openBags(
  offers: readonly OfferSummary[],
): { bags: number; lastWindowEnd: string } | undefined {
  const available = offers.filter(isAvailable);
  if (available.length === 0) return undefined;
  return {
    bags: available.reduce((sum, offer) => sum + offer.unitsLeft, 0),
    lastWindowEnd: available.reduce((last, offer) =>
      Date.parse(offer.windowEnd) > Date.parse(last.windowEnd) ? offer : last,
    ).windowEnd,
  };
}
