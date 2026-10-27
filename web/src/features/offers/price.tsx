import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { formatPrice } from "./format";
import type { OfferSummary } from "./offer";

// The old price struck through beside the new one in Tasco blue (DESIGN.md › Offer card). A reader hears
// the new price, then "Giá gốc …"; the struck figure itself is not read twice. Where the two do not fit, as
// in a narrow card with a phone's large text, the old price goes to the next line (SEC-107).
export function Price({ offer, className }: { offer: OfferSummary; className?: string }) {
  const t = useTranslations("OfferCard");
  const original = formatPrice(offer.originalPriceVnd);

  return (
    <p className={cn("flex flex-row-reverse flex-wrap items-baseline gap-x-1.5", className)}>
      <span className="font-display text-price-lg text-primary">{formatPrice(offer.priceVnd)}</span>
      <s aria-hidden className="text-label text-muted-foreground">
        {original}
      </s>
      <span className="sr-only">{t("originalPrice", { price: original })}</span>
    </p>
  );
}
