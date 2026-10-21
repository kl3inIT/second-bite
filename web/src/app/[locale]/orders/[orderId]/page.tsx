import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { UnreadBanner } from "@/features/chat/unread-banner";
import { LiveRefresh } from "@/features/orders/live-refresh";
import { CollectedOrder, EndedOrder, hasEnded, OpenOrder } from "@/features/orders/order-view";
import { readOrderView } from "@/features/orders/read-orders";
import { SignInPrompt } from "@/features/orders/sign-in-prompt";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Orders");
  return { title: `${t("orderTitle")} · Second Bite`, robots: { index: false } };
}

// One seller's order, to its customer (Figma K6, K6b, D5): an open order under the blue band with its window, steps
// and code; a collected one with what it saved and its rating; any other ended one as a receipt with what
// happened. Each draws its own bar, which names the order.
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
  const { order, cancellable, together, now } = read.value;

  // The order follows its notices, and the moments its window opens and closes (SEC-117), whatever it shows.
  return (
    <>
      <LiveRefresh topics={[`order:${order.id}`]} at={[order.windowStart, order.windowEnd]} />
      {order.unreadMessages && !hasEnded(order) ? (
        <div className="mx-auto w-full max-w-xl px-4 py-4 md:max-w-3xl lg:max-w-292 lg:pb-0">
          <UnreadBanner
            orderId={order.id}
            access={order.access}
            side="customer"
            unread={order.unreadMessages}
            href={`/orders/${order.id}/chat`}
          />
        </div>
      ) : null}
      {order.status === "collected" ? (
        <CollectedOrder order={order} together={together} />
      ) : hasEnded(order) ? (
        <EndedOrder order={order} />
      ) : (
        <OpenOrder order={order} cancellable={cancellable} together={together} now={now} />
      )}
    </>
  );
}
