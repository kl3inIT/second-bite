"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { isAvailable, type OfferSummary } from "@/features/offers/offer";
import { cn } from "@/lib/utils";

import { quantityOf, removeOne } from "./cart";
import { saveCart } from "./cart-store";
import { useAddToCart } from "./use-add-to-cart";

// A round 32px button with a 44px target around it.
const round =
  "relative flex size-8 shrink-0 items-center justify-center rounded-full after:absolute after:-inset-1.5 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none disabled:text-muted-foreground";

// A dish's − and + on the seller's page (Figma K4b stepper): a lone white + until it is in the cart, then
// − count + on the sky fill, the + going pale once every portion left is chosen.
export function QuantityStepper({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("Cart");
  const { cart, add, sheet } = useAddToCart();
  const quantity = quantityOf(cart, offer.id);
  const full = quantity >= offer.unitsLeft;

  if (!isAvailable(offer)) return null;

  return (
    <>
      {quantity === 0 ? (
        <button
          type="button"
          aria-label={t("add", { name: offer.name })}
          onClick={() => add(offer)}
          className={cn(round, "bg-card text-primary shadow-card")}
        >
          <PlusIcon aria-hidden strokeWidth={2.4} className="size-4" />
        </button>
      ) : (
        <div className="flex h-8 w-24 items-center justify-between rounded-full bg-muted px-0.5">
          <button
            type="button"
            aria-label={t("remove", { name: offer.name })}
            onClick={() => cart && saveCart(removeOne(cart, offer.id))}
            className={cn(round, "size-7 bg-card text-primary")}
          >
            <MinusIcon aria-hidden strokeWidth={2.4} className="size-4" />
          </button>
          <output
            aria-label={t("quantity", { name: offer.name, quantity })}
            className="text-title text-foreground"
          >
            {quantity}
          </output>
          <button
            type="button"
            aria-label={t("add", { name: offer.name })}
            disabled={full}
            onClick={() => add(offer)}
            className={cn(round, "size-7 bg-primary text-primary-foreground disabled:bg-secondary")}
          >
            <PlusIcon aria-hidden strokeWidth={2.4} className="size-4" />
          </button>
        </div>
      )}
      {sheet}
    </>
  );
}
