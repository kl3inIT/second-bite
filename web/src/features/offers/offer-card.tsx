import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

import { Band, type BandState } from "@/components/band";

import { formatPrice } from "./format";
import { isAvailable, type OfferSummary } from "./offer";

// A white label on the kraft ground (DESIGN.md › Components › Offer card): photo, seller and place,
// name, price against the original, and the band.
export function OfferCard({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("OfferCard");
  const format = useFormatter();
  const from = format.dateTime(new Date(offer.windowStart), "time");
  const until = format.dateTime(new Date(offer.windowEnd), "time");
  const state: BandState = isAvailable(offer) ? "available" : "soldOut";
  const band =
    state === "available"
      ? t("available", { from, until, units: offer.unitsLeft })
      : t("soldOut", { from, until });

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl bg-card text-card-foreground shadow-card">
      <Image
        src={`/api${offer.photo.smallPath}`}
        alt={offer.name}
        width={400}
        height={300}
        // The backend already writes each photo at 400 px without metadata.
        unoptimized
        className={
          state === "soldOut"
            ? "h-37.5 w-full object-cover opacity-45"
            : "h-37.5 w-full object-cover"
        }
      />
      <div className="flex flex-col gap-2 px-4 pt-3 pb-4">
        <p className="text-label text-muted-foreground">
          {offer.seller.name} · {offer.seller.address}
        </p>
        <h3 className="line-clamp-2 text-title">{offer.name}</h3>
        <p className="flex items-baseline gap-2">
          <span className="text-price text-primary">{formatPrice(offer.priceVnd)}</span>
          <s aria-hidden className="text-body-sm text-muted-foreground">
            {formatPrice(offer.originalPriceVnd)}
          </s>
          <span className="sr-only">
            {t("originalPrice", { price: formatPrice(offer.originalPriceVnd) })}
          </span>
        </p>
        <Band state={state}>{band}</Band>
      </div>
    </article>
  );
}
