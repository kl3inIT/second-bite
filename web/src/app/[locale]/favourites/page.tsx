import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { PageBar } from "@/components/page-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { FavouriteSellers } from "@/features/favourites/favourite-sellers";
import { listOffers } from "@/features/offers/list-offers";
import { TonightOffers } from "@/features/offers/tonight-offers";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Favourites");
  return { title: t("title"), robots: { index: false } };
}

// "Yêu thích" (SEC-109, Figma K9, K9a): the sellers this person follows. A tab of its own, reached from the
// bottom bar, so its blue bar has no back button. Which sellers are followed is known in the browser, kept there
// or by the account, so the list is drawn there over tonight's offers.
export default async function FavouritesPage() {
  const t = await getTranslations("Favourites");

  return (
    <>
      <PageBar title={t("title")} returnTo="/favourites" />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-3 px-4 py-4 md:max-w-300 md:gap-6 md:px-8 md:pt-8 md:pb-14 lg:px-4">
        <div className="hidden flex-col gap-1 md:flex">
          <h1 className="text-page-title text-foreground">{t("title")}</h1>
          <p className="text-body text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Suspense fallback={<Skeleton shape="card" className="h-58" />}>
          <Favourites />
        </Suspense>
      </main>
    </>
  );
}

// The followed sellers take two thirds beside tonight's offers on a desktop (Figma WK9).
async function Favourites() {
  const offers = await listOffers({});

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-6">
      <div className="flex flex-col gap-3 md:gap-4 lg:min-w-0 lg:flex-1">
        <FavouriteSellers offers={offers} />
      </div>
      <TonightOffers offers={offers} className="lg:w-100 lg:shrink-0" />
    </div>
  );
}
