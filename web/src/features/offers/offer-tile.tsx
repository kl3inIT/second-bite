import { useTranslations } from "next-intl";

import { BiteCorner } from "@/components/bite-corner";
import { Sticker } from "@/components/sticker";

import { OfferPhoto } from "./offer-card";
import { isAvailable, type OfferSummary } from "./offer";
import { Price } from "./price";
import { SellerAvatar } from "./seller-avatar";
import { useCollectionWindow } from "./window";

// The compact card of a two-column grid (DESIGN.md › Compact offer card, Figma grid/…): photograph with
// stock and a deal strip of discount and window, then dish, price and seller, under a bitten corner.
export function OfferTile({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("OfferCard");
  const { from, until } = useCollectionWindow(offer);
  const available = isAvailable(offer);

  return (
    <article className="relative flex w-full flex-col overflow-hidden rounded-tile bg-card text-card-foreground">
      <div className="relative h-33">
        <OfferPhoto offer={offer} dimmed={!available} />
        <Sticker tone={available ? "highlight" : "soldOut"} className="absolute top-2.5 left-2.5">
          {available ? t("stock", { units: offer.unitsLeft }) : t("soldOut")}
        </Sticker>
        <div className="absolute inset-x-0 bottom-0 flex pr-4">
          <p className="flex min-w-0 items-center gap-1.5 rounded-tr-lg bg-primary px-2.5 py-1">
            <span className="text-caption font-bold text-highlight">
              <span aria-hidden>{t("discount", { percent: offer.discountPercent })}</span>
              <span className="sr-only">
                {t("discountLabel", { percent: offer.discountPercent })}
              </span>
            </span>
            <span className="truncate text-micro text-primary-foreground">
              {t("window", { from, until })}
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 px-3 pt-2.5 pb-3">
        <h3 className="line-clamp-2 text-body leading-snug font-semibold text-foreground">
          {offer.name}
        </h3>
        <Price offer={offer} size="md" />
        <p className="flex items-center gap-1.5 text-micro font-normal text-muted-foreground">
          <SellerAvatar seller={offer.seller} size="sm" />
          <span className="truncate">{offer.seller.name}</span>
        </p>
      </div>
      <BiteCorner className="size-11" />
    </article>
  );
}
