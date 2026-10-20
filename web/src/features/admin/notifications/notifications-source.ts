import "server-only";

import type { CampaignList, CampaignQuery } from "./campaign";

/**
 * The notifications sent to groups of people (Figma AD-MK5). The notification module sends one email at a time
 * and sends no push notification; nothing sends to a group or keeps such campaigns, and no issue or decision
 * covers it yet (SEC-62 design › What waits), so there are none and the page shows its empty state. The backend that adds them replaces this
 * read, with the query as its filters.
 */
export async function listCampaigns(_query: CampaignQuery): Promise<CampaignList> {
  return { items: [], total: 0 };
}
