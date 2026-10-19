import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { HomeContent, HomeContentSkeleton } from "@/features/home/home-content";
import { homePath, readHomeQuery, type HomeQuery } from "@/features/home/home-query";
import { AccountAction } from "@/features/identity/account-action";
import { PlaceHeading } from "@/features/home/place-heading";
import { SearchField } from "@/features/home/search-field";
import { TonightDeals } from "@/features/home/tonight-deals";

// The customer home: tonight's offers at Tasco Mall, with no landing page in front (SEC-23), drawn as the
// Figma home (Secondbite › Mobile v2 › 1 · Trang chủ · Header mới).
export default function Home({ searchParams }: PageProps<"/[locale]">) {
  const query = searchParams.then(readHomeQuery);

  return (
    <>
      {/* The field, the deals and the list read the address, so they stream in after the static shell. */}
      <AppHeader
        title={<PlaceHeading />}
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
      >
        <Suspense>
          <TonightDeals query={query} />
        </Suspense>
      </AppHeader>
      <main className="mx-auto w-full max-w-5xl flex-1 pb-20 md:pb-0">
        <Suspense fallback={<HomeContentSkeleton />}>
          <HomeContent query={query} />
        </Suspense>
      </main>
      <BottomNav />
    </>
  );
}

async function HomeAccount({ query }: { query: Promise<HomeQuery> }) {
  return <AccountAction returnTo={homePath(await query)} />;
}

async function AddressSearchField({ query }: { query: Promise<HomeQuery> }) {
  const { q } = await query;
  return <SearchField value={q} />;
}
