import { getTranslations } from "next-intl/server";

import { ScrollRow } from "@/components/scroll-row";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/section-header";
import { listOffers } from "@/features/offers/list-offers";
import { closingFirst, inShowingOrder, type OfferSummary } from "@/features/offers/offer";
import { OfferCard } from "@/features/offers/offer-card";
import { OfferTile } from "@/features/offers/offer-tile";
import { Link } from "@/i18n/navigation";

import type { HomeQuery } from "./home-query";
import { HowItWorks } from "./how-it-works";
import { IntroStrip } from "./intro-strip";
import { KindPicker } from "./kind-picker";

const CLOSING_COUNT = 6;

// Everything under the header for what the address asks (Figma content). Without a filter: the kinds, the
// windows closing first, then every offer. With one: the kinds and the matching offers.
export async function HomeContent({ query: pending }: { query: Promise<HomeQuery> }) {
  const query = await pending;
  const [t, offers] = await Promise.all([
    getTranslations("Home"),
    listOffers({ q: query.q, kind: query.kind, collectNow: query.now }),
  ]);
  const filtered = Boolean(query.q || query.kind || query.now);
  const closing = filtered ? [] : closingFirst(offers).slice(0, CLOSING_COUNT);

  return (
    <div className="flex flex-col gap-3 pt-3 pb-4">
      <KindPicker query={query} />
      {!filtered && (
        <div className="px-4">
          <div className="lg:hidden">
            <IntroStrip />
          </div>
          <HowItWorks />
        </div>
      )}
      {closing.length > 0 && (
        <section aria-labelledby="closing-soon" className="flex flex-col gap-3">
          <SectionHeader
            id="closing-soon"
            title={t("closingSoon")}
            action={
              <a
                href="#all-offers"
                className="-my-3 py-3 text-body-sm-strong text-primary underline-offset-4 hover:underline"
              >
                {t("seeAll")}
              </a>
            }
          />
          {/* Sideways on a phone; a grid on a wide screen, where a row would leave most of it empty. */}
          <ScrollRow
            label={t("closingSoon")}
            className="lg:grid lg:snap-none lg:grid-cols-3 lg:overflow-visible lg:pb-0 xl:grid-cols-4"
          >
            {closing.map((offer) => (
              <li key={offer.id} className="flex shrink-0 snap-start lg:shrink xl:nth-[n+5]:hidden">
                <OfferCard offer={offer} />
              </li>
            ))}
          </ScrollRow>
        </section>
      )}
      <section aria-labelledby="all-offers" className="flex flex-col gap-3">
        <SectionHeader id="all-offers" title={filtered ? t("results") : t("allOffers")} />
        <OfferGrid offers={offers} filtered={filtered} />
      </section>
    </div>
  );
}

async function OfferGrid({ offers, filtered }: { offers: OfferSummary[]; filtered: boolean }) {
  const t = await getTranslations("Home");

  if (offers.length === 0) {
    return (
      <Empty surface="card" className="mx-4 w-auto">
        <EmptyHeader>
          <EmptyTitle>{filtered ? t("emptyFiltered") : t("empty")}</EmptyTitle>
        </EmptyHeader>
        {filtered && (
          <EmptyContent>
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>
              {t("showAll")}
            </Link>
          </EmptyContent>
        )}
      </Empty>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 xl:grid-cols-4">
      {inShowingOrder(offers).map((offer) => (
        <li key={offer.id} className="flex">
          <OfferTile offer={offer} />
        </li>
      ))}
    </ul>
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} shape="card" className="h-60" />
        ))}
      </div>
    </div>
  );
}
