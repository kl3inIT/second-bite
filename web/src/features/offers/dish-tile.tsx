import { useTranslations } from "next-intl";

import { formatPrice } from "./format";
import { isAvailable, type OfferSummary } from "./offer";
import { OfferPhoto } from "./offer-photo";

// One more dish of a seller, under their block in the search (Figma K2c and K1f "túi"): a photograph, the
// price beside the old one struck through, and the dish on one line.
export function DishTile({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("OfferCard");
  const original = formatPrice(offer.originalPriceVnd);

  return (
    <article className="flex min-w-0 flex-col gap-1">
      <div className="relative h-21 overflow-hidden rounded-md">
        <OfferPhoto offer={offer} dimmed={!isAvailable(offer)} sizes="120px" />
      </div>
      <p className="flex items-baseline gap-1">
        <span className="font-display text-price text-primary">{formatPrice(offer.priceVnd)}</span>
        <s aria-hidden className="truncate text-label text-muted-foreground">
          {original}
        </s>
        <span className="sr-only">{t("originalPrice", { price: original })}</span>
      </p>
      <h4 className="truncate text-label text-foreground">{offer.name}</h4>
    </article>
  );
}
