import { readOfferQuery } from "./offer";
import { OffersList } from "./offers-list";
import { listAdminOffers } from "./offers-source";

/** Every post for the address's status card and filters (Figma AD-BD1). It reads the request, so it renders in Suspense. */
export async function OffersPage({
  query: pendingQuery,
}: {
  query: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = readOfferQuery(await pendingQuery);
  const list = await listAdminOffers(query);
  return (
    <OffersList
      query={query}
      rows={list.items}
      total={list.total}
      counts={list.counts}
      sellers={list.sellers}
    />
  );
}
