import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { BrandLoader } from "@/components/brand-loader";
import { SearchBar } from "@/features/search/search-bar";
import { readSearchQuery, type SearchQuery } from "@/features/search/search-query";
import { SearchResults } from "@/features/search/search-results";
import { pageMetadata } from "@/lib/seo";

// A page of results is no page to index; the layout's template adds the name (SEC-52).
export async function generateMetadata({
  params,
}: PageProps<"/[locale]/search">): Promise<Metadata> {
  const t = await getTranslations("Search");
  return pageMetadata({ locale: (await params).locale, title: t("title"), index: false });
}

// The search (Figma Mobile v3 K2, K2a, K2c and K1f): a white top bar with the field, then the dishes or the
// sellers that match, with the chips that narrow them.
export default async function SearchPage({ searchParams }: PageProps<"/[locale]/search">) {
  const t = await getTranslations("Search");
  const query = searchParams.then(readSearchQuery);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-shell text-shell-foreground">
        <div className="mx-auto w-full max-w-5xl">
          <Suspense fallback={<SearchBar />}>
            <AddressSearchBar query={query} />
          </Suspense>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 pt-1">
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
  // A new address starts the field afresh, with its own words.
  return <SearchBar key={q ?? ""} value={q} near={near} tab={tab} />;
}
