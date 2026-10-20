import "server-only";

import type { SponsorList, SponsorQuery } from "./sponsor";

/**
 * The places in the app sold to stores and sponsors (Figma AD-MK7). The pilot is free and no module sells places
 * yet; no issue or decision covers it (SEC-62 design › What waits), so there are none and the page shows its empty
 * state. The backend that adds them replaces this read, with the query as its filters.
 */
export async function listSponsors(_query: SponsorQuery): Promise<SponsorList> {
  return { items: [], total: 0 };
}
