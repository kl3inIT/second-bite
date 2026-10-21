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
// to is tinted, and the page scrolls to it by its anchor (K4). From 768px a dish is a row of 100px (Figma WK3) or,
// with `card`, a 136px card of a menu group laid out as a grid: the photograph over the price, the portions left
// and the dish, the "+" at the photograph's foot.
export function SellerDish({
  offer,
  focused,
  card = false,
}: {
  offer: OfferSummary;
  focused: boolean;
  card?: boolean;
}) {
  const t = useTranslations("OfferCard");
  const [open, setOpen] = useState(false);
  const original = formatPrice(offer.originalPriceVnd);

  return (
    <article
      id={dishAnchor(offer.id)}
      className={cn(
        "flex scroll-mt-4 items-center gap-3.5 md:relative",
        card && "md:w-34 md:flex-col md:items-stretch md:gap-1",
        focused && "-mx-2.5 rounded-xl bg-muted p-2.5",
      )}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={() => setOpen(true)}
        className={cn(
          "relative size-25 shrink-0 overflow-hidden rounded-lg bg-muted",
          card && "md:size-34",
        )}
      >
        <OfferPhoto offer={offer} sizes="100px" />
        <DiscountBadge percent={offer.discountPercent} />
      </button>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-2.5",
          card ? "md:flex-none md:flex-col-reverse md:gap-1" : "md:pr-26",
        )}
      >
        <h3
          className={cn(
            "line-clamp-2 text-title-lg text-foreground",
            card && "md:truncate md:text-note",
          )}
        >
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
          {/* From 768px the stepper is centred on the row at its right end, or at the card photograph's foot (Figma WK3). */}
          <div
            className={cn(
              "shrink-0 md:absolute",
              card ? "md:top-24 md:right-2" : "md:top-1/2 md:right-0 md:-translate-y-1/2",
            )}
          >
            <QuantityStepper offer={offer} />
          </div>
        </div>
      </div>
      <DishSheet offer={offer} open={open} onOpenChange={setOpen} />
    </article>
  );
}
