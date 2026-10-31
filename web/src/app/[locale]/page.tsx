import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { BrandLoader } from "@/components/brand-loader";
import { AppHeader } from "@/components/app-header";
import { HomeContent } from "@/features/home/home-content";
import { homePath, readHomeQuery, type HomeQuery } from "@/features/home/home-query";
import { AccountAction } from "@/features/identity/account-action";
import { PlaceHeading } from "@/features/home/place-heading";
import { SearchField } from "@/features/home/search-field";
import { TonightDeals } from "@/features/home/tonight-deals";
import { contentWidth } from "@/lib/layout";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

// The home keeps the site's title and description, with its canonical address and its other language for
// search engines (SEC-52).
export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return pageMetadata({ locale: (await params).locale, description: t("description") });
}

// The customer home: tonight's offers of every shop, or around a place, with no landing page in front (SEC-23), drawn as the
// Figma home (Secondbite › Mobile v3 › K1 · Trang chủ).
export default function Home({ searchParams }: PageProps<"/[locale]">) {
  const query = searchParams.then(readHomeQuery);

  return (
    <>
      {/* The field, the deals and the list read the address, so they stream in after the static shell. */}
      <AppHeader
        title={
          <Suspense fallback={<PlaceHeading />}>
            <AddressPlaceHeading query={query} />
          </Suspense>
        }
        search={
          <Suspense fallback={<SearchField />}>
            <AddressSearchField query={query} />
          </Suspense>
        }
        account={
          <Suspense>
            <HomeAccount query={query} />
          </Suspense>
        }
        sticky={{
          search: (
            <Suspense fallback={<SearchField id="offer-search-sticky" />}>
              <AddressSearchField query={query} id="offer-search-sticky" />
            </Suspense>
          ),
          account: (
            <Suspense>
              <HomeAccount query={query} />
            </Suspense>
          ),
        }}
      >
        <Suspense>
          <TonightDeals query={query} />
        </Suspense>
      </AppHeader>
      <main className={cn(contentWidth, "flex-1")}>
        <Suspense fallback={<BrandLoader />}>
          <HomeContent query={query} />
        </Suspense>
      </main>
    </>
  );
}

async function AddressPlaceHeading({ query }: { query: Promise<HomeQuery> }) {
  return <PlaceHeading query={await query} />;
}

async function HomeAccount({ query }: { query: Promise<HomeQuery> }) {
  return <AccountAction returnTo={homePath(await query)} />;
}

async function AddressSearchField({ query, id }: { query: Promise<HomeQuery>; id?: string }) {
  const { q, near, place } = await query;
  return <SearchField value={q} near={near} place={place} id={id} />;
}
