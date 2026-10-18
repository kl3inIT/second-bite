import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

import { Band, type BandState } from "@/components/band";

import { formatPrice, windowTime } from "./format";
import type { OfferSummary } from "./offer";

// A white label on the kraft ground (DESIGN.md › Components › Offer card): photo, seller and place,
// name, price against the original, and the band.
export function OfferCard({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("OfferCard");
  const format = useFormatter();
  const from = format.dateTime(new Date(offer.collectFrom), windowTime);
  const until = format.dateTime(new Date(offer.collectUntil), windowTime);
  const state: BandState =
    offer.state === "announced" ? "expected" : offer.units > 0 ? "available" : "soldOut";
  const band = {
    available: t("available", { from, until, units: offer.units }),
    soldOut: t("soldOut", { from, until }),
    expected: t("expected", { from }),
  }[state];

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl bg-card text-card-foreground shadow-card">
      <Image
        src={`/api${offer.photo}`}
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
          {offer.seller.name} · {offer.seller.place}
        </p>
        <h3 className="line-clamp-2 text-title">{offer.name}</h3>
        <p className="flex items-baseline gap-2">
          <span className="text-price text-primary">{formatPrice(offer.price)}</span>
          <s aria-hidden className="text-body-sm text-muted-foreground">
            {formatPrice(offer.originalPrice)}
          </s>
          <span className="sr-only">
            {t("originalPrice", { price: formatPrice(offer.originalPrice) })}
          </span>
        </p>
        <Band state={state}>{band}</Band>
      </div>
    </article>
  );
}
