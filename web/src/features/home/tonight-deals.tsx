import { ChevronRightIcon, ClockIcon } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { listOffers } from "@/features/offers/list-offers";
import { biggestDiscountFirst, openBags } from "@/features/offers/offer";
import { DiscountChip } from "@/features/offers/price";

import type { HomeQuery } from "./home-query";

const TICKET_COUNT = 3;

// The bottom of the header without a filter (Figma deal card, perk strip): the biggest discounts tonight
// as tickets on Deep Leaf, then how many bags are open and when the last window closes, linking to the
// list. Every figure comes from the offers; with nothing to order, neither shows. The mint sheet behind
// their lower half starts the page under the header.
export async function TonightDeals({ query: pending }: { query: Promise<HomeQuery> }) {
  const query = await pending;
  if (query.q || query.kind || query.now) return null;

  const [t, format, offers] = await Promise.all([
    getTranslations("Home"),
    getFormatter(),
    listOffers({}),
  ]);
  const open = openBags(offers);
  if (!open) return null;
  const tickets = biggestDiscountFirst(offers).slice(0, TICKET_COUNT);
  const time = (iso: string) => format.dateTime(new Date(iso), "time");

  return (
    <div className="relative flex flex-col gap-3">
      <div
        aria-hidden
        className="absolute top-19 -bottom-3 left-1/2 w-screen -translate-x-1/2 rounded-t-3xl bg-background"
      />
      <section
        aria-labelledby="tonight-deals"
        className="relative flex flex-col gap-2.5 rounded-2xl bg-primary px-3.5 pt-3.5 pb-3 text-primary-foreground"
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
                <span className="flex">
                  <DiscountChip percent={offer.discountPercent} />
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
      <a
        href="#all-offers"
        className="relative flex items-center gap-2 rounded-xl border border-border bg-card py-2 pr-2.5 pl-3 text-body-sm-strong text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ClockIcon aria-hidden strokeWidth={2.2} className="size-4.5 shrink-0 text-primary" />
        <span className="min-w-0 flex-1">
          {t("openBags", { bags: open.bags, last: time(open.lastWindowEnd) })}
        </span>
        <ChevronRightIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      </a>
    </div>
  );
}
