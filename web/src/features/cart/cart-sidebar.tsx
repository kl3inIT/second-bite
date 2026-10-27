"use client";

import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { directionsHref } from "@/features/offers/offer";
import { OfferPhoto } from "@/features/offers/offer-photo";
import { SellerLogo } from "@/features/offers/seller-logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@/i18n/navigation";

import { oneMore, removeOne, totals, type Basket, type Cart, type CartLine } from "./cart";
import { saveCart, useCart } from "./cart-store";
import { useWindow } from "./checkout-parts";
import { Stepper } from "./quantity-stepper";

// The cart beside the seller's menu from 768px (Figma WK3, and "01 · Trang quán & giỏ nhiều quán · đầy đủ"), standing for the bottom bar a phone has: one card for
// each seller the cart holds, the dishes' price, the total, and the way on to "Đặt món". From 1024px it stays in
// view as the menu scrolls; below it, it sits under the menu. It says so while the cart is empty.
export function CartSidebar() {
  const t = useTranslations("Cart");
  const cart = useCart();
  const phone = useIsMobile();
  // A phone has the bar at the foot, so the sidebar is not in its page at all, not only out of sight.
  if (phone) return null;

  return (
    <aside
      aria-labelledby="cart-sidebar"
      className="hidden w-full shrink-0 flex-col gap-4 rounded-3xl bg-card p-6 shadow-card md:flex lg:sticky lg:top-4 lg:w-95"
    >
      <h2 id="cart-sidebar" className="font-display text-card-heading text-foreground">
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
          <SidebarOrder key={basket.seller.id} cart={cart} basket={basket} />
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

// One seller's dishes in the sidebar (Figma "01 · Trang quán & giỏ nhiều quán · đầy đủ", "đơn · quán"): the logo and
// name over tonight's window in Tasco blue, the way there as a pin, the dishes with their − and +, and what this
// seller's dishes come to.
function SidebarOrder({ cart, basket }: { cart: Cart; basket: Basket }) {
  const t = useTranslations("Cart");
  const { from, until } = useWindow(basket);
  const heading = `sidebar-seller-${basket.seller.id}`;
  const subtotal = basket.lines.reduce((sum, line) => sum + line.quantity * line.priceVnd, 0);

  return (
    <section
      aria-labelledby={heading}
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3.5"
    >
      <div className="flex items-center gap-2.5">
        <SellerLogo seller={basket.seller} size="sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 id={heading} className="truncate text-title-lg text-foreground">
            {basket.seller.name}
          </h3>
          <p className="text-label-strong text-primary">{t("pickupWindow", { from, until })}</p>
        </div>
        <a
          href={directionsHref(basket.collectionPoint)}
          target="_blank"
          rel="noreferrer"
          aria-label={t("sellerMap", { seller: basket.seller.name })}
          className={buttonVariants({
            variant: "ghost",
            size: "icon",
            className: "-mr-1.5 text-primary hover:text-primary",
          })}
        >
          <MapPinIcon aria-hidden className="size-5" />
        </a>
      </div>
      <ul className="flex flex-col gap-3 border-t border-border pt-3">
        {basket.lines.map((line) => (
          <li key={line.id}>
            <SidebarLine cart={cart} line={line} />
          </li>
        ))}
      </ul>
      <p className="flex items-center justify-between gap-3 text-foreground">
        <span className="text-note font-semibold">
          {t("sellerTotal", { seller: basket.seller.name })}
        </span>
        <span className="text-body-sm-strong">{formatPrice(subtotal)}</span>
      </p>
    </section>
  );
}

// A dish in the sidebar: its photograph, its whole name over what its portions cost, and its − and +.
function SidebarLine({ cart, line }: { cart: Cart; line: CartLine }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative size-13 shrink-0 overflow-hidden rounded-md bg-muted">
        {line.photo && <OfferPhoto offer={{ photo: line.photo }} sizes="52px" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-body-sm break-words text-foreground">{line.name}</p>
        <p className="font-display text-price-sm text-foreground">
          {formatPrice(line.quantity * line.priceVnd)}
        </p>
      </div>
      <Stepper
        name={line.name}
        quantity={line.quantity}
        canAdd={line.quantity < line.unitsLeft}
        onAdd={() => saveCart(oneMore(cart, line.id))}
        onRemove={() => saveCart(removeOne(cart, line.id))}
      />
    </div>
  );
}
