import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { PageBar } from "@/components/page-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { FavouriteSellers } from "@/features/favourites/favourite-sellers";
import { listOffers } from "@/features/offers/list-offers";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Favourites");
  return { title: `${t("title")} · Second Bite`, robots: { index: false } };
}

// "Yêu thích" (SEC-109, Figma K9, K9a): the sellers this person follows. A tab of its own, reached from the
// bottom bar, so its blue bar has no back button. Which sellers are followed is known in the browser, kept there
// or by the account, so the list is drawn there over tonight's offers.
export default async function FavouritesPage() {
  const t = await getTranslations("Favourites");

  return (
    <>
      <PageBar title={t("title")} />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-3 px-4 py-4 md:max-w-3xl">
        <Suspense fallback={<Skeleton shape="card" className="h-58" />}>
          <Favourites />
        </Suspense>
      </main>
    </>
  );
}

async function Favourites() {
  return <FavouriteSellers offers={await listOffers({})} />;
}
