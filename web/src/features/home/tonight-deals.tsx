import { getTranslations } from "next-intl/server";
import Image from "next/image";

import { listOffers } from "@/features/offers/list-offers";
import { biggestDiscountFirst } from "@/features/offers/offer";
import { cn } from "@/lib/utils";

import bowl from "./tonight-bowl.webp";
import type { HomeQuery } from "./home-query";

// Two on a phone; a wider screen shows more of tonight's biggest discounts instead of an empty card.
const TICKET_COUNT = 4;

// The bottom of the header without a filter (Figma Mobile v3 deal card): the biggest discounts tonight as
// coupons on the deep blue deal card (Figma 105:2666): the discount, a dashed cut
// with a notch at each edge, then the seller. Every figure comes from the offers; with nothing to order, it
// does not show. A bowl of food sits in its corner (Figma bát món).
export async function TonightDeals({ query: pending }: { query: Promise<HomeQuery> }) {
  const query = await pending;
  // Tonight's deals are Tasco Mall's, so they are not shown around the person's own place (Figma K1e).
  if (query.q || query.kind || query.now || query.near) return null;

  const [t, offers] = await Promise.all([getTranslations("Home"), listOffers({})]);
  const tickets = biggestDiscountFirst(offers).slice(0, TICKET_COUNT);
  if (tickets.length === 0) return null;

  return (
    <section
      aria-labelledby="tonight-deals"
      className="relative flex flex-col gap-2.5 overflow-hidden rounded-2xl bg-deal px-3.5 pt-3.5 pb-3 text-deal-foreground"
    >
      <Image src={bowl} alt="" sizes="60px" className="absolute top-1.5 right-3 size-15" />
      <h2 id="tonight-deals" className="text-body-sm-strong text-fresh">
        {t("dealsTitle")}
      </h2>
      <div className="flex items-center gap-2.5">
        <p className="flex shrink-0 flex-col">
          <span className="text-label-strong text-deal-foreground uppercase">{t("upTo")}</span>
          <span className="font-display text-display text-fresh">
            {t("upToPercent", { percent: tickets[0].discountPercent })}
          </span>
        </p>
        <ul className="flex min-w-0 flex-1 gap-2 sm:pr-16 lg:gap-3">
          {tickets.map((offer, index) => (
            <li
              key={offer.id}
              className={cn(
                "relative flex h-18 min-w-0 flex-1 flex-col justify-center gap-1.5 rounded-xl bg-card px-2 text-card-foreground sm:max-w-52 lg:max-w-60 lg:px-3",
                index === 2 && "hidden sm:flex",
                index === 3 && "hidden lg:flex",
              )}
            >
              <span className="font-display text-price-lg text-sale">
                <span aria-hidden>{t("ticketDiscount", { percent: offer.discountPercent })}</span>
                <span className="sr-only">
                  {t("ticketDiscountLabel", { percent: offer.discountPercent })}
                </span>
              </span>
              <hr className="border-t border-dashed border-border" />
              <span className="truncate text-body-sm-strong">{offer.seller.name}</span>
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
        </ul>
      </div>
    </section>
  );
}
