import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { BiteCorner } from "@/components/bite-corner";
import { Badge } from "@/components/ui/badge";

import { isAvailable, type OfferSummary } from "./offer";
import { DiscountChip, Price } from "./price";
import { SellerAvatar } from "./seller-avatar";
import { useCollectionWindow } from "./window";

// The large card of a sideways row (DESIGN.md › Offer card, Figma card/…): photograph with stock and the
// seller's avatar, then seller, dish, window and place, and the price row, under a bitten corner.
export function OfferCard({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("OfferCard");
  const { from, until } = useCollectionWindow(offer);
  const available = isAvailable(offer);

  return (
    <article className="relative flex w-66 flex-col overflow-hidden rounded-2xl bg-card text-card-foreground lg:w-full">
      <div className="relative h-23">
        <OfferPhoto offer={offer} dimmed={!available} />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-transparent to-primary-hover/35"
        />
        <Badge variant={available ? "fresh" : "soldOut"} className="absolute top-3 left-3">
          {available ? t("stock", { units: offer.unitsLeft }) : t("soldOut")}
        </Badge>
        <SellerAvatar seller={offer.seller} size="md" className="absolute bottom-3 left-3" />
      </div>
      <div className="flex flex-col gap-1.5 px-3.5 pt-3 pb-3.5">
        <p className="truncate text-title text-foreground">{offer.seller.name}</p>
        <h3 className="truncate text-body-sm text-muted-foreground">{offer.name}</h3>
        <p className="flex items-center gap-1.5 text-label text-muted-foreground">
          <ClockIcon aria-hidden className="size-3.5 shrink-0" />
          <span className="truncate">
            {t("windowAt", { from, until, place: offer.seller.address })}
          </span>
        </p>
        <div className="flex items-center justify-between gap-2">
          <DiscountChip percent={offer.discountPercent} />
          <Price offer={offer} size="lg" />
        </div>
      </div>
      <BiteCorner className="size-14" />
    </article>
  );
}

/** The offer's photograph filling its frame; faded once it has sold out. */
export function OfferPhoto({ offer, dimmed = false }: { offer: OfferSummary; dimmed?: boolean }) {
  return (
    <Image
      src={`/api${offer.photo.smallPath}`}
      alt=""
      fill
      sizes="(min-width: 640px) 50vw, 100vw"
      // The backend already writes each photo at 400 px without metadata.
      unoptimized
      className={dimmed ? "object-cover opacity-45" : "object-cover"}
    />
  );
}
