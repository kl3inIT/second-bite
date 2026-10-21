"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { ChoiceOption } from "@/components/choice-option";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { RadioGroup } from "@/components/ui/radio-group";
import { formatPrice } from "@/features/offers/format";
import { directionsHref } from "@/features/offers/offer";
import { SellerLogo } from "@/features/offers/seller-logo";
import { useMeters } from "@/features/offers/window";
import { Link } from "@/i18n/navigation";

import { collectionWindow, totals, withBasket, type Basket, type Cart } from "./cart";
import { saveCart, useCart } from "./cart-store";
import type { Contact } from "./contact";
import { GoneSheet } from "./gone-sheet";
import { OrderButton } from "./order-button";
import { usePlaceCart } from "./use-place-cart";

// The cart's confirmation (Figma K5): where and when to collect at each seller, how to pay at the counter, the
// dishes with "Sửa món", the totals, the cancellation policy, and "Đặt món", which
// asks who collects in a sheet and checks the phone number once, then orders each seller's dishes and opens the order, signed
// in or not (SEC-76); a dish someone else took first asks what to do with the rest (O7).
export function Checkout() {
  const t = useTranslations("Cart");
  const cart = useCart();

  if (!cart) {
    return (
      <Empty surface="card" className="mx-4 mt-4 w-auto">
        <EmptyHeader>
          <EmptyTitle>{t("empty")}</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/" className={buttonVariants({ variant: "secondary" })}>
            {t("browse")}
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  return <Confirmation cart={cart} />;
}

function Confirmation({ cart }: { cart: Cart }) {
  const t = useTranslations("Cart");
  const [payment, setPayment] = useState("transfer");
  const [contact, setContact] = useState<Contact>();
  const { place, pending, problem, dismiss } = usePlaceCart();
  const { units, priceVnd, originalPriceVnd } = totals(cart);
  const several = cart.baskets.length > 1;

  return (
    <>
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 bg-card px-4 pt-4 pb-6">
        <section aria-labelledby="collect" className="flex flex-col gap-3">
          <h2 id="collect" className="text-title-lg text-foreground">
            {t("collectAt")}
          </h2>
          {cart.baskets.map((basket) => (
            <CollectionPoint key={basket.seller.id} basket={basket} />
          ))}
        </section>
        <section aria-labelledby="pay" className="flex flex-col gap-3">
          <h2 id="pay" className="text-title-lg text-foreground">
            {t("pay")}
          </h2>
          <RadioGroup
            value={payment}
            onValueChange={(value) => setPayment(String(value))}
            aria-labelledby="pay"
          >
            <ChoiceOption value="transfer" title={t("transfer")} hint={t("transferHint")} />
            <ChoiceOption value="cash" title={t("cash")} hint={t("cashHint")} />
          </RadioGroup>
        </section>
        <section aria-labelledby="summary" className="flex flex-col gap-3">
          <h2 id="summary" className="text-title-lg text-foreground">
            {t("summaryTitle")}
          </h2>
          {cart.baskets.map((basket) => (
            <BasketLines key={basket.seller.id} basket={basket} named={several} />
          ))}
          <dl className="flex flex-col gap-3 border-t border-border pt-3 text-body-sm text-foreground">
            <div className="flex items-center justify-between gap-3">
              <dt>{t("dishes", { units })}</dt>
              <dd className="font-display text-price-sm">{formatPrice(priceVnd)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-title-lg">{t("total")}</dt>
              <dd className="font-display text-price">{formatPrice(priceVnd)}</dd>
            </div>
          </dl>
        </section>
        <section aria-labelledby="cancel" className="flex flex-col gap-1">
          <h2 id="cancel" className="text-label-strong text-muted-foreground uppercase">
            {t("cancelTitle")}
          </h2>
          {cart.baskets.map((basket) => (
            <CancelPolicy key={basket.seller.id} basket={basket} named={several} />
          ))}
        </section>
      </div>
      <div className="sticky bottom-0 z-40 border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-2 px-4 pt-3 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <p className="flex items-baseline gap-1.5">
                <span className="font-display text-price-lg text-primary">
                  {formatPrice(priceVnd)}
                </span>
                <s className="text-label text-muted-foreground">{formatPrice(originalPriceVnd)}</s>
              </p>
              <p className="text-label-strong text-foreground">
                {t("totalSummary", { units, saved: formatPrice(originalPriceVnd - priceVnd) })}
              </p>
            </div>
            <div className="flex flex-1 *:w-full">
              <OrderButton
                pending={pending}
                onConfirmed={(confirmed) => {
                  setContact(confirmed);
                  place(cart, confirmed);
                }}
              />
            </div>
          </div>
          {problem?.kind === "failed" && (
            <p role="alert" className="text-label text-destructive">
              {problem.detail ??
                (problem.reference
                  ? t("orderFailed", { reference: problem.reference })
                  : t("orderFailedPlain"))}
            </p>
          )}
        </div>
      </div>
      {problem?.kind === "gone" && (
        <GoneSheet
          cut={problem.cut}
          rest={problem.rest}
          sellerId={problem.sellerId}
          onKeep={() => {
            dismiss();
            saveCart(withBasket(cart, problem.sellerId, problem.rest));
          }}
          onOrderRest={(rest) => {
            const next = withBasket(cart, problem.sellerId, rest);
            saveCart(next);
            if (next && contact) place(next, contact);
          }}
        />
      )}
    </>
  );
}

/** Where and when one seller's dishes are collected, with the way there. */
function CollectionPoint({ basket }: { basket: Basket }) {
  const t = useTranslations("Cart");
  const { from, until } = useWindow(basket);
  const distance = useMeters(basket.distanceMeters);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-3.5 py-3">
      <SellerLogo seller={basket.seller} size="lg" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-body-sm-strong text-foreground">
          {t("place", { seller: basket.seller.name, place: basket.seller.address })}
        </p>
        {distance && <p className="text-label text-muted-foreground">{t("away", { distance })}</p>}
        <p className="text-label text-foreground">{t("window", { from, until })}</p>
        <a
          href={directionsHref(basket.collectionPoint)}
          target="_blank"
          rel="noreferrer"
          className="self-start text-label-strong text-link focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
        >
          {t("directions")}
        </a>
      </div>
    </div>
  );
}

/** One seller's dishes with "Sửa món" back to the seller, under the seller's name when there are several. */
function BasketLines({ basket, named }: { basket: Basket; named: boolean }) {
  const t = useTranslations("Cart");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className={named ? "text-body-sm-strong text-foreground" : "sr-only"}>
          {basket.seller.name}
        </h3>
        <Link
          href={`/sellers/${basket.seller.id}`}
          aria-label={named ? t("editAt", { seller: basket.seller.name }) : undefined}
          className="-my-3 flex min-h-11 items-center text-body-sm-strong text-link focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
        >
          {t("edit")}
        </Link>
      </div>
      <ul className="flex flex-col gap-3">
        {basket.lines.map((line) => (
          <li
            key={line.id}
            className="flex items-center justify-between gap-3 text-body-sm text-foreground"
          >
            <span className="min-w-0">
              {t("line", { quantity: line.quantity, name: line.name })}
            </span>
            <span className="shrink-0 font-display text-price-sm">
              {formatPrice(line.quantity * line.priceVnd)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CancelPolicy({ basket, named }: { basket: Basket; named: boolean }) {
  const t = useTranslations("Cart");
  const { from } = useWindow(basket);
  const body = t("cancelBody", { time: from });

  return (
    <p className="text-label text-muted-foreground">
      {named ? t("cancelAt", { seller: basket.seller.name, body }) : body}
    </p>
  );
}

function useWindow(basket: Basket): { from: string; until: string } {
  const format = useFormatter();
  const { windowStart, windowEnd } = collectionWindow(basket);
  return {
    from: format.dateTime(new Date(windowStart), "time"),
    until: format.dateTime(new Date(windowEnd), "time"),
  };
}
