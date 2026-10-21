import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";

import { formatPrice } from "@/features/offers/format";
import type { OfferBody } from "@/lib/api/generated";

// One post on a store's page, in a frame of its own (Figma AD-Q3 › Bài đang bán): its photo, then the dish, the price beside the
// original one struck through, the discount and what is left in Sale Red, and the window to collect.
export async function OfferRow({ offer }: { offer: OfferBody }) {
  const [t, format] = await Promise.all([getTranslations("Admin.sellers.detail"), getFormatter()]);
  const time = (at: string) => format.dateTime(new Date(at), "time");

  return (
    <li className="flex items-center gap-4 rounded-xl border border-border p-4">
      <span className="relative size-28 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={`/api${offer.photo.smallPath}`}
          alt=""
          fill
          sizes="112px"
          unoptimized
          className="object-cover"
        />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="text-title-lg text-foreground">{offer.name}</h3>
        <p className="flex items-baseline gap-2">
          <span className="font-display text-price text-primary">
            {formatPrice(offer.priceVnd)}
          </span>
          <span className="text-label text-muted-foreground line-through">
            {formatPrice(offer.originalPriceVnd)}
          </span>
        </p>
        <p className="text-label-strong text-sale">
          {t("offerLeft", {
            discount: offer.discountPercent,
            left: offer.unitsLeft,
            units: offer.units,
            unit: offer.unit,
          })}
        </p>
        <p className="text-body-sm text-muted-foreground">
          {t("offerWindow", { from: time(offer.windowStart), until: time(offer.windowEnd) })}
        </p>
      </div>
    </li>
  );
}
