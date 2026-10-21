"use client";

import { useTranslations } from "next-intl";

import { Button, buttonVariants } from "@/components/ui/button";
import { isAvailable, type OfferSummary } from "@/features/offers/offer";
import { Link } from "@/i18n/navigation";

import { addOne, quantityOf, totals } from "./cart";
import { saveCart, useCart } from "./cart-store";

// The dish's button (Figma K4 "Thêm vào giỏ"): one portion into the cart, then the way to the cart; a dish
// with nothing left cannot be added.
export function AddToCartButton({ offer }: { offer: OfferSummary }) {
  const t = useTranslations("Cart");
  const cart = useCart();
  const inCart = quantityOf(cart, offer.id) > 0;

  return (
    <div className="flex flex-1 *:w-full">
      {!isAvailable(offer) ? (
        <Button size="lg" disabled>
          {t("soldOut")}
        </Button>
      ) : inCart && cart ? (
        <Link href="/cart" className={buttonVariants({ size: "lg" })}>
          {t("view", { units: totals(cart).units })}
        </Link>
      ) : (
        <Button size="lg" onClick={() => saveCart(addOne(cart, offer))}>
          {t("addToCart")}
        </Button>
      )}
    </div>
  );
}
