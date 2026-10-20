"use client";

import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { OfferSummary } from "@/features/offers/offer";

import { addOne, startWith, totals, type Cart } from "./cart";
import { saveCart, useCart } from "./cart-store";

/**
 * Adding one portion to the cart. A dish of another seller than the cart's asks first (Figma K4c "Bắt đầu
 * giỏ mới?"): `sheet` is that question, to be rendered beside whatever calls `add`.
 */
export function useAddToCart(): {
  cart: Cart | null;
  add: (offer: OfferSummary) => void;
  sheet: React.ReactNode;
} {
  const t = useTranslations("Cart");
  const cart = useCart();
  const [pending, setPending] = useState<{ offer: OfferSummary; held: Cart }>();

  function add(offer: OfferSummary) {
    const result = addOne(cart, offer);
    if (result.conflict) setPending({ offer, held: result.conflict });
    else saveCart(result.cart);
  }

  const sheet = (
    <Drawer open={pending !== undefined} onOpenChange={(open) => !open && setPending(undefined)}>
      <DrawerContent>
        {pending && (
          <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-5 pb-6">
            <div className="flex items-center justify-between gap-3">
              <DrawerTitle>{t("newTitle")}</DrawerTitle>
              <DrawerClose render={<Button variant="ghost" size="icon" aria-label={t("close")} />}>
                <XIcon aria-hidden className="size-5" />
              </DrawerClose>
            </div>
            <DrawerDescription>
              {t("newBody", {
                units: totals(pending.held).units,
                held: pending.held.seller.name,
                seller: pending.offer.seller.name,
              })}
            </DrawerDescription>
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                onClick={() => {
                  saveCart(startWith(pending.offer));
                  setPending(undefined);
                }}
              >
                {t("newStart")}
              </Button>
              <DrawerClose render={<Button size="lg" variant="secondary" />}>
                {t("newKeep")}
              </DrawerClose>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );

  return { cart, add, sheet };
}
