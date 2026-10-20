import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { listOffers } from "@/features/offers/list-offers";
import { groupBySeller, inShowingOrder } from "@/features/offers/offer";
import { OfferCard } from "@/features/offers/offer-card";
import { SellerGroup } from "@/features/offers/seller-group";
import { Link } from "@/i18n/navigation";

import { SearchFilters, SearchOrder } from "./search-filters";
import type { SearchQuery } from "./search-query";

// What the search finds (Figma K1f), under the chips and a line saying how many and in what order: the dishes
// grouped by seller, with or without words.
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

  const heading = (
    <div className="flex items-center justify-between gap-3 px-4">
      <output className="text-label text-muted-foreground">{summary}</output>
      {offers.length > 1 && <SearchOrder query={query} />}
    </div>
  );

  return (
    <div className="flex flex-col gap-3 pb-6">
      {/* The white top goes on under the field with the chips and the summary (Figma K1f). */}
      <div className="flex flex-col gap-3 border-b border-border bg-shell pb-3">
        <SearchFilters query={query} />
        {heading}
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
      ) : (
        // A seller with one dish is a small card, two to a row; a seller with more spans the row with their
        // tiles (Figma K1f).
        <ul className="grid grid-cols-2 gap-3 px-4 xl:grid-cols-3">
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
      )}
    </div>
  );
}
