import { Suspense } from "react";

import { StoreBottomNav } from "@/features/seller/store-bottom-nav";
import { StoreHeader } from "@/features/seller/store-header";
import { StorePushedBar } from "@/features/seller/store-pushed-bar";

// The store's pages (SEC-57, Figma Q1 to Q4): under the header with the four tabs and the store's name. On a
// phone (SEC-79) the tabs are the bottom bar, and the page is a pale sheet rising over the foot of the header: the
// first line of a tab, its title row, is pulled up into the blue (the header keeps the room), and the sheet starts
// below it. A pushed screen (a dish form) keeps the plain page.
export default function StoreLayout({
  children,
  params,
}: LayoutProps<"/[locale]/stores/[sellerId]">) {
  // The address's parameter is runtime data, so it is read inside Suspense, where it streams in.
  const sellerId = params.then((p) => p.sellerId);

  return (
    <div className="group/store contents">
      <Suspense fallback={null}>
        <StorePushedBar />
      </Suspense>
      <Suspense fallback={<header aria-hidden className="h-16 rounded-b-3xl bg-header" />}>
        <StoreHeader sellerId={sellerId} />
      </Suspense>
      <main className="relative isolate mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 pt-2 pb-14 max-md:-mt-25 max-md:pt-0 group-has-[[data-pushed]]/store:max-md:mt-0 group-has-[[data-pushed]]/store:max-md:pt-2 max-md:before:absolute max-md:before:inset-x-0 max-md:before:top-19 max-md:before:bottom-0 max-md:before:-z-10 max-md:before:rounded-t-3xl max-md:before:bg-background group-has-[[data-pushed]]/store:max-md:before:hidden md:pt-6 xl:max-w-300">
        {children}
      </main>
      <Suspense fallback={null}>
        <StoreBottomNav />
      </Suspense>
    </div>
  );
}
