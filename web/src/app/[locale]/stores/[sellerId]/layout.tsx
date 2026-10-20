import { Suspense } from "react";

import { StoreHeader } from "@/features/seller/store-header";

// The store's pages (SEC-57, Figma Q1 to Q4): under the header with the four tabs and the store's name.
export default function StoreLayout({
  children,
  params,
}: LayoutProps<"/[locale]/stores/[sellerId]">) {
  // The address's parameter is runtime data, so it is read inside Suspense, where it streams in.
  const sellerId = params.then((p) => p.sellerId);

  return (
    <>
      <Suspense fallback={<header aria-hidden className="h-16 rounded-b-3xl bg-header" />}>
        <StoreHeader sellerId={sellerId} />
      </Suspense>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 pt-2 pb-14 md:pt-6 xl:max-w-300">
        {children}
      </main>
    </>
  );
}
