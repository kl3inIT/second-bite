import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { listOffers } from "@/features/offers/list-offers";
import { groupBySeller, inShowingOrder } from "@/features/offers/offer";
import { OfferList } from "@/features/offers/offer-list";
import { SellerGroup } from "@/features/offers/seller-group";
import { Link } from "@/i18n/navigation";

import { ResultTabs } from "./result-tabs";
import { SearchFilters, SearchOrder } from "./search-filters";
import type { SearchQuery } from "./search-query";

// What the search finds (Figma K2, K2c and K1f), under the tabs, the chips and a line saying how many and
// in what order. Dishes with words are large cards naming their seller (K2); dishes without words are
// grouped by seller, one large card and three more (K1f); sellers open with the seller (K2c).
export async function SearchResults({ query: pending }: { query: Promise<SearchQuery> }) {
  const query = await pending;
  const [t, found] = await Promise.all([
    getTranslations("Search"),
    listOffers({
      q: query.q,
      kind: query.kind,
      collectNow: query.now,
      near: query.near,
      radiusKm: query.radiusKm,
      maxPrice: query.maxPrice,
      sort: query.sort,
    }),
  ]);
  const offers = inShowingOrder(found);
  const groups = groupBySeller(offers);
  const sellersTab = query.tab === "sellers";
  const count = sellersTab ? groups.length : offers.length;
  const summary = sellersTab
    ? query.q
      ? t("sellersFor", { count, q: query.q })
      : t("sellersHere", { count })
    : query.q
      ? t("dishesFor", { count, q: query.q })
      : t("dishesHere", { count });

  return (
    <div className="flex flex-col gap-3 pb-6">
      <ResultTabs query={query} dishes={offers.length} sellers={groups.length} />
      <SearchFilters query={query} />
      <div className="flex items-center justify-between gap-3 px-4">
        <output className="text-label text-muted-foreground">{summary}</output>
        {offers.length > 1 && <SearchOrder query={query} />}
      </div>
      {offers.length === 0 ? (
        <Empty surface="card" className="mx-4 w-auto">
          <EmptyHeader>
            <EmptyTitle>{t("nothing")}</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href={{ pathname: "/search", query: query.near ? { near: query.near } : {} }}
              className={buttonVariants({ variant: "secondary" })}
            >
              {t("everything")}
            </Link>
          </EmptyContent>
        </Empty>
      ) : !sellersTab && query.q ? (
        <OfferList offers={offers} showSeller />
      ) : (
        <ul className="grid gap-3 px-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <li key={group.seller.id}>
              <SellerGroup
                seller={group.seller}
                offers={group.offers}
                lead={sellersTab ? "seller" : "dish"}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** What the results look like while they load: the tabs, the chips and two blocks in their final sizes. */
export function SearchResultsSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-3 px-4 pt-1 pb-6">
      <Skeleton className="h-11" />
      <div className="flex gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} shape="circle" className="h-8.5 w-20" />
        ))}
      </div>
      {Array.from({ length: 2 }, (_, i) => (
        <Skeleton key={i} shape="card" className="h-80" />
      ))}
    </div>
  );
}
