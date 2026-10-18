import { getTranslations } from "next-intl/server";

import { listOffers } from "@/features/offers/list-offers";
import { inShowingOrder } from "@/features/offers/offer";
import { OfferCard } from "@/features/offers/offer-card";
import { Link } from "@/i18n/navigation";

import type { HomeQuery } from "./home-query";
import { OfferFilters } from "./offer-filters";

// The filters and tonight's list for what the address asks (Figma Home › Filters, SectionTitle, Offers).
export async function OfferResults({ query: pending }: { query: Promise<HomeQuery> }) {
  const query = await pending;
  const [t, offers] = await Promise.all([
    getTranslations("Home"),
    listOffers({ q: query.q, kind: query.kind, collectNow: query.now }),
  ]);
  const filtered = Boolean(query.q || query.kind || query.now);

  return (
    <>
      <OfferFilters query={query} />
      <h2 className="text-headline text-foreground">{t("title")}</h2>
      {offers.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-xl bg-card p-4 text-card-foreground">
          <p className="text-body">{filtered ? t("emptyFiltered") : t("empty")}</p>
          {filtered && (
            <Link href="/" className="text-body-sm-strong text-primary underline">
              {t("showAll")}
            </Link>
          )}
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {inShowingOrder(offers).map((offer) => (
            <li key={offer.id} className="flex">
              <OfferCard offer={offer} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
