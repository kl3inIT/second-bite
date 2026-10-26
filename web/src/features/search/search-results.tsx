import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { listOffers } from "@/features/offers/list-offers";
import { groupBySeller, inShowingOrder, type OfferSummary } from "@/features/offers/offer";
import { OfferCard } from "@/features/offers/offer-card";
import { SellerDishes } from "@/features/offers/seller-dishes";
import { SellerGroup } from "@/features/offers/seller-group";
import { Link } from "@/i18n/navigation";

import { SearchFilters } from "./search-filters";
import { searchHref, type SearchQuery } from "./search-query";
import { SearchView, ViewSwitch } from "./search-view";

// What the search finds (Figma K1f, K2), under the chips with the order among them (as Keeta and foodpanda place
// it) and a line saying how many, with the switch between the grid and the list grouped by seller (K2b, WK2b).
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
  const place = query.near ? "near" : "mall";
  const count = offers.length;
  const summary = query.q
    ? t("dishesFor", { count, q: query.q })
    : t("dishesHere", { count, place });

  const filtered = Boolean(
    query.kind ||
    query.now ||
    query.radiusKm ||
    query.minPrice ||
    query.maxPrice ||
    query.from ||
    query.to,
  );
  const heading = (
    <div className="flex items-center justify-between gap-3 px-4 md:pt-2">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
        <output className="text-label text-muted-foreground md:text-body-sm md:font-medium">
          {summary}
        </output>
        {filtered && (
          <Link
            href={searchHref({ q: query.q, near: query.near })}
            className="text-body-sm-strong text-link underline-offset-4 hover:underline max-md:hidden"
          >
            {t("resetFilters")}
          </Link>
        )}
      </div>
      {offers.length > 0 && <ViewSwitch />}
    </div>
  );
  const sortable = offers.length > 1;

  return (
    <div className="flex flex-col gap-3 pb-6 md:pt-4">
      {/* On a phone the white top goes on under the field with the chips and the summary (Figma K1f); from
          `md` they sit on the page's ground, the chips with their own white and edge (Figma WK2). */}
      <div className="flex flex-col gap-3 border-b border-border bg-shell pb-3 md:border-b-0 md:bg-transparent md:pb-0">
        <SearchFilters query={query} sort={sortable} className="md:hidden" />
        <SearchFilters
          query={query}
          raised
          sort={sortable}
          className="hidden md:flex md:flex-wrap md:overflow-visible"
        />
        {heading}
      </div>
      {offers.length === 0 ? (
        <Empty surface="card" className="mx-4 w-auto">
          <EmptyHeader>
            <EmptyTitle>{t("nothing")}</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href={searchHref({ near: query.near })}
              className={buttonVariants({ variant: "secondary" })}
            >
              {t("everything")}
            </Link>
          </EmptyContent>
        </Empty>
      ) : (
        <SearchView
          grid={<ResultsGrid groups={groups} offers={offers} />}
          list={
            <div className="flex flex-col gap-7 px-4 pt-1">
              {groups.map(({ seller, offers: dishes }) => (
                <SellerDishes key={seller.id} seller={seller} offers={dishes} />
              ))}
            </div>
          }
        />
      )}
    </div>
  );
}

// The grid: the cards of K1f on a phone, one card for each dish from `md` (WK2).
function ResultsGrid({
  groups,
  offers,
}: {
  groups: ReturnType<typeof groupBySeller>;
  offers: readonly OfferSummary[];
}) {
  return (
    <>
      {/* A seller with one dish is a small card, two to a row; a seller with more spans the row with their
          tiles (Figma K1f). */}
      <ul className="grid grid-cols-2 gap-3 px-4 md:hidden">
        {groups.map(({ seller, offers: dishes }) => {
          const [only] = dishes;
          return dishes.length === 1 && only ? (
            <li key={seller.id} className="min-w-0">
              <OfferCard offer={only} compact showSeller className="h-full" />
            </li>
          ) : (
            <li key={seller.id} className="col-span-2 min-w-0">
              <SellerGroup seller={seller} offers={dishes} />
            </li>
          );
        })}
      </ul>
      {/* From `md` every dish is its own card, two across and three from `lg` (Figma WK2, D2). */}
      <ul className="hidden gap-x-5 gap-y-3.5 px-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <li key={offer.id} className="min-w-0">
            <OfferCard offer={offer} showSeller className="h-full" />
          </li>
        ))}
      </ul>
    </>
  );
}
