import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { closingFirst, type OfferSummary } from "./offer";
import { OfferCard } from "./offer-card";

// The offers beside the orders and the favourites on a desktop (Figma D6, WK9 › cột phải).
const TONIGHT_COUNT = 2;

/** Tonight's offers in the right column of the wide layout, so a page leads back to ordering (Figma D6, WK9). */
export function TonightOffers({
  offers,
  className,
}: {
  offers: readonly OfferSummary[];
  className?: string;
}) {
  const t = useTranslations("Orders");
  const shown = closingFirst([...offers]).slice(0, TONIGHT_COUNT);
  if (shown.length === 0) return null;

  return (
    <section
      aria-labelledby="tonight-offers"
      className={cn("hidden flex-col gap-4 lg:flex", className)}
    >
      <h2 id="tonight-offers" className="font-display text-headline">
        {t("tonight")}
      </h2>
      {shown.map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </section>
  );
}
