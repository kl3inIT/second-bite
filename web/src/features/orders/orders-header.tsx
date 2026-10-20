import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { PlaceHeading } from "@/features/home/place-heading";
import { SearchField } from "@/features/home/search-field";
import { AccountAction } from "@/features/identity/account-action";

// The customer header on the order pages, as on the home (Figma W1–W7): the place, the search,
// the account and the language. The page's own title is its heading, so the place is not.
export function OrdersHeader({ returnTo }: { returnTo: string }) {
  return (
    <AppHeader
      title={<PlaceHeading asHeading={false} />}
      search={<SearchField id="order-search" />}
      account={
        <Suspense>
          <AccountAction returnTo={returnTo} />
        </Suspense>
      }
    />
  );
}

/** What stands for the header while a page whose address is only known at request time streams it in. */
export function OrdersHeaderFallback() {
  return <div aria-hidden className="h-30 rounded-b-3xl bg-header lg:h-18" />;
}
