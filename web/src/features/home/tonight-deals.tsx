import { getFormatter, getTranslations } from "next-intl/server";

import { listOffers } from "@/features/offers/list-offers";
import { biggestDiscountFirst } from "@/features/offers/offer";

import type { HomeQuery } from "./home-query";

const TICKET_COUNT = 3;

// The bottom of the header without a filter (Figma Mobile v3 deal card): the biggest discounts tonight as
// tickets on the deep blue deal card. Every figure comes from the offers; with nothing to order, it does not
// show. The pale sheet behind its lower half starts the page under the header.
export async function TonightDeals({ query: pending }: { query: Promise<HomeQuery> }) {
  const query = await pending;
  if (query.q || query.kind || query.now) return null;

  const [t, format, offers] = await Promise.all([
    getTranslations("Home"),
    getFormatter(),
    listOffers({}),
  ]);
  const tickets = biggestDiscountFirst(offers).slice(0, TICKET_COUNT);
  if (tickets.length === 0) return null;
  const time = (iso: string) => format.dateTime(new Date(iso), "time");

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute top-19 -bottom-3 left-1/2 w-screen -translate-x-1/2 rounded-t-3xl bg-background"
      />
      <section
        aria-labelledby="tonight-deals"
        className="relative flex flex-col gap-2.5 rounded-2xl bg-deal px-3.5 pt-3.5 pb-3 text-deal-foreground"
      >
        <h2 id="tonight-deals" className="text-body-sm-strong text-fresh">
          {t("dealsTitle")}
        </h2>
        <div className="flex items-center gap-2.5">
          <p className="flex shrink-0 flex-col">
            <span className="text-label-strong text-inverse-muted">{t("upTo")}</span>
            <span className="font-display text-display text-fresh">
              {t("upToPercent", { percent: tickets[0].discountPercent })}
            </span>
          </p>
          <ul className="flex min-w-0 flex-1 gap-1.25">
            {tickets.map((offer) => (
              <li
                key={offer.id}
                className="flex min-w-0 flex-1 flex-col gap-1 rounded-xl bg-card py-2.5 pr-1 pl-1.75 text-card-foreground sm:max-w-44"
              >
                <span className="font-display text-figure-sm text-sale">
                  <span aria-hidden>{t("ticketDiscount", { percent: offer.discountPercent })}</span>
                  <span className="sr-only">
                    {t("ticketDiscountLabel", { percent: offer.discountPercent })}
                  </span>
                </span>
                <span className="truncate text-label-strong">{offer.seller.name}</span>
                <span className="truncate text-label text-muted-foreground">
                  {t("ticketWindow", { from: time(offer.windowStart) })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
