import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { listOffers } from "@/features/offers/list-offers";
import { groupBySeller, inShowingOrder } from "@/features/offers/offer";
import { OfferList } from "@/features/offers/offer-list";
import { OfferCard } from "@/features/offers/offer-card";
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
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      collectFrom: query.from,
      collectTo: query.to,
      sort: query.sort,
    }),
  ]);
  const offers = inShowingOrder(found);
  const groups = groupBySeller(offers);
  // Browsing without words (Figma K1f) lists the dishes alone; the tabs come with a search (Figma K2).
  const browsing = !query.q;
  const sellersTab = !browsing && query.tab === "sellers";
  const count = sellersTab ? groups.length : offers.length;
  const place = query.near ? "near" : "mall";
  const summary = sellersTab
    ? query.q
      ? t("sellersFor", { count, q: query.q })
      : t("sellersHere", { count, place })
    : query.q
      ? t("dishesFor", { count, q: query.q })
      : t("dishesHere", { count, place });

  const heading = (
    <div className="flex items-center justify-between gap-3 px-4">
      <output className="text-label text-muted-foreground">{summary}</output>
      {offers.length > 1 && <SearchOrder query={query} />}
    </div>
  );

  return (
    <div className="flex flex-col gap-3 pb-6">
      {/* The white top goes on under the field with the chips, and while browsing the summary (Figma K1f). */}
      <div className="flex flex-col gap-3 border-b border-border bg-shell pb-3">
        {!browsing && <ResultTabs query={query} dishes={offers.length} sellers={groups.length} />}
        <SearchFilters query={query} />
        {browsing && heading}
      </div>
      {!browsing && heading}
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
        // A seller with one dish is a small card, two to a row; a seller with more spans the row with their
        // tiles (Figma K1f).
        <ul className="grid grid-cols-2 gap-3 px-4 xl:grid-cols-3">
          {groups.map(({ seller, offers: dishes }) => {
            const [only] = dishes;
            return !sellersTab && dishes.length === 1 && only ? (
              <li key={seller.id} className="min-w-0">
                <OfferCard offer={only} compact showSeller className="h-full" />
              </li>
            ) : (
              <li key={seller.id} className="col-span-2 min-w-0">
                <SellerGroup
                  seller={seller}
                  offers={dishes}
                  lead={sellersTab ? "seller" : "dish"}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
