"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { CartPortions } from "@/features/cart/cart-portions";
import { QuantityStepper } from "@/features/cart/quantity-stepper";
import { cn } from "@/lib/utils";

import { DiscountBadge } from "./discount-label";
import { DishSheet } from "./dish-sheet";
import { formatPrice } from "./format";
import { dishAnchor, type OfferSummary } from "./offer";
import { OfferPhoto } from "./offer-photo";

// One dish of the seller (Figma K4b "món"): its photograph, the dish, the price over the discount and the
// portions left, and the − and +. The photograph and the name open the dish's sheet (K4a); the dish a link led
// to is tinted, and the page scrolls to it by its anchor (K4). From 768px a dish is a row of 100px with the − and +
// at its right end (Figma WK3).
export function SellerDish({ offer, focused }: { offer: OfferSummary; focused: boolean }) {
  const t = useTranslations("OfferCard");
  const [open, setOpen] = useState(false);
  const original = formatPrice(offer.originalPriceVnd);

  return (
    <article
      id={dishAnchor(offer.id)}
      className={cn(
        "flex scroll-mt-4 items-center gap-3.5 md:relative",
        focused && "-mx-2.5 rounded-xl bg-muted p-2.5",
      )}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={() => setOpen(true)}
        className="relative size-25 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        <OfferPhoto offer={offer} sizes="100px" />
        <DiscountBadge percent={offer.discountPercent} />
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 md:pr-26">
        <h3 className="line-clamp-2 text-title-lg text-foreground">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-left focus-visible:underline focus-visible:outline-none"
          >
            {offer.name}
          </button>
        </h3>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="flex items-baseline gap-1.25">
              <span className="font-display text-price text-primary">
                {formatPrice(offer.priceVnd)}
              </span>
              <s aria-hidden className="text-label text-muted-foreground">
                {original}
              </s>
              <span className="sr-only">{t("originalPrice", { price: original })}</span>
            </p>
            <CartPortions offer={offer} />
          </div>
          <div className="shrink-0 md:absolute md:top-1/2 md:right-0 md:-translate-y-1/2">
            <QuantityStepper offer={offer} />
          </div>
        </div>
      </div>
      <DishSheet offer={offer} open={open} onOpenChange={setOpen} />
    </article>
  );
}
