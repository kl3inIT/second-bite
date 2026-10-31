import { Suspense } from "react";

import { PlaceHeading } from "@/features/home/place-heading";
import { AccountAction } from "@/features/identity/account-action";
import { listOffers } from "@/features/offers/list-offers";
import { kindsByCount } from "@/features/offers/offer";
import { SearchBar } from "@/features/search/search-bar";

import { AppHeader } from "./app-header";

// The customer header of a page whose phone layout has its own top (Figma WK3, D4): from `md` the wordmark, the
// place, the search field and the account, over the page's pale ground. `returnTo` is where the sign-in leads back to.
export function CustomerHeader({
  returnTo,
  near,
  place,
}: {
  returnTo: string;
  near?: string;
  place?: string;
}) {
  return (
    <div className="max-md:hidden">
      <AppHeader
        title={<PlaceHeading query={{ near, place }} asHeading={false} />}
        search={
          <Suspense fallback={<SearchBar desktop />}>
            <HeaderSearch near={near} place={place} />
          </Suspense>
        }
        account={
          <Suspense>
            <AccountAction returnTo={returnTo} />
          </Suspense>
        }
      />
    </div>
  );
}

async function HeaderSearch({ near, place }: { near?: string; place?: string }) {
  // The suggestions are a convenience: without the offers the field still searches.
  const offers = await listOffers({ near }).catch(() => []);
  return <SearchBar near={near} place={place} kinds={kindsByCount(offers)} desktop />;
}
