import { ClockIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { BiteCorner } from "@/components/bite-corner";
import { cn } from "@/lib/utils";

import { DiscountLabel } from "./discount-label";
import { isAvailable, type OfferSummary } from "./offer";
import { OfferPhoto } from "./offer-photo";
import { Price } from "./price";
import { useCollectionWindow, useDistance } from "./window";

// The large card of "Sắp hết giờ nhận", the lists and the search (DESIGN.md › Offer card, Figma Mobile v3
// card/…): the photograph with the discount label and, on a scrim at its foot, the window and how far it
// is; then the dish, the portions left in red words and the price, under a bitten corner. A card names the
// dish only; where the seller is not otherwise shown, as in search results, `showSeller` adds them.
export function OfferCard({
  offer,
  showSeller = false,
  className,
}: {
  offer: OfferSummary;
  showSeller?: boolean;
  className?: string;
}) {
  const t = useTranslations("OfferCard");
  const { from, until } = useCollectionWindow(offer);
  const distance = useDistance(offer);
  const available = isAvailable(offer);
  const window = t("window", { from, until });

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl bg-card text-card-foreground",
        className,
      )}
    >
      <div className="relative h-34">
        <OfferPhoto offer={offer} dimmed={!available} sizes="(min-width: 640px) 50vw, 100vw" />
        <DiscountLabel percent={offer.discountPercent} className="rounded-tl-xl" />
        <p className="absolute inset-x-0 bottom-0 flex h-13 items-end gap-1.75 bg-linear-to-b from-transparent to-foreground/60 px-3.25 pb-2.5 text-label-strong text-card">
          <ClockIcon aria-hidden strokeWidth={2.2} className="mb-0.5 size-3.5 shrink-0" />
          <span className="truncate">
            {distance ? t("windowAway", { window, distance }) : window}
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-1 px-3.5 pt-2.5 pb-3">
        <h3 className="truncate text-title-lg text-foreground">{offer.name}</h3>
        {showSeller && (
          <p className="truncate text-label text-muted-foreground">
            {distance
              ? t("sellerAway", { seller: offer.seller.name, distance })
              : t("seller", { seller: offer.seller.name })}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <UnitsLeft offer={offer} />
          <Price offer={offer} />
        </div>
      </div>
      <BiteCorner className="size-14" />
    </article>
  );
}

/** "Còn 2 phần" in red words, or "Đã hết" in muted once nothing is left (The One Label Rule). */
export function UnitsLeft({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("OfferCard");

  return isAvailable(offer) ? (
    <p className="text-label-strong text-sale">{t("left", { units: offer.unitsLeft })}</p>
  ) : (
    <p className="text-label-strong text-muted-foreground">{t("soldOut")}</p>
  );
}
