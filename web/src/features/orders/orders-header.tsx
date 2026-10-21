import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { PlaceHeading } from "@/features/home/place-heading";
import { SearchField } from "@/features/home/search-field";
import { AccountAction } from "@/features/identity/account-action";

// The customer header on the order pages, as on the home (Figma W1–W7): the place, the search,
// the account and the language. The page's own title is its heading, so the place is not. The header is a static
// shell, so an address known only at request time (the order's) streams in with the account alone, never blanking
// the header.
export function OrdersHeader({ returnTo }: { returnTo: string | Promise<string> }) {
  return (
    <AppHeader
      title={<PlaceHeading asHeading={false} />}
      search={<SearchField id="order-search" />}
      account={
        <Suspense>
          <Account returnTo={returnTo} />
        </Suspense>
      }
    />
  );
}

async function Account({ returnTo }: { returnTo: string | Promise<string> }) {
  return <AccountAction returnTo={await returnTo} />;
}
