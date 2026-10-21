"use client";

import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";

import { totals } from "./cart";
import { useCart } from "./cart-store";

// The cart's bar at the bottom of the seller's page (Figma K4b footer): what the portions cost tonight over
// what they would have cost, how many and how much is saved, and "Xem giỏ hàng". Hidden while the cart is empty.
export function CartBar() {
  const t = useTranslations("Cart");
  const cart = useCart();
  if (!cart) return null;
  const { units, priceVnd, originalPriceVnd } = totals(cart);

  return (
    <div className="sticky bottom-0 z-40 border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-xl items-center gap-4 px-4 pt-3 pb-5">
        <div className="flex flex-col">
          <p className="flex items-baseline gap-1.5">
            <span className="font-display text-price-lg text-primary">{formatPrice(priceVnd)}</span>
            <s className="text-label text-muted-foreground">{formatPrice(originalPriceVnd)}</s>
          </p>
          <p className="text-label-strong text-foreground">
            {t("summary", { units, saved: formatPrice(originalPriceVnd - priceVnd) })}
          </p>
        </div>
        <div className="flex flex-1 *:w-full">
          <Link href="/cart" className={buttonVariants({ size: "lg" })}>
            {t("open")}
          </Link>
        </div>
      </div>
    </div>
  );
}
