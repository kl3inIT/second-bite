import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { BackButton } from "@/components/back-button";
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
      <header className="bg-header text-header-foreground">
        <div className="mx-auto flex h-16 w-full max-w-xl items-center gap-3 px-4">
          <BackButton fallback="/" />
          <h1 className="text-bar-title">{t("title")}</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <Checkout />
      </main>
    </>
  );
}
