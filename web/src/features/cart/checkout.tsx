"use client";

import { MapPinIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { ChoiceOption } from "@/components/choice-option";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { RadioGroup } from "@/components/ui/radio-group";
import { formatPrice } from "@/features/offers/format";
import { directionsHref } from "@/features/offers/offer";
import { useMeters } from "@/features/offers/window";
import { Link } from "@/i18n/navigation";

import { collectionWindow, totals, type Cart } from "./cart";
import { useCart } from "./cart-store";
import { OrderButton } from "./order-button";
import { resumesReady } from "./order-steps";

// The cart's confirmation (Figma K5): where and when to collect, how to pay at the counter, the dishes with
// "Sửa món", the totals with no fee from Second Bite, the cancellation policy, and "Đặt món", which signs in
// and names the account first (L5, L6). Ordering joins SEC-51's order pages once they are on main (SEC-76),
// so until then "Đặt món" says so instead of sending.
export function Checkout(asking: Asking) {
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

  return <Confirmation cart={cart} {...asking} />;
}

/** Who orders, and what "Đặt món" asks before ordering (SEC-76): see `OrderButton`. */
type Asking = Omit<React.ComponentProps<typeof OrderButton>, "held" | "onReady">;

function Confirmation({ cart, ...asking }: { cart: Cart } & Asking) {
  const t = useTranslations("Cart");
  const format = useFormatter();
  const [payment, setPayment] = useState("transfer");
  const [asked, setAsked] = useState(() => resumesReady(asking.account, asking.resumed));
  const { windowStart, windowEnd } = collectionWindow(cart);
  const from = format.dateTime(new Date(windowStart), "time");
  const until = format.dateTime(new Date(windowEnd), "time");
  const { units, priceVnd, originalPriceVnd } = totals(cart);
  const distance = useMeters(cart.distanceMeters);

  return (
    <>
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 bg-card px-4 pt-4 pb-6">
        <section aria-labelledby="collect" className="flex flex-col gap-3">
          <h2 id="collect" className="text-title-lg text-foreground">
            {t("collectAt")}
          </h2>
          <div className="flex items-center gap-3 rounded-lg border border-border px-3.5 py-3">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-md bg-muted text-primary">
              <MapPinIcon aria-hidden strokeWidth={1.8} className="size-6" />
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-body-sm-strong text-foreground">
                {t("place", { seller: cart.seller.name, place: cart.seller.address })}
              </p>
              {distance && (
                <p className="text-label text-muted-foreground">{t("away", { distance })}</p>
              )}
              <p className="text-label text-foreground">{t("window", { from, until })}</p>
              <a
                href={directionsHref(cart.collectionPoint)}
                target="_blank"
                rel="noreferrer"
                className="self-start text-label-strong text-link focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
              >
                {t("directions")}
              </a>
            </div>
          </div>
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
          <div className="flex items-center justify-between gap-3">
            <h2 id="summary" className="text-title-lg text-foreground">
              {t("summaryTitle")}
            </h2>
            <Link
              href={`/sellers/${cart.seller.id}`}
              className="-my-3 flex min-h-11 items-center text-body-sm-strong text-link focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
            >
              {t("edit")}
            </Link>
          </div>
          <ul className="flex flex-col gap-3">
            {cart.lines.map((line) => (
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
          <dl className="flex flex-col gap-3 border-t border-border pt-3 text-body-sm text-foreground">
            <div className="flex items-center justify-between gap-3">
              <dt>{t("dishes", { units })}</dt>
              <dd className="font-display text-price-sm">{formatPrice(priceVnd)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt>{t("thirdParty")}</dt>
              <dd className="text-muted-foreground">{t("none")}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-title-lg">{t("total")}</dt>
              <dd className="font-display text-price">{formatPrice(priceVnd)}</dd>
            </div>
          </dl>
          <p className="text-label text-muted-foreground">
            {t("noCommission", { price: formatPrice(priceVnd) })}
          </p>
        </section>
        <section aria-labelledby="cancel" className="flex flex-col gap-1">
          <h2 id="cancel" className="text-label-strong text-muted-foreground uppercase">
            {t("cancelTitle")}
          </h2>
          <p className="text-label text-muted-foreground">{t("cancelBody", { time: from })}</p>
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
                {...asking}
                held={{ units, seller: cart.seller.name }}
                onReady={() => setAsked(true)}
              />
            </div>
          </div>
          {asked && <output className="text-label text-muted-foreground">{t("orderSoon")}</output>}
        </div>
      </div>
    </>
  );
}
