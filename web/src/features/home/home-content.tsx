import { StoreIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/section-header";
import { listOffers } from "@/features/offers/list-offers";
import { closingFirst, inShowingOrder } from "@/features/offers/offer";
import { OfferList } from "@/features/offers/offer-list";
import { OfferRow } from "@/features/offers/offer-row";
import { Link } from "@/i18n/navigation";

import { homeSearch, type HomeQuery } from "./home-query";
import { HowItWorks } from "./how-it-works";
import { IntroStrip } from "./intro-strip";
import { KindPicker } from "./kind-picker";

const CLOSING_COUNT = 6;
const seeAllClass = "-my-3 py-3 text-body-sm-strong text-link underline-offset-4 hover:underline";

// Everything under the header for what the address asks (Figma Mobile v3 content). Without a filter: the
// kinds, the windows closing first, then every offer as large cards. With one: the kinds and the matching
// offers. Around the person's own place with nothing posted: what Tasco Mall has instead (Figma K1e).
export async function HomeContent({ query: pending }: { query: Promise<HomeQuery> }) {
  const query = await pending;
  const [t, offers] = await Promise.all([
    getTranslations("Home"),
    listOffers({ q: query.q, kind: query.kind, collectNow: query.now, near: query.near }),
  ]);
  const filtered = Boolean(query.q || query.kind || query.now);
  const closing = filtered ? [] : closingFirst(offers).slice(0, CLOSING_COUNT);

  return (
    <div className="flex flex-col gap-3 pt-3 pb-4">
      <KindPicker query={query} />
      {!filtered && !query.near && (
        <div className="px-4">
          <div className="lg:hidden">
            <IntroStrip />
          </div>
          <HowItWorks />
        </div>
      )}
      {query.near && !filtered && offers.length === 0 ? (
        <NearbyEmpty />
      ) : (
        <>
          {closing.length > 0 && (
            <section aria-labelledby="closing-soon" className="flex flex-col gap-3">
              <SectionHeader
                id="closing-soon"
                title={t("closingSoon")}
                action={<SeeAll near={query.near} label={t("seeAll")} />}
              />
              <OfferRow label={t("closingSoon")} offers={closing} />
            </section>
          )}
          <section aria-labelledby="all-offers" className="flex flex-col gap-3">
            <SectionHeader
              id="all-offers"
              title={filtered ? t("results") : t("allOffers")}
              action={
                !filtered && offers.length > 0 && <SeeAll near={query.near} label={t("seeAll")} />
              }
            />
            {offers.length > 0 ? (
              <OfferList offers={inShowingOrder(offers)} />
            ) : (
              <NothingFound filtered={filtered} near={query.near} />
            )}
          </section>
        </>
      )}
    </div>
  );
}

/** "Xem tất cả": every dish, by seller, on the search page (Figma K1f). */
function SeeAll({ near, label }: { near?: string; label: string }) {
  return (
    <Link href={{ pathname: "/search", query: homeSearch({ near }) }} className={seeAllClass}>
      {label}
    </Link>
  );
}

async function NothingFound({ filtered, near }: { filtered: boolean; near?: string }) {
  const t = await getTranslations("Home");

  return (
    <Empty surface="card" className="mx-4 w-auto">
      <EmptyHeader>
        <EmptyTitle>{filtered ? t("emptyFiltered") : t("empty")}</EmptyTitle>
      </EmptyHeader>
      {filtered && (
        <EmptyContent>
          <Link
            href={{ pathname: "/", query: homeSearch({ near }) }}
            className={buttonVariants({ variant: "secondary" })}
          >
            {t("showAll")}
          </Link>
        </EmptyContent>
      )}
    </Empty>
  );
}

// Nothing posted around the person's own place (Figma K1e): say so, offer Tasco Mall, and show what it has.
async function NearbyEmpty() {
  const [t, mall] = await Promise.all([getTranslations("Home"), listOffers({})]);
  const onSale = closingFirst(mall);

  return (
    <>
      <Empty surface="card" className="mx-4 w-auto">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <StoreIcon aria-hidden />
          </EmptyMedia>
          <EmptyTitle>{t("nearbyEmpty")}</EmptyTitle>
          <EmptyDescription>{t("nearbyEmptyHint")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            {t("seeMall")}
          </Link>
        </EmptyContent>
      </Empty>
      {onSale.length > 0 && (
        <section aria-labelledby="mall-offers" className="flex flex-col gap-3">
          <SectionHeader
            id="mall-offers"
            title={t("mallOffers")}
            action={<SeeAll label={t("seeAll")} />}
          />
          <OfferRow label={t("mallOffers")} offers={onSale} />
        </section>
      )}
    </>
  );
}

/** What the list looks like while it loads: the kinds' row and a grid of cards in their final sizes. */
export function HomeContentSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-3 px-4 pt-1 pb-4">
      <div className="flex gap-2.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} shape="circle" className="size-15 shrink-0" />
        ))}
      </div>
      <Skeleton className="h-7 w-48" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} shape="card" className="h-52" />
        ))}
      </div>
    </div>
  );
}
