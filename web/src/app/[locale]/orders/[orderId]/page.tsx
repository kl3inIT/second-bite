import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { TopBar } from "@/components/top-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { CancelOrder } from "@/features/orders/cancel-order";
import { CollectionCode } from "@/features/orders/collection-code";
import { OrderStatusBanner } from "@/features/orders/order-status";
import { CollectionPlace, OrderLines } from "@/features/orders/order-summary";
import { readOrderView } from "@/features/orders/read-orders";
import { SignInPrompt } from "@/features/orders/sign-in-prompt";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Orders");
  return { title: `${t("orderTitle")} · Second Bite`, robots: { index: false } };
}

// One order, to its customer (SEC-51, Figma W2–W6): its status first, the collection code once it may be
// shown, where and when to collect it, what it holds, and cancelling while that is still free.
export default async function OrderPage({ params }: PageProps<"/[locale]/orders/[orderId]">) {
  const t = await getTranslations("Orders");

  return (
    <>
      {/* The order's address is known only at request time, so the bar, which reads it to switch the
          language, streams in with the order. */}
      <Suspense fallback={<div aria-hidden className="h-14 border-b border-border bg-shell" />}>
        <TopBar title={t("orderTitle")} back="/orders" />
      </Suspense>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-4 pb-10 md:pt-8">
        <Suspense fallback={<Skeleton shape="card" className="h-64" />}>
          <OrderView params={params} />
        </Suspense>
      </main>
    </>
  );
}

async function OrderView({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const read = await readOrderView(orderId);
  if (!read.signedIn) return <SignInPrompt returnTo={`/orders/${orderId}`} />;
  if (!read.value) notFound();
  const { order, cancellable } = read.value;

  const format = await getFormatter();

  return (
    <div className="grid gap-4 md:grid-cols-3 md:items-start">
      <div className="flex flex-col gap-4 md:col-span-2">
        <OrderStatusBanner order={order} />
        {order.code ? <CollectionCode code={order.code} /> : null}
        <CollectionPlace
          seller={order.seller.name}
          address={order.seller.address}
          windowStart={order.windowStart}
          windowEnd={order.windowEnd}
        />
      </div>
      <div className="flex flex-col gap-4">
        <OrderLines order={order} />
        {cancellable ? (
          <CancelOrder
            orderId={order.id}
            freeUntil={format.dateTime(new Date(order.windowStart), "time")}
          />
        ) : null}
      </div>
    </div>
  );
}
