import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { BrandLoader } from "@/components/brand-loader";
import { kindsByCount } from "@/features/offers/offer";
import { listOffers } from "@/features/offers/list-offers";
import { SearchBar } from "@/features/search/search-bar";
import { readSearchQuery, type SearchQuery } from "@/features/search/search-query";
import { SearchResults } from "@/features/search/search-results";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Search");
  return { title: `${t("title")} · Second Bite`, robots: { index: false } };
}

// The search (Figma Mobile v3 K2, K2a, K2c and K1f): a white top bar with the field, then the dishes or the
// sellers that match, with the chips that narrow them.
export default async function SearchPage({ searchParams }: PageProps<"/[locale]/search">) {
  const t = await getTranslations("Search");
  const query = searchParams.then(readSearchQuery);

  return (
    <>
      {/* Above the bottom bar, which the search's suggestions cover (Figma K2a). */}
      <header className="sticky top-0 z-50 bg-shell text-shell-foreground">
        <div className="mx-auto w-full max-w-5xl">
          <Suspense fallback={<SearchBar />}>
            <AddressSearchBar query={query} />
          </Suspense>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1">
        <h1 className="sr-only">{t("title")}</h1>
        <Suspense fallback={<BrandLoader />}>
          <SearchResults query={query} />
        </Suspense>
      </main>
    </>
  );
}

async function AddressSearchBar({ query }: { query: Promise<SearchQuery> }) {
  const { q, near, tab } = await query;
  // The suggestions are a convenience: without the offers the field still searches.
  const offers = await listOffers({ near }).catch(() => []);
  // A new address starts the field afresh, with its own words.
  return <SearchBar key={q ?? ""} value={q} near={near} tab={tab} kinds={kindsByCount(offers)} />;
}
