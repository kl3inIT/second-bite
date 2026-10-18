import "server-only";

import { cache } from "react";

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
 * error boundary. The header and the list ask for the same offers, so one render makes one request.
 */
export function listOffers(filters: OfferFilters): Promise<OfferSummary[]> {
  return search(filters.q || undefined, filters.kind, Boolean(filters.collectNow));
}

// React's cache compares arguments by identity, so the filters are passed as primitives.
const search = cache(
  async (q: string | undefined, kind: OfferKind | undefined, collectNow: boolean) => {
    const now = collectNow ? new Date().toISOString() : undefined;
    const { data } = await searchOffers({
      query: { q, kind: kind ? [kind] : undefined, collectFrom: now, collectTo: now, limit: 50 },
    });
    return data.offers;
  },
);
