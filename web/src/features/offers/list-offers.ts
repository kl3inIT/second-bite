import "server-only";

import { searchOffers } from "@/lib/api/generated";

import type { OfferKind, OfferSummary } from "./offer";

export type OfferFilters = {
  /** Words in the name, the seller's name or the description; typed without marks they match any marks. */
  q?: string;
  kind?: OfferKind;
  /** Only what can be collected now: the window must include this moment. */
  collectNow?: boolean;
};

/**
 * Tonight's offers, soonest window first, or best match first when words are given (SEC-11 › Finding
 * offers). Called from Server Components; a failure rejects with ApiError and reaches the page's
 * error boundary.
 */
export async function listOffers(filters: OfferFilters): Promise<OfferSummary[]> {
  const now = filters.collectNow ? new Date().toISOString() : undefined;
  const { data } = await searchOffers({
    query: {
      q: filters.q || undefined,
      kind: filters.kind ? [filters.kind] : undefined,
      collectFrom: now,
      collectTo: now,
      limit: 50,
    },
  });
  return data.offers;
}
