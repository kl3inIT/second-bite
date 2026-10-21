"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { formatPrice } from "@/features/offers/format";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@/i18n/navigation";
import { FailureAlert } from "@/components/failure-alert";

import { totals, withBasket, type Cart } from "./cart";
import { saveCart, useCart } from "./cart-store";
import { CheckoutDesktop } from "./checkout-desktop";
import { PaymentChoice, SellerOrder, type CheckoutProps } from "./checkout-parts";
import type { Contact } from "./contact";
import { GoneSheet } from "./gone-sheet";
import { OrderButton } from "./order-button";
import { usePlaceCart } from "./use-place-cart";

// The cart's confirmation (Figma K5): one card per seller's order with where and when to collect and the dishes
// each with its − and +, how to pay at the counter, the totals, the cancellation policy, and "Đặt món" ("Đặt 2 đơn"
// for two sellers), which
// asks who collects in a sheet and checks the phone number once, then orders each seller's dishes and opens the order, signed
// in or not (SEC-76); a dish someone else took first asks what to do with the rest (O7). From 768px the
// confirmation is `CheckoutDesktop` (Figma WK5, WK5b).
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
  const phone = useIsMobile();
  const [contact, setContact] = useState<Contact>();
  const { place, pending, problem, dismiss } = usePlaceCart();
  const seller =
    problem?.kind === "gone"
      ? cart.baskets.find((basket) => basket.seller.id === problem.sellerId)?.seller
      : undefined;
  const props = {
    cart,
    pending,
    problem,
    onConfirmed: (confirmed: Contact) => {
      setContact(confirmed);
      place(cart, confirmed);
    },
  };

  return (
    <>
      {/* The cart is drawn on the client only, so choosing the layout by the width never mismatches the server's HTML. */}
      {phone ? <CheckoutPhone {...props} /> : <CheckoutDesktop {...props} />}
      {problem?.kind === "gone" && seller && (
        <GoneSheet
          cart={cart}
          cut={problem.cut}
          rest={problem.rest}
          seller={seller}
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

// The confirmation on a phone: the cards, payment, the summary and the policy in one column, with the bar at the foot.
function CheckoutPhone({ cart, pending, problem, onConfirmed }: CheckoutProps) {
  const t = useTranslations("Cart");
  const { units, priceVnd, originalPriceVnd } = totals(cart);
  const orders = cart.baskets.length;

  return (
    <>
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 bg-card px-4 pt-4 pb-6">
        {cart.baskets.map((basket) => (
          <SellerOrder key={basket.seller.id} cart={cart} basket={basket} />
        ))}
        <section aria-labelledby="pay" className="flex flex-col gap-3">
          <h2 id="pay" className="text-title-lg text-foreground">
            {t("pay")}
          </h2>
          <PaymentChoice />
        </section>
        <section aria-labelledby="summary" className="flex flex-col gap-3">
          <h2 id="summary" className="text-title-lg text-foreground">
            {t("summaryTitle", { orders })}
          </h2>
          <dl className="flex flex-col gap-3 text-body-sm text-foreground">
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
          <p className="text-label text-muted-foreground">{t("cancelBody")}</p>
        </section>
      </div>
      <div className="sticky bottom-0 z-40 border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-2 px-4 pt-3 pb-5">
          {/* With a phone's large text (Zalo grows web text with it) the button takes a line of its own under the
              totals rather than running past the screen, as on the dish page (SEC-112). */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="flex flex-col">
              <p className="flex flex-wrap items-baseline gap-x-1.5">
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
            <FailureAlert failure={problem} fallback={t("orderFailedPlain")} />
          )}
        </div>
      </div>
    </>
  );
}
