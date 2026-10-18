// An offer or announcement as `GET /offers` returns it. The endpoint is designed in SEC-11
// (docs/increments/active/sec-11-offer-module/design.md › The contract) and not built yet; this type
// follows that design and is replaced by the generated one (`src/lib/api/generated`) when the backend
// publishes it.

export const offerKinds = [
  "bakery",
  "prepared_food",
  "ingredients",
  "drinks",
  "mixed_box",
  "other",
] as const;

export type OfferKind = (typeof offerKinds)[number];

export type OfferSummary = {
  id: string;
  /** `on_sale` can be ordered; `announced` is expected surplus that can only be followed. */
  state: "on_sale" | "announced";
  name: string;
  kind: OfferKind;
  /** Whole đồng. */
  price: number;
  originalPrice: number;
  /** Units left on sale; for an announcement, the units the seller expects. */
  units: number;
  unit: string;
  /** The window to collect in, RFC 3339 with an offset. */
  collectFrom: string;
  collectUntil: string;
  /** The photo's 400 px address under the API, such as `/photos/{id}/400.jpg`. */
  photo: string;
  seller: { id: string; name: string; place: string };
};

/** Tonight's list in the order the home shows it: what can be ordered, then what is expected, then what has sold out. */
export function inShowingOrder(offers: readonly OfferSummary[]): OfferSummary[] {
  const rank = (offer: OfferSummary) => (offer.state === "announced" ? 1 : offer.units > 0 ? 0 : 2);
  return offers
    .map((offer, index) => ({ offer, index }))
    .sort((a, b) => rank(a.offer) - rank(b.offer) || a.index - b.index)
    .map(({ offer }) => offer);
}
