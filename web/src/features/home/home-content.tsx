import { getTranslations } from "next-intl/server";

import { Carousel } from "@/components/carousel";
import { ScrollRow } from "@/components/scroll-row";
import { SectionHeader } from "@/components/section-header";
import { listOffers } from "@/features/offers/list-offers";
import {
  closingFirst,
  inShowingOrder,
  openingFirst,
  type OfferSummary,
} from "@/features/offers/offer";
import { OfferBanner } from "@/features/offers/offer-banner";
import { OfferCard } from "@/features/offers/offer-card";
import { OfferTile } from "@/features/offers/offer-tile";
import { Link } from "@/i18n/navigation";

import type { HomeQuery } from "./home-query";
import { IntroStrip } from "./intro-strip";
import { KindPicker } from "./kind-picker";

const BANNER_COUNT = 3;
const CLOSING_COUNT = 6;

// Everything under the header for what the address asks (Figma content). Without a filter: banners for
// the windows opening first, the kinds, the windows closing first, then every offer. With one: the kinds
// and the matching offers.
export async function HomeContent({ query: pending }: { query: Promise<HomeQuery> }) {
  const query = await pending;
  const [t, offers] = await Promise.all([
    getTranslations("Home"),
    listOffers({ q: query.q, kind: query.kind, collectNow: query.now }),
  ]);
  const filtered = Boolean(query.q || query.kind || query.now);
  const banners = filtered ? [] : openingFirst(offers).slice(0, BANNER_COUNT);
  const closing = filtered ? [] : closingFirst(offers).slice(0, CLOSING_COUNT);

  return (
    <div className="flex flex-col gap-4.5 py-4">
      {banners.length > 0 && (
        <Carousel
          label={t("bannersLabel")}
          slideLabels={banners.map((_, index) =>
            t("slide", { position: index + 1, count: banners.length }),
          )}
        >
          {banners.map((offer) => (
            <OfferBanner key={offer.id} offer={offer} />
          ))}
        </Carousel>
      )}
      <KindPicker query={query} />
      {!filtered && (
        <div className="px-4">
          <IntroStrip />
        </div>
      )}
      {closing.length > 0 && (
        <section aria-labelledby="closing-soon" className="flex flex-col gap-4.5">
          <SectionHeader
            id="closing-soon"
            title={t("closingSoon")}
            action={
              <a
                href="#all-offers"
                className="-my-3 py-3 text-body-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                {t("seeAll")}
              </a>
            }
          />
          <ScrollRow label={t("closingSoon")}>
            {closing.map((offer) => (
              <li key={offer.id} className="flex shrink-0 snap-start">
                <OfferCard offer={offer} />
              </li>
            ))}
          </ScrollRow>
        </section>
      )}
      <section aria-labelledby="all-offers" className="flex flex-col gap-4.5">
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
      <div className="mx-4 flex flex-col items-start gap-3 rounded-2xl bg-card p-4 text-card-foreground">
        <p className="text-body">{filtered ? t("emptyFiltered") : t("empty")}</p>
        {filtered && (
          <Link href="/" className="text-body-sm font-semibold text-primary underline">
            {t("showAll")}
          </Link>
        )}
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4">
      {inShowingOrder(offers).map((offer) => (
        <li key={offer.id} className="flex">
          <OfferTile offer={offer} />
        </li>
      ))}
    </ul>
  );
}
