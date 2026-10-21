import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageBar } from "@/components/page-bar";
import { Checkout } from "@/features/cart/checkout";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Cart");
  return { title: `${t("title")} · Second Bite`, robots: { index: false } };
}

// The cart's confirmation (Figma K5) under the blue top bar with its white back button. The cart lives in
// this browser (SEC-49 decision 7), so the page draws it on the client.
export default async function CartPage() {
  const t = await getTranslations("Cart");

  return (
    <>
      <PageBar title={t("title")} back="/" returnTo="/cart" />
      <main className="flex flex-1 flex-col">
        <Checkout />
      </main>
    </>
  );
}
