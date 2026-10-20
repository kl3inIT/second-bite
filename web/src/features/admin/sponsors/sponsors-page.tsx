import type { SearchParams } from "../list-query";
import { sponsorQueryOf } from "./sponsor";
import { listSponsors } from "./sponsors-source";
import { SponsorsView } from "./sponsors-view";

/** The sponsors page's read: the query from the address, then the places sold. */
export async function SponsorsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = sponsorQueryOf(await searchParams);
  const list = await listSponsors(query);
  return <SponsorsView list={list} query={query} />;
}
