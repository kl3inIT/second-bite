"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { isAvailable, type OfferSummary } from "@/features/offers/offer";
import { cn } from "@/lib/utils";

import { addOne, quantityOf, removeOne } from "./cart";
import { saveCart, useCart } from "./cart-store";

// A round 32px button with a 44px target around it.
const round =
  "relative flex size-8 shrink-0 items-center justify-center rounded-full after:absolute after:-inset-1.5 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none disabled:text-muted-foreground";

// A dish's − and + on the seller's page (Figma K4b stepper): a lone white + until it is in the cart, then
// − count + on the sky fill, the + going pale once every portion left is chosen.
export function QuantityStepper({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("Cart");
  const cart = useCart();
  const add = () => saveCart(addOne(cart, offer));
  const quantity = quantityOf(cart, offer.id);

  if (!isAvailable(offer)) return null;

  return quantity === 0 ? (
    <button
      type="button"
      aria-label={t("add", { name: offer.name })}
      onClick={add}
      className={cn(round, "bg-card text-primary shadow-card")}
    >
      <PlusIcon aria-hidden strokeWidth={2.4} className="size-4" />
    </button>
  ) : (
    <Stepper
      name={offer.name}
      quantity={quantity}
      canAdd={quantity < offer.unitsLeft}
      onAdd={add}
      onRemove={() => cart && saveCart(removeOne(cart, offer.id))}
    />
  );
}

// − count + on the sky fill (Figma K4b, K4a, K5), for a quantity kept anywhere: the cart's on the seller's page and
// the confirmation, the portions about to be added on the dish's sheet. Its round buttons are drawn at 28px; each
// reaches 8px past its edge, a 44px target, without meeting the other's across the count (SEC-166).
export function Stepper({
  name,
  quantity,
  label,
  canAdd,
  canRemove = true,
  onAdd,
  onRemove,
}: {
  name: string;
  quantity: number;
  /** What the count says to a screen reader; the portions in the cart unless told otherwise. */
  label?: string;
  canAdd: boolean;
  canRemove?: boolean;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const t = useTranslations("Cart");

  return (
    <div className="flex h-8 w-24 shrink-0 items-center justify-between rounded-full bg-muted px-0.5">
      <button
        type="button"
        aria-label={t("remove", { name })}
        disabled={!canRemove}
        onClick={onRemove}
        className={cn(round, "size-7 bg-card text-primary after:-inset-2")}
      >
        <MinusIcon aria-hidden strokeWidth={2.4} className="size-4" />
      </button>
      <output
        aria-label={label ?? t("quantity", { name, quantity })}
        className="text-title text-foreground"
      >
        {quantity}
      </output>
      <button
        type="button"
        aria-label={t("add", { name })}
        disabled={!canAdd}
        onClick={onAdd}
        className={cn(
          round,
          "size-7 bg-primary text-primary-foreground after:-inset-2 disabled:bg-secondary",
        )}
      >
        <PlusIcon aria-hidden strokeWidth={2.4} className="size-4" />
      </button>
    </div>
  );
}
