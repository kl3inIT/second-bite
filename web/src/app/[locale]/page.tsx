import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

import { AppHeader } from "@/components/app-header";
import { HomeContent } from "@/features/home/home-content";
import { readHomeQuery, type HomeQuery } from "@/features/home/home-query";
import { SearchField } from "@/features/home/search-field";

// The customer home: tonight's offers at Tasco Mall, with no landing page in front (SEC-23), drawn as the
// Figma home (Secondbite › 1b · Trang chủ).
export default function Home({ searchParams }: PageProps<"/[locale]">) {
  const t = useTranslations("Home");
  const query = searchParams.then(readHomeQuery);

  return (
    <>
      <AppHeader>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-h2">{t("title")}</h1>
          <p className="flex">
            <span className="inline-flex items-center gap-1 rounded-full bg-shell-raised px-2.5 py-1.5 text-caption font-semibold text-shell-raised-foreground">
              <MapPinIcon aria-hidden className="size-3.5 text-highlight" />
              <span className="sr-only">{t("placeLabel")}: </span>
              {t("place")}
            </span>
          </p>
        </div>
        {/* The field and the list read the address, so they stream in after the static shell. */}
        <Suspense fallback={<SearchField />}>
          <AddressSearchField query={query} />
        </Suspense>
      </AppHeader>
      <main className="mx-auto w-full max-w-5xl flex-1">
        <Suspense>
          <HomeContent query={query} />
        </Suspense>
      </main>
    </>
  );
}

async function AddressSearchField({ query }: { query: Promise<HomeQuery> }) {
  const { q } = await query;
  return <SearchField value={q} />;
}
