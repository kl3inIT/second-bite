import type { FoundBody } from "@/lib/api/generated";

// An offer as `GET /offers` returns it (SEC-11 › Finding offers), with its seller and, near a point,
// its distance. Announcements of expected surplus join the list with SEC-11 step 5.

export const offerKinds = [
  "bakery",
  "prepared_food",
  "ingredients",
  "drinks",
  "mixed_box",
  "dessert",
  "snacks",
  "produce",
  "other",
] as const satisfies readonly FoundBody["kind"][];

export type OfferKind = (typeof offerKinds)[number];

/** What a dish's kind is called: the name its seller gave a dish of the kind "other", else the kind's own. */
export function kindText(
  name: (kind: OfferKind) => string,
  kind: OfferKind,
  label: string,
): string {
  return kind === "other" && label ? label : name(kind);
}

export type OfferSummary = FoundBody;

/** Whether the offer can still be ordered: on sale with units left. */
export function isAvailable(offer: OfferSummary): boolean {
  return offer.status === "on_sale" && offer.unitsLeft > 0;
}

/** The list in the order the home shows it: what can be ordered, then what has sold out, each in the backend's order. */
export function inShowingOrder(offers: readonly OfferSummary[]): OfferSummary[] {
  return [...offers.filter(isAvailable), ...offers.filter((offer) => !isAvailable(offer))];
}

/** What can still be ordered, the window that closes first at the top: the home's "Sắp hết giờ nhận". */
export function closingFirst(offers: readonly OfferSummary[]): OfferSummary[] {
  return offers
    .filter(isAvailable)
    .toSorted((a, b) => Date.parse(a.windowEnd) - Date.parse(b.windowEnd));
}

/** What can still be ordered, the biggest discount at the top: the tickets of the home's deal card. */
export function biggestDiscountFirst(offers: readonly OfferSummary[]): OfferSummary[] {
  return offers.filter(isAvailable).toSorted((a, b) => b.discountPercent - a.discountPercent);
}

/** The offers by seller, in the order each seller first appears, each seller's in the order given. */
export function groupBySeller(
  offers: readonly OfferSummary[],
): { seller: OfferSummary["seller"]; offers: OfferSummary[] }[] {
  const groups = new Map<string, { seller: OfferSummary["seller"]; offers: OfferSummary[] }>();
  for (const offer of offers) {
    const group = groups.get(offer.sellerId);
    if (group) group.offers.push(offer);
    else groups.set(offer.sellerId, { seller: offer.seller, offers: [offer] });
  }
  return [...groups.values()];
}

/** The kinds that can still be ordered, the one with the most offers first: the search's popular kinds. */
export function kindsByCount(
  offers: readonly OfferSummary[],
): { kind: OfferKind; count: number }[] {
  const counts = new Map<OfferKind, number>();
  for (const offer of offers.filter(isAvailable)) {
    counts.set(offer.kind, (counts.get(offer.kind) ?? 0) + 1);
  }
  return [...counts]
    .map(([kind, count]) => ({ kind, count }))
    .toSorted((a, b) => b.count - a.count);
}

/** The anchor of a dish's row on its seller's page (Figma K4). */
export function dishAnchor(offerId: string): string {
  return `dish-${offerId}`;
}

/**
 * Where a dish opens: its seller's page scrolled to its row, which is tinted (Figma K4). The dish has no page of
 * its own; its row opens its sheet (K4a).
 */
export function dishHref({ id, sellerId }: Pick<OfferSummary, "id" | "sellerId">): string {
  return `/sellers/${sellerId}?at=${encodeURIComponent(id)}#${dishAnchor(id)}`;
}

/**
 * Directions to where the offer is collected, in the phone's maps (Figma K4b, K5 "Chỉ đường"), to the store's pin:
 * the owner pins the store on a map (SEC-66), while Google looking up the written address can land elsewhere. A
 * point without coordinates, as in a cart kept from before, falls back to the address.
 */
export function directionsHref({
  address,
  latitude,
  longitude,
}: Pick<OfferSummary["collectionPoint"], "address"> &
  Partial<Pick<OfferSummary["collectionPoint"], "latitude" | "longitude">>): string {
  const pinned = Number.isFinite(latitude) && Number.isFinite(longitude);
  const destination = pinned ? `${latitude},${longitude}` : address;
  return `https://www.google.com/maps/dir/?${new URLSearchParams({ api: "1", destination })}`;
}
