import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { BiteCorner } from "@/components/bite-corner";
import { cn } from "@/lib/utils";

import { isAvailable, type OfferSummary } from "./offer";
import { Price } from "./price";
import { useCollectionWindow } from "./window";

// The large card of "Sắp hết giờ nhận" and of the list (DESIGN.md › Offer card, Figma Mobile v3 card/…):
// the photograph with the discount label and the window on a scrim at its foot, then the dish, the portions
// left in red words and the price, under a bitten corner. It names the dish only, never the seller.
export function OfferCard({ offer, className }: { offer: OfferSummary; className?: string }) {
  const t = useTranslations("OfferCard");
  const { from, until } = useCollectionWindow(offer);
  const available = isAvailable(offer);

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl bg-card text-card-foreground",
        className,
      )}
    >
      <div className="relative h-34">
        <Image
          src={`/api${offer.photo.smallPath}`}
          alt=""
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          // The backend already writes each photo at 400 px without metadata.
          unoptimized
          className={available ? "object-cover" : "object-cover opacity-45"}
        />
        <DiscountLabel percent={offer.discountPercent} />
        <p className="absolute inset-x-0 bottom-0 flex h-13 items-end gap-1.75 bg-linear-to-b from-transparent to-foreground/60 px-3.25 pb-2.5 text-label-strong text-card">
          <ClockIcon aria-hidden strokeWidth={2.2} className="mb-0.5 size-3.5 shrink-0" />
          <span className="truncate">{t("window", { from, until })}</span>
        </p>
      </div>
      <div className="flex flex-col gap-1 px-3.5 pt-2.5 pb-3">
        <h3 className="truncate text-title-lg text-foreground">{offer.name}</h3>
        <div className="flex items-center justify-between gap-2">
          {available ? (
            <p className="text-label-strong text-sale">{t("left", { units: offer.unitsLeft })}</p>
          ) : (
            <p className="text-label-strong text-muted-foreground">{t("soldOut")}</p>
          )}
          <Price offer={offer} />
        </div>
      </div>
      <BiteCorner className="size-14" />
    </article>
  );
}

/** The discount in the photograph's top left corner, "Giảm 55%" (DESIGN.md › Discount label). */
function DiscountLabel({ percent }: { percent: number }) {
  const t = useTranslations("OfferCard");

  return (
    <p className="absolute top-0 left-0 rounded-tl-xl rounded-br-md bg-deal px-2.5 py-1 text-label-strong text-deal-foreground">
      {t("discount", { percent })}
    </p>
  );
}
