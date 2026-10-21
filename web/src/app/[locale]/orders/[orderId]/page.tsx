import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { OrdersHeader, OrdersHeaderFallback } from "@/features/orders/orders-header";
import { EndedOrder, hasEnded, OpenOrder } from "@/features/orders/order-view";
import { formatPrice } from "@/features/offers/format";
import type { Order } from "@/features/orders/order";
import { readOrderView, type OrderPart } from "@/features/orders/read-orders";
import { SignInPrompt } from "@/features/orders/sign-in-prompt";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Orders");
  return { title: `${t("orderTitle")} · Second Bite`, robots: { index: false } };
}

// One order, to its customer (SEC-51, Figma W2–W6): an open order on the blue band with its window, code and
// steps; an ended one on a tinted band with what happened.
export default function OrderPage({ params }: PageProps<"/[locale]/orders/[orderId]">) {
  const returnTo = params.then(({ orderId }) => `/orders/${orderId}`);

  return (
    <>
      {/* The order's address is known only at request time, so the header, which reads it to switch the
          language, streams in with the order. */}
      <Suspense fallback={<OrdersHeaderFallback />}>
        <Header returnTo={returnTo} />
      </Suspense>
      <main className="flex-1 pb-10">
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-5xl px-4 py-8">
              <Skeleton shape="card" className="h-64" />
            </div>
          }
        >
          <OrderView params={params} />
        </Suspense>
      </main>
    </>
  );
}

async function Header({ returnTo }: { returnTo: Promise<string> }) {
  return <OrdersHeader returnTo={await returnTo} />;
}

async function OrderView({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const read = await readOrderView(orderId);
  if (!read.known) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-8">
        <SignInPrompt returnTo={`/orders/${orderId}`} />
      </div>
    );
  }
  if (!read.value) notFound();
  const { parts, now } = read.value;

  if (parts.length === 1) return <Part {...parts[0]} now={now} level="page" />;
  return (
    <>
      <PlacedTogether orders={parts.map(({ order }) => order)} />
      {parts.map((part) => (
        <Part key={part.order.id} {...part} now={now} level="part" />
      ))}
    </>
  );
}

function Part({
  order,
  cancellable,
  now,
  level,
}: OrderPart & { now: number; level: "page" | "part" }) {
  return hasEnded(order) ? (
    <EndedOrder order={order} level={level} />
  ) : (
    <OpenOrder order={order} cancellable={cancellable} now={now} level={level} />
  );
}

/** The title of orders placed together from one cart: one per seller, each with its own code (SEC-76 › decision 8). */
async function PlacedTogether({ orders }: { orders: Order[] }) {
  const t = await getTranslations("Orders");
  const total = orders.reduce((sum, order) => sum + order.totalVnd, 0);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 pt-6 xl:max-w-300">
      <h1 className="text-headline">{t("togetherTitle", { sellers: orders.length })}</h1>
      <p className="text-body-sm text-muted-foreground">
        {t("togetherBody", {
          names: orders.map((order) => order.seller.name).join(", "),
          total: formatPrice(total),
        })}
      </p>
    </div>
  );
}
