"use client";

import { MapPinIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/features/offers/format";
import { HeartButton } from "@/features/offers/heart-button";
import { directionsHref, isAvailable, type OfferSummary } from "@/features/offers/offer";
import { ShareButton } from "@/features/offers/share-button";
import { useDistance } from "@/features/offers/window";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { addOne, quantityOf, totals, type Cart } from "./cart";
import { saveCart, useCart } from "./cart-store";

// A round 32px button with a 44px target around it, as the seller page's stepper.
const round =
  "relative flex size-8 shrink-0 items-center justify-center rounded-full after:absolute after:-inset-1.5 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none disabled:bg-secondary disabled:text-muted-foreground";

// The booking card beside a dish on a wide screen (Figma WK4 "khung đặt"): the price, where and when it is
// collected with the way there, how many portions, the cart's button with their total, the cancellation policy,
// then keeping and sharing the dish. Once the dish is in the cart the button leads to the cart.
export function DishBooking({ dish, className }: { dish: OfferSummary; className?: string }) {
  const t = useTranslations("Dish");
  const carts = useTranslations("Cart");
  const cards = useTranslations("OfferCard");
  const format = useFormatter();
  const cart = useCart();
  const distance = useDistance(dish);
  const inCart = quantityOf(cart, dish.id);
  const available = isAvailable(dish);
  const left = Math.max(dish.unitsLeft - inCart, 0);
  const [wanted, setWanted] = useState(1);
  const units = Math.min(wanted, Math.max(left, 1));
  const original = formatPrice(dish.originalPriceVnd);
  const from = format.dateTime(new Date(dish.windowStart), "time");
  const until = format.dateTime(new Date(dish.windowEnd), "time");

  function add() {
    let next: Cart | null = cart;
    for (let i = 0; i < units; i++) next = addOne(next, dish);
    saveCart(next);
    setWanted(1);
  }

  return (
    <aside
      aria-label={t("booking")}
      className={cn("flex flex-col gap-4 rounded-3xl bg-card p-6 shadow-card", className)}
    >
      <div className="flex flex-col">
        <p className="flex items-baseline gap-1.5">
          <span className="font-display text-price-lg text-primary">
            {formatPrice(dish.priceVnd)}
          </span>
          <s aria-hidden className="text-label text-muted-foreground">
            {original}
          </s>
          <span className="sr-only">{cards("originalPrice", { price: original })}</span>
        </p>
        {available ? (
          <p className="text-label-strong text-sale">
            {t("saving", { percent: dish.discountPercent, units: dish.unitsLeft })}
          </p>
        ) : (
          <p className="text-label-strong text-muted-foreground">{cards("soldOut")}</p>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border px-3.5 py-3">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-md bg-muted">
          <MapPinIcon aria-hidden strokeWidth={2} className="size-6 text-primary" />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-title text-foreground">{dish.seller.name}</p>
          <p className="text-note text-muted-foreground">
            {distance
              ? t("placeAway", { place: dish.seller.address, distance })
              : dish.seller.address}
          </p>
          <p className="text-note font-medium text-foreground">{t("window", { from, until })}</p>
          <a
            href={directionsHref(dish.collectionPoint)}
            target="_blank"
            rel="noreferrer"
            className="self-start text-note font-semibold text-link focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
          >
            {carts("directions")}
          </a>
        </div>
      </div>

      {available && left > 0 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-title text-foreground">{t("portions", { units: left })}</p>
          <div className="flex h-10 w-30 items-center justify-between rounded-2xl bg-muted px-1">
            <button
              type="button"
              aria-label={carts("remove", { name: dish.name })}
              disabled={units <= 1}
              onClick={() => setWanted(units - 1)}
              className={cn(round, "bg-card text-primary disabled:bg-card")}
            >
              <MinusIcon aria-hidden strokeWidth={2.4} className="size-4" />
            </button>
            <output aria-live="polite" className="text-title text-foreground">
              {units}
            </output>
            <button
              type="button"
              aria-label={carts("add", { name: dish.name })}
              disabled={units >= left}
              onClick={() => setWanted(units + 1)}
              className={cn(round, "bg-primary text-primary-foreground")}
            >
              <PlusIcon aria-hidden strokeWidth={2.4} className="size-4" />
            </button>
          </div>
        </div>
      )}

      {!available ? (
        <Button size="lg" disabled>
          {carts("soldOut")}
        </Button>
      ) : left === 0 && cart ? (
        <Link href="/cart" className={buttonVariants({ size: "lg" })}>
          {carts("view", { units: totals(cart).units })}
        </Link>
      ) : (
        <>
          <Button size="lg" onClick={add}>
            {t("addUnits", { units, price: formatPrice(dish.priceVnd * units) })}
          </Button>
          {inCart > 0 && cart && (
            <Link
              href="/cart"
              className="-mt-2 self-center text-label-strong text-link focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
            >
              {carts("view", { units: totals(cart).units })}
            </Link>
          )}
        </>
      )}

      <div className="flex flex-col gap-1">
        <h2 className="text-label-strong text-muted-foreground uppercase">
          {carts("cancelTitle")}
        </h2>
        <p className="text-note text-muted-foreground">{carts("cancelBody", { time: from })}</p>
      </div>

      <div className="flex gap-6">
        <HeartButton offerId={dish.id} name={dish.name} labelled />
        <ShareButton title={dish.name} labelled />
      </div>
    </aside>
  );
}
