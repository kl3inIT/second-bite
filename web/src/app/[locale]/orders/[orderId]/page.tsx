import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { CustomerHeader } from "@/components/customer-header";
import { Skeleton } from "@/components/ui/skeleton";
import { UnreadBanner } from "@/features/chat/unread-banner";
import { LiveRefresh } from "@/features/orders/live-refresh";
import {
  CollectedOrder,
  EndedOrder,
  EndedOrderBar,
  hasEnded,
  OpenOrder,
} from "@/features/orders/order-view";
import { readOrderView } from "@/features/orders/read-orders";
import { SignInPrompt } from "@/features/orders/sign-in-prompt";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Orders");
  return { title: `${t("orderTitle")} · Second Bite`, robots: { index: false } };
}

// One seller's order, to its customer (Figma K6, K6b, D5): an open order under the blue band with its window, steps
// and code; a collected one with what it saved and its rating; any other ended one as a receipt with what
// happened. A phone's open or collected order draws its own bar in its band; from 768px they sit under the
// customer header, and an ended order draws its own bar.
export default function OrderPage({ params }: PageProps<"/[locale]/orders/[orderId]">) {
  return (
    <Suspense
      fallback={
        <Main>
          <div className="mx-auto w-full max-w-xl px-4 py-8">
            <Skeleton shape="card" className="h-64" />
          </div>
        </Main>
      }
    >
      <OrderView params={params} />
    </Suspense>
  );
}

function Main({ children }: { children: React.ReactNode }) {
  return <main className="flex flex-1 flex-col pb-10 md:pb-14">{children}</main>;
}

async function OrderView({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const read = await readOrderView(orderId);
  if (!read.known) {
    return (
      <Main>
        <div className="mx-auto w-full max-w-xl px-4 py-8">
          <SignInPrompt returnTo={`/orders/${orderId}`} />
        </div>
      </Main>
    );
  }
  if (!read.value) notFound();
  const { order, cancellable, together, now } = read.value;

  // The order follows its notices, and the moments its window opens and closes (SEC-117), whatever it shows.
  const live = (
    <LiveRefresh topics={[`order:${order.id}`]} at={[order.windowStart, order.windowEnd]} />
  );
  const banner = order.unreadMessages ? (
    <div className="mx-auto w-full max-w-xl px-4 pt-4 md:max-w-3xl lg:max-w-300">
      <UnreadBanner
        orderId={order.id}
        access={order.access}
        side="customer"
        unread={order.unreadMessages}
        href={`/orders/${order.id}/chat`}
      />
    </div>
  ) : null;

  if (hasEnded(order)) {
    return (
      <>
        {live}
        <EndedOrderBar order={order} />
        <Main>
          {banner}
          <EndedOrder order={order} now={now} />
        </Main>
      </>
    );
  }

  return (
    <>
      {live}
      {order.status === "collected" && order.review ? (
        <EndedOrderBar order={order} />
      ) : (
        <CustomerHeader returnTo={`/orders/${orderId}`} />
      )}
      <Main>
        {banner}
        {order.status === "collected" ? (
          <CollectedOrder order={order} together={together} now={now} />
        ) : (
          <OpenOrder order={order} cancellable={cancellable} together={together} now={now} />
        )}
      </Main>
    </>
  );
}
