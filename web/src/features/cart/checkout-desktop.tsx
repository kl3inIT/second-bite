"use client";

import { useTranslations } from "next-intl";

import { formatPrice } from "@/features/offers/format";

import { totals } from "./cart";
import { PaymentChoice, SellerOrder, type CheckoutProps } from "./checkout-parts";
import { OrderButton } from "./order-button";

// The cart's confirmation from 768px (Figma WK5): the page's intro, then at the left one card per seller's order, how
// to pay at the counter (a line, the only way) and the cancellation policy; at the right the summary with each
// seller's portions, the total, the price over what it would have been and "Đặt món", which asks who collects in a
// dialog (SEC-76). The two columns stack below 1024px, the summary under the cards.
export function CheckoutDesktop({ cart, pending, problem, onConfirmed }: CheckoutProps) {
  const t = useTranslations("Cart");
  const { units, priceVnd, originalPriceVnd } = totals(cart);
  const orders = cart.baskets.length;

  return (
    <div className="mx-auto flex w-full max-w-292 flex-col gap-6 px-8 py-8 lg:flex-row lg:items-start lg:px-0">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <p className="text-body text-muted-foreground">{t("intro")}</p>
        {cart.baskets.map((basket) => (
          <SellerOrder key={basket.seller.id} cart={cart} basket={basket} />
        ))}
        <section aria-labelledby="pay" className="flex flex-col gap-3">
          <h2 id="pay" className="text-title-lg text-foreground">
            {t("pay")}
          </h2>
          <PaymentChoice />
        </section>
        <section aria-labelledby="cancel" className="flex flex-col gap-1">
          <h2 id="cancel" className="text-title-lg text-foreground">
            {t("cancelTitle")}
          </h2>
          <p className="text-label text-muted-foreground">{t("cancelBody")}</p>
        </section>
      </div>
      <section
        aria-labelledby="summary"
        className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-card lg:sticky lg:top-4 lg:w-100"
      >
        <h2 id="summary" className="text-title-lg text-foreground">
          {t("summaryTitle", { orders })}
        </h2>
        <ul className="flex flex-col gap-3 text-body-sm text-foreground">
          {cart.baskets.map((basket) => {
            const own = totals(basket);
            return (
              <li key={basket.seller.id} className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate">
                  {t("sellerUnits", { seller: basket.seller.name, units: own.units })}
                </span>
                <span className="shrink-0 font-display text-price-sm">
                  {formatPrice(own.priceVnd)}
                </span>
              </li>
            );
          })}
        </ul>
        <dl className="flex flex-col gap-3 border-t border-border pt-3 text-body-sm text-foreground">
          <div className="flex items-center justify-between gap-3">
            <dt>{t("dishes", { units })}</dt>
            <dd className="font-display text-price-sm">{formatPrice(priceVnd)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-title">{t("total")}</dt>
            <dd className="font-display text-price">{formatPrice(priceVnd)}</dd>
          </div>
        </dl>
        <div className="flex flex-col gap-2 border-t border-border pt-3">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <p className="flex items-baseline gap-1.5">
                <span className="font-display text-price-lg text-primary">
                  {formatPrice(priceVnd)}
                </span>
                <s className="text-label text-muted-foreground">{formatPrice(originalPriceVnd)}</s>
              </p>
              <p className="text-label-strong text-foreground">
                {t("totalSummary", {
                  orders,
                  units,
                  saved: formatPrice(originalPriceVnd - priceVnd),
                })}
              </p>
            </div>
            <div className="flex flex-1 *:w-full">
              <OrderButton orders={orders} pending={pending} onConfirmed={onConfirmed} />
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
      </section>
    </div>
  );
}
