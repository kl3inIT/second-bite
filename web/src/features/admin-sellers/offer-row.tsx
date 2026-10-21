"use client";

import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

import { formatPrice } from "@/features/offers/format";
import type { OfferBody } from "@/lib/api/generated";

// One post on a store's page, in a frame of its own (Figma AD-Q3 › Bài đang bán, AD-QD1): its photo, then the
// dish, the price beside the original one struck through, the discount and what is left in Sale Red, and the
// window to collect; a withdrawn post says when it was taken down instead (AD-QD2). With `onOpen`, the dish's
// name opens the post's panel (AD-QD3), and the whole frame answers the pointer.
export function OfferRow({ offer, onOpen }: { offer: OfferBody; onOpen?: () => void }) {
  const t = useTranslations("Admin.sellers.detail");
  const format = useFormatter();
  const time = (at: string) => format.dateTime(new Date(at), "time");
  const withdrawnAt = offer.status === "withdrawn" ? offer.withdrawnAt : undefined;

  return (
    <li className="relative flex items-center gap-4 rounded-xl border border-border p-4 has-[button:hover]:bg-muted">
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
        <h3 className="text-title-lg text-foreground">
          {onOpen ? (
            <button
              type="button"
              onClick={onOpen}
              className="text-start outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
            >
              {offer.name}
            </button>
          ) : (
            offer.name
          )}
        </h3>
        <p className="flex items-baseline gap-2">
          <span className="font-display text-price text-primary">
            {formatPrice(offer.priceVnd)}
          </span>
          <span className="text-label text-muted-foreground line-through">
            {formatPrice(offer.originalPriceVnd)}
          </span>
        </p>
        <p className="text-label-strong text-sale">
          {withdrawnAt
            ? t("offerUnits", {
                discount: offer.discountPercent,
                units: offer.units,
                unit: offer.unit,
              })
            : t("offerLeft", {
                discount: offer.discountPercent,
                left: offer.unitsLeft,
                units: offer.units,
                unit: offer.unit,
              })}
        </p>
        <p className="text-body-sm text-muted-foreground">
          {withdrawnAt
            ? t("offerWithdrawn", {
                day: format.dateTime(new Date(withdrawnAt), "dayOfMonth"),
                month: format.dateTime(new Date(withdrawnAt), "monthOfYear"),
                time: time(withdrawnAt),
              })
            : t("offerWindow", { from: time(offer.windowStart), until: time(offer.windowEnd) })}
        </p>
      </div>
    </li>
  );
}
