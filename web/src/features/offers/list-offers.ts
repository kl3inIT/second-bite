import "server-only";

import { client } from "@/lib/api/generated/client.gen";

import type { OfferKind, OfferSummary } from "./offer";

export type OfferFilters = {
  /** Words in the name; the backend ignores accents. */
  q?: string;
  kind?: OfferKind;
  /** Only what can be collected now: the window must include this moment. */
  collectNow?: boolean;
};

/**
 * Tonight's offers and announcements, soonest window first (SEC-11 › Finding offers). Called from
 * Server Components; a failure rejects with ApiError and reaches the page's error boundary. The body's
 * shape follows the SEC-11 design until the generated SDK has the operation.
 */
export async function listOffers(filters: OfferFilters): Promise<OfferSummary[]> {
  const { data } = await client.get<{ 200: { offers: OfferSummary[] } }, unknown, true>({
    url: "/offers",
    query: {
      q: filters.q || undefined,
      kind: filters.kind,
      collectAt: filters.collectNow ? new Date().toISOString() : undefined,
      limit: 50,
    },
  });
  return data.offers;
}
