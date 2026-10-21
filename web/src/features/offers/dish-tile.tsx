import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { DishLink } from "./dish-link";
import { formatPrice } from "./format";
import { isAvailable, type OfferSummary } from "./offer";
import { OfferPhoto } from "./offer-photo";

// One more dish of a seller, under their block in the search (Figma K2c and K1f "túi"): a photograph, the
// price beside the old one struck through, and the dish on one line. `square` is the 112px photograph of a
// followed seller's row (Figma K9).
export function DishTile({ offer, square = false }: { offer: OfferSummary; square?: boolean }) {
  const t = useTranslations("OfferCard");
  const original = formatPrice(offer.originalPriceVnd);

  return (
    <article className="relative flex min-w-0 flex-col gap-1">
      <div
        className={cn(
          "relative overflow-hidden",
          square ? "size-28 rounded-lg" : "h-21 rounded-md",
        )}
      >
        <OfferPhoto offer={offer} dimmed={!isAvailable(offer)} sizes={square ? "112px" : "120px"} />
      </div>
      <p className="flex items-baseline gap-0.75">
        <span className="shrink-0 font-display text-price-sm text-primary">
          {formatPrice(offer.priceVnd)}
        </span>
        <s aria-hidden className="truncate text-label text-muted-foreground">
          {original}
        </s>
        <span className="sr-only">{t("originalPrice", { price: original })}</span>
      </p>
      <h4 className="truncate text-label text-foreground">
        <DishLink offer={offer}>{offer.name}</DishLink>
      </h4>
    </article>
  );
}
