"use client";

import { useTranslations } from "next-intl";

import { cappedPerOrder, mostPerOrder, type OfferSummary } from "@/features/offers/offer";

import { quantityOf } from "./cart";
import { useCart } from "./cart-store";

// "còn 3 phần" under a dish on the seller's page, "đã chọn đủ 2 phần" once the cart holds every portion left
// (Figma K4b), or the most one order may hold under the dish's cap (SEC-158); the discount is on the photograph.
export function CartPortions({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("Cart");
  const most = mostPerOrder(offer);
  const full = quantityOf(useCart(), offer.id) >= most;
  const capped = cappedPerOrder(offer);

  return (
    <p className="text-label text-sale">
      {full
        ? t(capped ? "portionsCapped" : "portionsChosen", { units: most })
        : t("portionsLeft", { units: offer.unitsLeft })}
    </p>
  );
}
