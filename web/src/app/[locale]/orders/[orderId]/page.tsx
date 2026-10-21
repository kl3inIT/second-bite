import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { PageBar } from "@/components/page-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/features/offers/format";
import type { Order } from "@/features/orders/order";
import { EndedOrder, hasEnded, OpenOrder } from "@/features/orders/order-view";
import { readOrderView, type OrderPart } from "@/features/orders/read-orders";
import { SignInPrompt } from "@/features/orders/sign-in-prompt";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Orders");
  return { title: `${t("orderTitle")} · Second Bite`, robots: { index: false } };
}

// One order, to its customer (SEC-51, Figma D2, D3, D5): an open order under the blue band with its window, steps
// and code; an ended one as a receipt with what happened. Each draws its own bar, which names the order.
export default function OrderPage({ params }: PageProps<"/[locale]/orders/[orderId]">) {
  return (
    <main className="flex flex-1 flex-col pb-10">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-xl px-4 py-8">
            <Skeleton shape="card" className="h-64" />
          </div>
        }
      >
        <OrderView params={params} />
      </Suspense>
    </main>
  );
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

/**
 * The bar and title of orders placed together from one cart: one per seller, each with its own code (SEC-76 ›
 * decision 8), shown one after another below.
 */
async function PlacedTogether({ orders }: { orders: Order[] }) {
  const t = await getTranslations("Orders");
  const total = orders.reduce((sum, order) => sum + order.totalVnd, 0);

  return (
    <>
      <PageBar title={t("togetherTitle", { sellers: orders.length })} back="/orders" />
      <p className="mx-auto w-full max-w-xl px-4 pt-4 pb-2 text-body-sm text-muted-foreground">
        {t("togetherBody", {
          names: orders.map((order) => order.seller.name).join(", "),
          total: formatPrice(total),
        })}
      </p>
    </>
  );
}
