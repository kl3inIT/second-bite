import "server-only";

import { cache } from "react";

import { searchOffers, type SearchOffersData } from "@/lib/api/generated";

import type { OfferKind, OfferSummary } from "./offer";

export type OfferSort = NonNullable<NonNullable<SearchOffersData["query"]>["sort"]>;

export type OfferFilters = {
  /** Words in the name, the seller's name or the description; typed without marks they match any marks. */
  q?: string;
  kind?: OfferKind;
  /** Only what can be collected now: the window must include this moment. */
  collectNow?: boolean;
  /** "latitude,longitude": only sellers around it, nearest first, each with its distance. */
  near?: string;
  /** How far around `near`; the backend's default when absent. */
  radiusKm?: number;
  /** The highest price of one portion, in đồng. */
  maxPrice?: number;
  /** The backend's own order when absent: best match with words, nearest with a place, soonest otherwise. */
  sort?: OfferSort;
};

/**
 * Tonight's offers for the filters (SEC-11 › Finding offers). Called from Server Components; a failure
 * rejects with ApiError and reaches the page's error boundary. The header and the list ask for the same
 * offers, so one render makes one request.
 */
export function listOffers(filters: OfferFilters): Promise<OfferSummary[]> {
  return search(
    JSON.stringify([
      filters.q || undefined,
      filters.kind,
      Boolean(filters.collectNow),
      filters.near,
      filters.radiusKm,
      filters.maxPrice,
      filters.sort,
    ]),
  );
}

// React's cache compares arguments by identity, so the filters arrive as one string.
const search = cache(async (key: string) => {
  // JSON writes an absent filter as null; the query leaves it out only when it is undefined.
  const values = (JSON.parse(key) as unknown[]).map((value) => value ?? undefined);
  const [q, kind, collectNow, near, radiusKm, maxPrice, sort] = values as [
    string | undefined,
    OfferKind | undefined,
    boolean,
    string | undefined,
    number | undefined,
    number | undefined,
    OfferSort | undefined,
  ];
  const now = collectNow ? new Date().toISOString() : undefined;
  const { data } = await searchOffers({
    query: {
      q,
      kind: kind ? [kind] : undefined,
      collectFrom: now,
      collectTo: now,
      near,
      radiusKm,
      maxPrice,
      sort,
      limit: 50,
    },
  });
  return data.offers;
});
