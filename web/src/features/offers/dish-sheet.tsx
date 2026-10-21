"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { addPortions, quantityOf } from "@/features/cart/cart";
import { CartPortions } from "@/features/cart/cart-portions";
import { saveCart, useCart } from "@/features/cart/cart-store";
import { Stepper } from "@/features/cart/quantity-stepper";

import { formatPrice } from "./format";
import type { OfferSummary } from "./offer";
import { OfferPhoto } from "./offer-photo";

// A dish's sheet over its seller's page (Figma K4a): its photograph, name, price over the old one with the discount
// and the portions left, what the seller says of it with its weight, what to bring and ask; at the foot how many
// to add, from one up to what the cart can still take, and "Thêm vào giỏ" with their price.
export function DishSheet({
  offer,
  open,
  onOpenChange,
}: {
  offer: OfferSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Dish");
  const cards = useTranslations("OfferCard");
  const original = formatPrice(offer.originalPriceVnd);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto flex min-h-0 w-full max-w-xl flex-col">
          <div className="flex flex-col gap-4 overflow-y-auto px-4 pt-3 pb-4">
            <div className="relative h-50 shrink-0 overflow-hidden rounded-xl bg-muted">
              <OfferPhoto offer={offer} large sizes="(min-width: 576px) 544px, 100vw" />
            </div>
            <div className="flex flex-col gap-2">
              <DrawerTitle>{offer.name}</DrawerTitle>
              <div className="flex flex-col gap-0.5">
                <p className="flex items-baseline gap-1.25">
                  <span className="font-display text-price text-primary">
                    {formatPrice(offer.priceVnd)}
                  </span>
                  <s aria-hidden className="text-label text-muted-foreground">
                    {original}
                  </s>
                  <span className="sr-only">{cards("originalPrice", { price: original })}</span>
                </p>
                <CartPortions offer={offer} />
              </div>
            </div>
            <About offer={offer} />
            <section className="flex flex-col gap-2 border-t border-border pt-4">
              <h3 className="text-title-lg text-foreground">{t("notes")}</h3>
              <ul className="list-inside list-disc text-body-sm text-muted-foreground">
                <li>{t("bringBag")}</li>
                <li>{t("askSeller")}</li>
              </ul>
            </section>
          </div>
          {/* Opened afresh each time, so the count starts again at one. */}
          {open && <AddBar offer={offer} onAdded={() => onOpenChange(false)} />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/** What the seller says of the dish, then its weight when they gave one; nothing when they gave neither. */
function About({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("Dish");
  const weight = offer.weightGrams ? t("weight", { grams: offer.weightGrams }) : "";
  const about = [offer.description.trim(), weight].filter(Boolean).join(" ");
  if (!about) return null;

  return (
    <section className="flex flex-col gap-2 border-t border-border pt-4">
      <h3 className="text-title-lg text-foreground">{t("about")}</h3>
      <p className="text-body-sm text-muted-foreground">{about}</p>
    </section>
  );
}

function AddBar({ offer, onAdded }: { offer: OfferSummary; onAdded: () => void }) {
  const t = useTranslations("Dish");
  const cart = useCart();
  const room = offer.unitsLeft - quantityOf(cart, offer.id);
  const [count, setCount] = useState(1);

  return (
    <div className="flex items-center gap-4 border-t border-border px-4 pt-3 pb-5">
      {room > 0 && (
        <Stepper
          name={offer.name}
          quantity={count}
          label={t("count", { count, name: offer.name })}
          canAdd={count < room}
          canRemove={count > 1}
          onAdd={() => setCount(count + 1)}
          onRemove={() => setCount(count - 1)}
        />
      )}
      <Button
        size="lg"
        className="flex-1"
        disabled={room <= 0}
        onClick={() => {
          saveCart(addPortions(cart, offer, count));
          onAdded();
        }}
      >
        {room > 0
          ? t("add", { price: formatPrice(count * offer.priceVnd) })
          : t("allChosen", { units: offer.unitsLeft })}
      </Button>
    </div>
  );
}
