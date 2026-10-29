"use client";

import { Trash2Icon } from "lucide-react";
import { useFormatter, useNow, useTranslations } from "next-intl";

import { ChoiceOption } from "@/components/choice-option";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { formatPrice } from "@/features/offers/format";
import { directionsHref } from "@/features/offers/offer";
import { OfferPhoto } from "@/features/offers/offer-photo";
import { SellerLogo } from "@/features/offers/seller-logo";
import { cn } from "@/lib/utils";

import {
  collectionWindow,
  isOver,
  oneMore,
  removeLine,
  removeOne,
  type Basket,
  type Cart,
  type CartLine,
} from "./cart";
import { saveCart } from "./cart-store";
import type { Contact } from "./contact";
import { Stepper } from "./quantity-stepper";
import type { usePlaceCart } from "./use-place-cart";

/**
 * How to pay (Figma K5, WK5): at the counter, chosen, the only way in the pilot; a bank transfer in the app is shown
 * but cannot be chosen until it arrives (SEC-18), and a screen reader hears that it is coming (SEC-114). Nothing
 * about it is sent with the order.
 */
export function PaymentChoice() {
  const t = useTranslations("Cart");

  return (
    <RadioGroup defaultValue="counter" aria-labelledby="pay">
      <ChoiceOption value="counter" title={t("counter")} />
      <ChoiceOption value="transfer" title={t("transfer")} note={t("soon")} disabled />
    </RadioGroup>
  );
}

/** What a layout of the confirmation is given: the cart, whether it is ordering, why it did not, and who collects. */
export type CheckoutProps = {
  cart: Cart;
  /** The cart without the dishes whose window has closed: what the totals count and "Đặt món" orders. */
  live: Cart | null;
  now: number;
  pending: boolean;
  problem: ReturnType<typeof usePlaceCart>["problem"];
  onConfirmed: (contact: Contact) => void;
};

// One seller's order (Figma K5 "đơn · quán"): the seller's logo, name, floor and window with the way there, over
// the dishes ordered from them, on a card with a hairline. A dish whose window has closed stays, marked, until taken out.
export function SellerOrder({ cart, basket, now }: { cart: Cart; basket: Basket; now: number }) {
  const t = useTranslations("Cart");
  const { from, until } = useWindow(basket, now);
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
            <LineRow cart={cart} line={line} over={isOver(line, now)} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// A dish of the cart (Figma K5 "món"): its photograph, the dish over what its portions cost, and its − and +; at
// one portion − takes it out of the cart at once.
function LineRow({ cart, line, over }: { cart: Cart; line: CartLine; over: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "relative size-13 shrink-0 overflow-hidden rounded-md bg-muted",
          over && "opacity-50",
        )}
      >
        {line.photo && <OfferPhoto offer={{ photo: line.photo }} sizes="52px" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className={cn("truncate text-body-sm text-foreground", over && "text-muted-foreground")}>
          {line.name}
        </p>
        <LinePrice line={line} over={over} />
      </div>
      <LineAction cart={cart} line={line} over={over} />
    </div>
  );
}

/** What a dish's portions cost, or "Hết giờ nhận" once its window has closed and it can no longer be ordered. */
export function LinePrice({ line, over }: { line: CartLine; over: boolean }) {
  const t = useTranslations("Cart");

  return over ? (
    <p className="text-label-strong text-sale">{t("over")}</p>
  ) : (
    <p className="font-display text-price-sm text-foreground">
      {formatPrice(line.quantity * line.priceVnd)}
    </p>
  );
}

/** A dish's − and +, or a red bin, which takes it out of the cart at once, once its window has closed. */
export function LineAction({ cart, line, over }: { cart: Cart; line: CartLine; over: boolean }) {
  const t = useTranslations("Cart");

  return over ? (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("dropLabel", { name: line.name })}
      onClick={() => saveCart(removeLine(cart, line.id))}
      className="-mr-2.5"
    >
      <Trash2Icon aria-hidden className="size-5 text-destructive" />
    </Button>
  ) : (
    <Stepper
      name={line.name}
      quantity={line.quantity}
      canAdd={line.quantity < line.unitsLeft}
      onAdd={() => saveCart(oneMore(cart, line.id))}
      onRemove={() => saveCart(removeOne(cart, line.id))}
    />
  );
}

/** The time the cart is read against, again every 30 seconds, so a dish whose window closes while the page is open is marked. */
export function useCartNow(): number {
  return useNow({ updateInterval: 30_000 }).getTime();
}

/** When the basket's dishes can be collected, from those still open; from all of them once every window has closed. */
export function useWindow(basket: Basket, now: number): { from: string; until: string } {
  const format = useFormatter();
  const open = basket.lines.filter((line) => !isOver(line, now));
  const { windowStart, windowEnd } = collectionWindow(
    open.length > 0 ? { ...basket, lines: open } : basket,
  );
  return {
    from: format.dateTime(new Date(windowStart), "time"),
    until: format.dateTime(new Date(windowEnd), "time"),
  };
}
