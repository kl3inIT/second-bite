import { SlidersHorizontalIcon, StoreIcon } from "lucide-react";
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
import { SectionHeader } from "@/components/section-header";
import { listAnnouncements, listOffers } from "@/features/offers/list-offers";
import { closingFirst, inShowingOrder } from "@/features/offers/offer";
import { OfferList } from "@/features/offers/offer-list";
import { OfferRow } from "@/features/offers/offer-row";
import { SearchFilters } from "@/features/search/search-filters";
import { Link } from "@/i18n/navigation";

import { homeSearch, type HomeQuery } from "./home-query";
import { HowItWorks } from "./how-it-works";
import { KindPicker } from "./kind-picker";
import { RecommendedSection, UpcomingSection } from "./tonight-rows";

const CLOSING_COUNT = 6;
const seeAllClass = "-my-3 py-3 text-body-sm-strong text-link underline-offset-4 hover:underline";

// Everything under the header for what the address asks (Figma Mobile v3 content). Without a filter: the
// kinds, the windows closing first, what is coming tonight, the recommendations, then every offer in a grid
// under the search's chips (Figma K1, K1b). With one: the kinds and the matching offers. Around the person's
// own place with nothing posted: what is coming and what Tasco Mall has instead (Figma K1e).
export async function HomeContent({ query: pending }: { query: Promise<HomeQuery> }) {
  const query = await pending;
  const filters = { q: query.q, kind: query.kind, collectNow: query.now, near: query.near };
  const [t, offers, announcements] = await Promise.all([
    getTranslations("Home"),
    listOffers(filters),
    listAnnouncements(filters),
  ]);
  const filtered = Boolean(query.q || query.kind || query.now);
  const closing = filtered ? [] : closingFirst(offers).slice(0, CLOSING_COUNT);

  return (
    <div className="flex flex-col gap-3 pb-4">
      <KindPicker query={query} />
      {!filtered && !query.near && (
        <div className="px-4">
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
          {!filtered && (
            <>
              <UpcomingSection announcements={announcements} />
              <RecommendedSection offers={offers} />
            </>
          )}
          <section aria-labelledby="all-offers" className="flex flex-col gap-3">
            <SectionHeader id="all-offers" title={filtered ? t("results") : t("allOffers")} />
            {!filtered && offers.length > 1 && (
              <SearchFilters
                query={{ near: query.near }}
                raised
                before={<FiltersLink near={query.near} label={t("filters")} />}
              />
            )}
            {offers.length > 0 ? (
              <OfferList offers={inShowingOrder(offers)} compact />
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

/** The chips' leading button: the search, where every filter is (Figma K1b "nút lọc"). */
function FiltersLink({ near, label }: { near?: string; label: string }) {
  return (
    <Link
      href={{ pathname: "/search", query: homeSearch({ near }) }}
      aria-label={label}
      className={buttonVariants({
        variant: "chip",
        size: "chip",
        className: "bg-card ring-1 ring-secondary ring-inset",
      })}
    >
      <SlidersHorizontalIcon aria-hidden className="size-4.5 text-primary" />
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
  // What Tasco Mall expects tonight, since nothing around the person's place is expected either.
  const [t, mall, mallAnnouncements] = await Promise.all([
    getTranslations("Home"),
    listOffers({}),
    listAnnouncements({}),
  ]);
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
          <Link
            href="/"
            className={buttonVariants({ variant: "secondary", size: "lg", className: "w-full" })}
          >
            {t("seeMall")}
          </Link>
        </EmptyContent>
      </Empty>
      <UpcomingSection announcements={mallAnnouncements} />
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
