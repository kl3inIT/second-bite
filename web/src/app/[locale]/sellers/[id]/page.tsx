import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { BrandLoader } from "@/components/brand-loader";
import { CustomerHeader } from "@/components/customer-header";

import { readHomeQuery } from "@/features/home/home-query";
import { listOffers } from "@/features/offers/list-offers";
import { inShowingOrder } from "@/features/offers/offer";
import { SellerPage } from "@/features/offers/seller-page";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[locale]/sellers/[id]">): Promise<Metadata> {
  const [{ id }, { near }, t] = await Promise.all([
    params,
    searchParams.then(readHomeQuery),
    getTranslations("Seller"),
  ]);
  const [first] = await listOffers({ sellerId: id, near });
  return { title: first?.seller.name ?? t("nothing") };
}

// A seller's dishes tonight (Figma K4b), from "Xem quán" or a dish (K4); `?kind=` opens one tab, `?q=` searches
// their dishes, `?at=` tints the dish a link led to, `near` keeps the distance.
// The seller's own record is for their people, so the page is built from their offers. The address is known only
// at request time, so the page streams in.
export default function SellerRoute(props: PageProps<"/[locale]/sellers/[id]">) {
  return (
    <Suspense fallback={<BrandLoader />}>
      <Seller {...props} />
    </Suspense>
  );
}

async function Seller({ params, searchParams }: PageProps<"/[locale]/sellers/[id]">) {
  const [{ id }, search] = await Promise.all([params, searchParams]);
  const { near, kind, q } = readHomeQuery(search);
  const offers = inShowingOrder(await listOffers({ sellerId: id, near }));
  const at = typeof search.at === "string" ? search.at : undefined;

  return (
    <>
      <CustomerHeader returnTo={`/sellers/${id}`} near={near} />
      <SellerPage offers={offers} kind={kind} near={near} at={at} q={q} />
    </>
  );
}
