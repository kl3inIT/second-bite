import { useTranslations } from "next-intl";

import { formatPrice } from "./format";
import type { OfferSummary } from "./offer";

// The new price in deep leaf against the old one struck through (DESIGN.md › Offer card). A reader hears
// the new price, then "Giá gốc …"; the struck figure itself is not read twice.
export function Price({ offer, size }: { offer: OfferSummary; size: "lg" | "md" }) {
  const t = useTranslations("OfferCard");
  const original = formatPrice(offer.originalPriceVnd);

  return (
    <p
      className={
        size === "lg" ? "flex flex-row-reverse items-center gap-2" : "flex items-center gap-1.5"
      }
    >
      <span
        className={
          size === "lg"
            ? "font-display text-price-lg text-primary"
            : "font-display text-price text-primary"
        }
      >
        {formatPrice(offer.priceVnd)}
      </span>
      <s
        aria-hidden
        className={
          size === "lg"
            ? "text-body-sm text-muted-foreground"
            : "text-caption text-muted-foreground"
        }
      >
        {original}
      </s>
      <span className="sr-only">{t("originalPrice", { price: original })}</span>
    </p>
  );
}

/** The discount as a soft chip, "-63%" (Figma "off"). */
export function DiscountChip({ percent }: { percent: number }) {
  const t = useTranslations("OfferCard");

  return (
    <span className="rounded-md bg-secondary px-2 py-0.5 text-caption font-bold text-secondary-foreground">
      <span aria-hidden>{t("discount", { percent })}</span>
      <span className="sr-only">{t("discountLabel", { percent })}</span>
    </span>
  );
}
