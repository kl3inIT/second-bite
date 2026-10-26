import { useFormatter, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import type { OfferSummary } from "./offer";
import { sellerRating } from "./proposed";
import { SellerDish } from "./seller-dish";
import { SellerLogo } from "./seller-logo";

const ONE_DECIMAL = { minimumFractionDigits: 1, maximumFractionDigits: 1 } as const;

// One seller's dishes in the search's list (Figma K2b, WK2b "khối quán"), as Careem lists them: the seller's logo,
// name, rating, place and tonight's window, with the way to their page, over the rows of their page (K4) on white
// cards, each with its − and +, as Uber Eats lists a menu. From 768px the cards go two across.
export function SellerDishes({
  seller,
  offers,
}: {
  seller: OfferSummary["seller"];
  offers: readonly OfferSummary[];
}) {
  const t = useTranslations("Search");
  const card = useTranslations("OfferCard");
  const sellerText = useTranslations("Seller");
  const format = useFormatter();
  const [lead] = offers;
  if (!lead) return null;
  const rating = sellerRating(lead);
  const rated = rating === undefined ? undefined : format.number(rating, ONE_DECIMAL);
  const opens = Math.min(...offers.map(({ windowStart }) => Date.parse(windowStart)));
  const closes = Math.max(...offers.map(({ windowEnd }) => Date.parse(windowEnd)));

  return (
    <section aria-label={seller.name} className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2.5">
        <SellerLogo seller={seller} size="sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 className="truncate text-title text-foreground">{seller.name}</h2>
          <p className="truncate text-label text-muted-foreground">
            {rated && (
              <>
                <span aria-hidden>{rated} ★</span>
                <span className="sr-only">{card("rating", { rating: rated })}</span> ·{" "}
              </>
            )}
            {seller.address} ·{" "}
            {sellerText("window", {
              from: format.dateTime(opens, "time"),
              until: format.dateTime(closes, "time"),
            })}
          </p>
        </div>
        <Link
          href={`/sellers/${seller.id}`}
          aria-label={t("viewSellerNamed", { seller: seller.name })}
          className="-mr-2 flex min-h-11 shrink-0 items-center rounded-lg px-2 text-label-strong text-link focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
        >
          {t("viewSeller")}
        </Link>
      </div>
      <ul className="grid gap-3 md:grid-cols-2 md:gap-x-5 md:gap-y-4">
        {offers.map((offer) => (
          <li
            key={offer.id}
            className="min-w-0 rounded-2xl bg-card py-2.5 pr-3 pl-2.5 shadow-card md:py-3 md:pr-4 md:pl-3"
          >
            <SellerDish offer={offer} focused={false} compact />
          </li>
        ))}
      </ul>
    </section>
  );
}
