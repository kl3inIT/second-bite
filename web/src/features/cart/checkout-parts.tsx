"use client";

import { useFormatter, useTranslations } from "next-intl";

import { formatPrice } from "@/features/offers/format";
import { directionsHref } from "@/features/offers/offer";
import { OfferPhoto } from "@/features/offers/offer-photo";
import { SellerLogo } from "@/features/offers/seller-logo";

import {
  collectionWindow,
  oneMore,
  removeOne,
  type Basket,
  type Cart,
  type CartLine,
} from "./cart";
import { saveCart } from "./cart-store";
import type { Contact } from "./contact";
import { Stepper } from "./quantity-stepper";
import type { usePlaceCart } from "./use-place-cart";

/** What a layout of the confirmation is given: the cart, whether it is ordering, why it did not, and who collects. */
export type CheckoutProps = {
  cart: Cart;
  pending: boolean;
  problem: ReturnType<typeof usePlaceCart>["problem"];
  onConfirmed: (contact: Contact) => void;
};

// One seller's order (Figma K5 "đơn · quán"): the seller's logo, name, floor and window with the way there, over
// the dishes ordered from them, on a card with a hairline.
export function SellerOrder({ cart, basket }: { cart: Cart; basket: Basket }) {
  const t = useTranslations("Cart");
  const { from, until } = useWindow(basket);
  const heading = `seller-${basket.seller.id}`;

  return (
    <section
      aria-labelledby={heading}
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3.5"
    >
      <div className="flex items-center gap-2.5">
        <SellerLogo seller={basket.seller} size="sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 id={heading} className="truncate text-title-lg text-foreground">
            {basket.seller.name}
          </h2>
          <p className="text-label text-muted-foreground">
            {t("sellerWindow", { place: basket.seller.address, from, until })}
          </p>
        </div>
        <a
          href={directionsHref(basket.collectionPoint)}
          target="_blank"
          rel="noreferrer"
          className="-mr-2 flex min-h-11 shrink-0 items-center rounded-lg px-2 text-label-strong text-link focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
        >
          {t("directions")}
        </a>
      </div>
      <ul className="flex flex-col gap-3 border-t border-border pt-3">
        {basket.lines.map((line) => (
          <li key={line.id}>
            <LineRow cart={cart} line={line} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// A dish of the cart (Figma K5 "món"): its photograph, the dish over what its portions cost, and its − and +; at
// one portion − takes it out of the cart at once.
function LineRow({ cart, line }: { cart: Cart; line: CartLine }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative size-13 shrink-0 overflow-hidden rounded-md bg-muted">
        {line.photo && <OfferPhoto offer={{ photo: line.photo }} sizes="52px" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-body-sm text-foreground">{line.name}</p>
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

export function CancelPolicy({ basket }: { basket: Basket }) {
  const t = useTranslations("Cart");
  const { from } = useWindow(basket);

  return <p className="text-label text-muted-foreground">{t("cancelBody", { time: from })}</p>;
}

function useWindow(basket: Basket): { from: string; until: string } {
  const format = useFormatter();
  const { windowStart, windowEnd } = collectionWindow(basket);
  return {
    from: format.dateTime(new Date(windowStart), "time"),
    until: format.dateTime(new Date(windowEnd), "time"),
  };
}
