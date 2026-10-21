import "server-only";

import { cache } from "react";

import { searchOffers, type SearchOffersData } from "@/lib/api/generated";

import type { OfferKind, OfferSummary } from "./offer";
import { isAnnouncement, type Announcement } from "./proposed";
import { tonightAt } from "./tonight";

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
  /** The lowest and highest price of one portion, in đồng. */
  minPrice?: number;
  maxPrice?: number;
  /** Collected from and to tonight, "20:00" and "21:30"; `collectNow` takes their place. */
  collectFrom?: string;
  collectTo?: string;
  /** One seller's offers only: the dish page's other dishes and the seller's page. */
  sellerId?: string;
  /** The backend's own order when absent: best match with words, nearest with a place, soonest otherwise. */
  sort?: OfferSort;
};

/**
 * Tonight's offers for the filters (SEC-11 › Finding offers), without the announcements. Called from Server
 * Components; a failure rejects with ApiError and reaches the page's error boundary. The header and the
 * list ask for the same offers, so one render makes one request.
 */
export async function listOffers(filters: OfferFilters): Promise<OfferSummary[]> {
  const found = await search(key(filters));
  return found.filter((offer): offer is OfferSummary => !isAnnouncement(offer));
}

/** The announcements among tonight's results for the filters: the home's "Sắp có tối nay". */
export async function listAnnouncements(filters: OfferFilters): Promise<Announcement[]> {
  return (await search(key(filters))).filter(isAnnouncement);
}

function key(filters: OfferFilters): string {
  return JSON.stringify([
    filters.q || undefined,
    filters.kind,
    Boolean(filters.collectNow),
    filters.near,
    filters.radiusKm,
    filters.minPrice,
    filters.maxPrice,
    filters.collectFrom,
    filters.collectTo,
    filters.sort,
    filters.sellerId,
  ]);
}

// React's cache compares arguments by identity, so the filters arrive as one string.
const search = cache(async (filters: string) => {
  // JSON writes an absent filter as null; the query leaves it out only when it is undefined.
  const values = (JSON.parse(filters) as unknown[]).map((value) => value ?? undefined);
  const [q, kind, collectNow, near, radiusKm, minPrice, maxPrice, from, to, sort, sellerId] =
    values as [
      string | undefined,
      OfferKind | undefined,
      boolean,
      string | undefined,
      number | undefined,
      number | undefined,
      number | undefined,
      string | undefined,
      string | undefined,
      OfferSort | undefined,
      string | undefined,
    ];
  const now = collectNow ? new Date().toISOString() : undefined;
  const { data } = await searchOffers({
    query: {
      q,
      kind: kind ? [kind] : undefined,
      collectFrom: now ?? tonightAt(from),
      collectTo: now ?? tonightAt(to),
      near,
      radiusKm,
      minPrice,
      maxPrice,
      sort,
      sellerId,
      limit: 50,
    },
  });
  // Announcements join the results with SEC-11 step 5; the stub returns them already (proposed.ts).
  return data.offers as (OfferSummary | Announcement)[];
});
