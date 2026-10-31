import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { BrandLoader } from "@/components/brand-loader";
import { CartBar } from "@/features/cart/cart-bar";
import { PlaceHeading } from "@/features/home/place-heading";
import { AccountAction } from "@/features/identity/account-action";
import { kindsByCount } from "@/features/offers/offer";
import { listOffers } from "@/features/offers/list-offers";
import { SearchBar } from "@/features/search/search-bar";
import { withRememberedPlace } from "@/features/home/remembered-place";
import { readSearchQuery, searchHref, type SearchQuery } from "@/features/search/search-query";
import { SearchResults } from "@/features/search/search-results";
import { contentWidth } from "@/lib/layout";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

// A page of results is no page to index; the layout's template adds the name (SEC-52).
export async function generateMetadata({
  params,
}: PageProps<"/[locale]/search">): Promise<Metadata> {
  const t = await getTranslations("Search");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The search (Figma Mobile v3 K2a and K1f): a white top bar with the field, then the dishes or the
// sellers that match, with the chips that narrow them. From `md` the customer header carries the field instead
// (Figma WK2).
export default async function SearchPage({ searchParams }: PageProps<"/[locale]/search">) {
  const t = await getTranslations("Search");
  // The address's place, or the one this browser kept (customer place, step 3).
  const query = searchParams.then(readSearchQuery).then(withRememberedPlace);

  return (
    <>
      {/* Above the bottom bar, which the search's suggestions cover (Figma K2a). */}
      <header className="sticky top-0 z-50 bg-shell text-shell-foreground md:hidden">
        <Suspense fallback={<SearchBar />}>
          <AddressSearchBar query={query} />
        </Suspense>
      </header>
      <div className="max-md:hidden">
        <AppHeader
          title={
            <Suspense fallback={<PlaceHeading asHeading={false} />}>
              <AddressPlaceHeading query={query} />
            </Suspense>
          }
          search={
            <Suspense fallback={<SearchBar desktop />}>
              <AddressSearchBar query={query} desktop />
            </Suspense>
          }
          account={
            <Suspense>
              <SearchAccount query={query} />
            </Suspense>
          }
        />
      </div>
      <main className={cn(contentWidth, "flex-1")}>
        <h1 className="sr-only">{t("title")}</h1>
        <Suspense fallback={<BrandLoader />}>
          <SearchResults query={query} />
        </Suspense>
      </main>
      {/* The portions added with a dish's − and + show at once, with the way on to the cart. */}
      <CartBar width={contentWidth} />
    </>
  );
}

async function AddressPlaceHeading({ query }: { query: Promise<SearchQuery> }) {
  const { near, place } = await query;
  return <PlaceHeading query={{ near, place }} asHeading={false} />;
}

async function SearchAccount({ query }: { query: Promise<SearchQuery> }) {
  return <AccountAction returnTo={searchHref(await query)} />;
}

async function AddressSearchBar({
  query,
  desktop,
}: {
  query: Promise<SearchQuery>;
  desktop?: boolean;
}) {
  const { q, near, place } = await query;
  // The suggestions are a convenience: without the offers the field still searches.
  const offers = await listOffers({ near }).catch(() => []);
  // A new address starts the field afresh, with its own words.
  return (
    <SearchBar
      key={q ?? ""}
      value={q}
      near={near}
      place={place}
      kinds={kindsByCount(offers)}
      desktop={desktop}
    />
  );
}
