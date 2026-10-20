import type { SearchParams } from "../promotions/list-query";
import { campaignQueryOf } from "./campaign";
import { listCampaigns } from "./notifications-source";
import { NotificationsView } from "./notifications-view";

/** The notification history's read: the query from the address, then the campaigns. */
export async function NotificationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = campaignQueryOf(await searchParams);
  const list = await listCampaigns(query);
  return <NotificationsView list={list} query={query} />;
}
