import type { OfferSummary } from "./offer";

// Fields the stub backend returns ahead of the contract, so the last parts of flow 1 can be drawn (SEC-49
// decision 5). Every element they feed shows only when its field is there, so nothing appears against the
// real backend until it returns them: announcements with SEC-11 step 5, a seller's rating with no step yet.

/** Surplus a seller expects later tonight (SEC-11 › Announcing expected surplus): followed, never ordered. */
export type Announcement = Omit<OfferSummary, "status" | "unitsLeft"> & {
  status: "announced";
  /** The units the seller expects; the real ones come when it is confirmed. */
  estimatedUnits: number;
};

export function isAnnouncement(offer: OfferSummary | Announcement): offer is Announcement {
  return offer.status === "announced";
}

/** The seller's rating out of 5, such as 4.7; undefined while the backend gives none. */
export function sellerRating(offer: Pick<OfferSummary, "seller">): number | undefined {
  const { rating } = offer.seller as { rating?: unknown };
  return typeof rating === "number" ? rating : undefined;
}
