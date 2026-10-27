"use client";

import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { totals } from "./cart";
import { useCart } from "./cart-store";

// The cart's bar at the bottom of the page (Figma K4b footer): what the portions cost tonight over what they would
// have cost, how many and how much is saved, and "Xem giỏ hàng", within the page's `width`. The seller's page hides
// it from 768px through `className`, where the sidebar shows the cart; the search keeps it at every width. Hidden
// while the cart is empty.
export function CartBar({ width, className }: { width: string; className?: string }) {
  const t = useTranslations("Cart");
  const cart = useCart();
  if (!cart) return null;
  const { units, priceVnd, originalPriceVnd } = totals(cart);

  return (
    <div className={cn("sticky bottom-0 z-40 border-t border-border bg-card", className)}>
      <div className={cn("mx-auto flex w-full items-center gap-4 px-4 pt-3 pb-5", width)}>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-1.5">
            <span className="font-display text-price-lg text-primary">{formatPrice(priceVnd)}</span>
            <s className="text-label text-muted-foreground">{formatPrice(originalPriceVnd)}</s>
          </p>
          <p className="text-label-strong text-foreground">
            {t("summary", { units, saved: formatPrice(originalPriceVnd - priceVnd) })}
          </p>
        </div>
        <div className="flex flex-1 justify-end *:w-full md:*:w-64">
          <Link href="/cart" className={buttonVariants({ size: "lg" })}>
            {t("open")}
          </Link>
        </div>
      </div>
    </div>
  );
}
