"use client";

import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { Link } from "@/i18n/navigation";

import { totals, type Cart } from "./cart";
import { useCart } from "./cart-store";
import { SellerOrder } from "./checkout-parts";

// The cart beside the seller's menu from 768px (Figma WK3), standing for the bottom bar a phone has: one card for
// each seller the cart holds, the dishes' price, the total, and the way on to "Đặt món". From 1024px it stays in
// view as the menu scrolls; below it, it sits under the menu. It says so while the cart is empty.
export function CartSidebar() {
  const t = useTranslations("Cart");
  const cart = useCart();

  return (
    <aside
      aria-labelledby="cart-sidebar"
      className="hidden w-full shrink-0 flex-col gap-4 rounded-3xl bg-card p-6 shadow-card md:flex lg:sticky lg:top-4 lg:w-95"
    >
      <h2 id="cart-sidebar" className="text-title-lg text-foreground">
        {t("sidebarTitle", { sellers: cart?.baskets.length ?? 0 })}
      </h2>
      {cart ? (
        <Filled cart={cart} />
      ) : (
        <p className="text-body-sm text-muted-foreground">{t("sidebarEmpty")}</p>
      )}
    </aside>
  );
}

function Filled({ cart }: { cart: Cart }) {
  const t = useTranslations("Cart");
  const { units, priceVnd } = totals(cart);

  return (
    <>
      <div className="flex flex-col gap-3">
        {cart.baskets.map((basket) => (
          <SellerOrder key={basket.seller.id} cart={cart} basket={basket} />
        ))}
      </div>
      <dl className="flex flex-col gap-2 border-t border-border pt-3 text-body-sm text-foreground">
        <div className="flex items-center justify-between gap-3">
          <dt>{t("dishes", { units })}</dt>
          <dd className="font-display text-price-sm">{formatPrice(priceVnd)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-title">{t("total")}</dt>
          <dd className="font-display text-price">{formatPrice(priceVnd)}</dd>
        </div>
      </dl>
      <Link href="/cart" className={buttonVariants({ size: "lg" })}>
        {t("orderFor", { orders: cart.baskets.length, price: formatPrice(priceVnd) })}
      </Link>
    </>
  );
}
