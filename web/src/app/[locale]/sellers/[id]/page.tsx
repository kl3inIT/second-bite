import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
  return { title: `${first?.seller.name ?? t("nothing")} · Second Bite` };
}

// A seller's dishes tonight (Figma K4b), from "Xem quán"; `?kind=` opens one tab, `near` keeps the distance.
// The seller's own record is for their people, so the page is built from their offers.
export default async function SellerRoute({
  params,
  searchParams,
}: PageProps<"/[locale]/sellers/[id]">) {
  const [{ id }, { near, kind }] = await Promise.all([params, searchParams.then(readHomeQuery)]);
  const offers = inShowingOrder(await listOffers({ sellerId: id, near }));

  return <SellerPage offers={offers} kind={kind} near={near} />;
}
