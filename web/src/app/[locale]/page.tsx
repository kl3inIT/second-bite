import { useTranslations } from "next-intl";
import { Suspense } from "react";

import { TopBar } from "@/components/top-bar";
import { readHomeQuery } from "@/features/home/home-query";
import { IntroStrip } from "@/features/home/intro-strip";
import { OfferResults } from "@/features/home/offer-results";

// The customer home: tonight's offers at Tasco Mall, with no landing page in front (SEC-23).
export default function Home({ searchParams }: PageProps<"/[locale]">) {
  const t = useTranslations("Home");

  return (
    <>
      <TopBar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4">
        <IntroStrip />
        <h1 className="sr-only">{t("title")}</h1>
        {/* The list reads the address, so it streams in after the static shell. */}
        <Suspense>
          <OfferResults query={searchParams.then(readHomeQuery)} />
        </Suspense>
      </main>
    </>
  );
}
