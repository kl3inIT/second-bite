import { getFormatter, getTranslations } from "next-intl/server";
import Image from "next/image";

import { DishLink } from "@/features/offers/dish-link";
import { listOffers } from "@/features/offers/list-offers";
import { biggestDiscountFirst } from "@/features/offers/offer";
import { Marquee } from "@/components/marquee";

import bowl from "./tonight-bowl.webp";
import type { HomeQuery } from "./home-query";

// Tonight's biggest discounts; when they do not fit the card's width, phone or desktop, the row runs on its own.
const TICKET_COUNT = 8;

// The bottom of the header without a filter (Figma Mobile v3 deal card): the biggest discounts tonight as
// coupons on the deep blue deal card (Figma 105:2666): the discount, a dashed cut
// with a notch at each edge, then the seller. Every figure comes from the offers; with nothing to order, it
// does not show. A bowl of food sits in its corner (Figma bát món).
// From 1024px it is Figma WK1 "hero ưu đãi": one row, kept on the deep blue to stand out from the header, the title large with a line under it, the
// biggest discount, then the tickets, each with the time it is collected from; the bowl stays on the phone.
export async function TonightDeals({ query: pending }: { query: Promise<HomeQuery> }) {
  const query = await pending;
  // Tonight's deals are Tasco Mall's, so they are not shown around the person's own place (Figma K1e).
  if (query.q || query.kind || query.now || query.near) return null;

  const [t, format, offers] = await Promise.all([
    getTranslations("Home"),
    getFormatter(),
    listOffers({}),
  ]);
  const tickets = biggestDiscountFirst(offers).slice(0, TICKET_COUNT);
  if (tickets.length === 0) return null;

  return (
    <section
      aria-labelledby="tonight-deals"
      className="relative flex flex-col gap-2.5 overflow-hidden rounded-2xl bg-deal px-3.5 pt-3.5 pb-3 text-deal-foreground lg:flex-row lg:items-center lg:gap-7 lg:rounded-3xl lg:py-7 lg:pr-7 lg:pl-8"
    >
      <Image
        src={bowl}
        alt=""
        sizes="60px"
        className="absolute top-1.5 right-3 size-15 lg:hidden"
      />
      <div className="flex flex-col gap-2 lg:max-w-md lg:min-w-0 lg:flex-1">
        <h2
          id="tonight-deals"
          className="pr-16 text-body-sm-strong text-fresh lg:pr-0 lg:font-display lg:text-page-title lg:font-bold lg:text-deal-foreground"
        >
          {t("dealsTitle")}
        </h2>
        <p className="hidden text-body-sm text-inverse-muted lg:block">
          {t("dealsLine", { percent: tickets[0].discountPercent })}
        </p>
      </div>
      <div className="flex items-center gap-2.5 lg:contents">
        <p className="flex shrink-0 flex-col">
          <span className="text-label-strong text-deal-foreground uppercase">{t("upTo")}</span>
          <span className="font-display text-display text-fresh">
            {t("upToPercent", { percent: tickets[0].discountPercent })}
          </span>
        </p>
        <div className="flex min-w-0 flex-1 sm:mr-16 lg:mr-0">
          <Marquee label={t("dealsTitle")} count={tickets.length}>
            {tickets.map((offer) => (
              <li
                key={offer.id}
                className="relative flex min-h-18 w-36 shrink-0 flex-col justify-center gap-1.5 rounded-xl bg-card px-2 py-1.5 text-card-foreground sm:w-44 lg:h-auto lg:gap-1 lg:px-3 lg:py-2.5"
              >
                <span className="font-display text-price-lg text-sale">
                  <span aria-hidden>{t("ticketDiscount", { percent: offer.discountPercent })}</span>
                  <span className="sr-only">
                    {t("ticketDiscountLabel", { percent: offer.discountPercent })}
                  </span>
                </span>
                <hr className="border-t border-dashed border-border" />
                <span className="truncate text-body-sm-strong">
                  <DishLink offerId={offer.id}>{offer.seller.name}</DishLink>
                </span>
                <span className="hidden text-label text-muted-foreground lg:block">
                  {t("ticketFrom", { time: format.dateTime(new Date(offer.windowStart), "time") })}
                </span>
                <span
                  aria-hidden
                  className="absolute top-8 -left-1.25 size-2.5 rounded-full bg-deal"
                />
                <span
                  aria-hidden
                  className="absolute top-8 -right-1.25 size-2.5 rounded-full bg-deal"
                />
              </li>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
