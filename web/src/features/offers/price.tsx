import { useTranslations } from "next-intl";

import { formatPrice } from "./format";
import type { OfferSummary } from "./offer";

// The old price struck through beside the new one in Tasco blue (DESIGN.md › Offer card). A reader hears
// the new price, then "Giá gốc …"; the struck figure itself is not read twice.
export function Price({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("OfferCard");
  const original = formatPrice(offer.originalPriceVnd);

  return (
    <p className="flex flex-row-reverse items-baseline gap-1.5">
      <span className="font-display text-price-lg text-primary">{formatPrice(offer.priceVnd)}</span>
      <s aria-hidden className="text-label text-muted-foreground">
        {original}
      </s>
      <span className="sr-only">{t("originalPrice", { price: original })}</span>
    </p>
  );
}
