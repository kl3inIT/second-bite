"use client";

import { useTranslations } from "next-intl";

import type { OfferSummary } from "@/features/offers/offer";

import { quantityOf } from "./cart";
import { useCart } from "./cart-store";

// "-60% · còn 3 phần" under a dish on the seller's page, "-60% · đã chọn đủ 2 phần" once the cart holds every
// portion left (Figma K4b).
export function CartPortions({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("Cart");
  const full = quantityOf(useCart(), offer.id) >= offer.unitsLeft;

  return (
    <p className="text-label text-sale">
      {t(full ? "portionsChosen" : "portionsLeft", {
        percent: offer.discountPercent,
        units: offer.unitsLeft,
      })}
    </p>
  );
}
