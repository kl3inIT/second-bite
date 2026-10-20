import "server-only";

import type { AdminOfferRow, OfferQuery, OfferSeller, OfferStatus } from "./offer";

export type OfferList = {
  items: AdminOfferRow[];
  /** How many posts match, for the pagination. */
  total: number;
  /** How many posts each status holds, for the summary cards, once the backend counts them. */
  counts?: Record<OfferStatus, number>;
  /** The stores with posts, for the store filter. */
  sellers: OfferSeller[];
};

/**
 * Every store's posts for an admin. The offer module lists one store's posts (`GET /sellers/{id}/offers`) but has
 * no admin list across stores and no removal for a violation, so there are none here and the page shows its empty
 * state; the backend's list replaces this.
 */
export async function listAdminOffers(_query: OfferQuery): Promise<OfferList> {
  return { items: [], total: 0, sellers: [] };
}
