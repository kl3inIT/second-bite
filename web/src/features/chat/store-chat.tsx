import { notFound } from "next/navigation";
import { getFormatter, getTimeZone, getTranslations } from "next-intl/server";

import { LiveRefresh } from "@/features/orders/live-refresh";
import { dayOf, isOpen, nowMs } from "@/features/orders/order";
import { getStoreOrder } from "@/features/seller/my-sellers";
import { requireStore } from "@/features/seller/require-store";
import { Next } from "@/features/seller/store-order";

import { ChatPanel } from "./chat-panel";
import { ChatBar, ChatOrderCard, ChatScreen, CustomerDetails } from "./chat-parts";
import { readOrderChat } from "./read-chat";

/**
 * The seller's people's chat with the customer of an order (SEC-117, Figma Q7, Q5m): the blue bar with the
 * customer's name on a phone, and the chat with the order's card; on a wide screen the customer and what to do
 * next beside it. It reads the session, so it renders inside Suspense.
 */
export async function StoreChat({
  sellerId: pendingId,
  orderId: pendingOrder,
}: {
  sellerId: Promise<string>;
  orderId: Promise<string>;
}) {
  const [sellerId, orderId] = await Promise.all([pendingId, pendingOrder]);
  await requireStore(sellerId, `/stores/${sellerId}/orders/${orderId}/chat`);
  const [order, t, orders, format, timeZone, chat] = await Promise.all([
    getStoreOrder(orderId),
    getTranslations("Chat"),
    getTranslations("StoreOrders"),
    getFormatter(),
    getTimeZone(),
    readOrderChat(orderId),
  ]);
  if (!order || order.seller.id !== sellerId) notFound();

  const placed = new Date(order.createdAt);
  const day =
    dayOf(order.createdAt, nowMs(), timeZone) === "today"
      ? t("confirmedToday", { number: order.number })
      : t("confirmedOn", {
          date: `${format.dateTime(placed, "dayOfMonth")}/${format.dateTime(placed, "monthOfYear")}`,
          number: order.number,
        });
  const list = `/stores/${sellerId}/orders`;
  const page = `${list}/${order.id}`;

  return (
    <>
      <LiveRefresh
        topics={[`order:${order.id}`]}
        orderIds={[order.id]}
        at={[order.windowStart, order.windowEnd]}
      />
      <ChatScreen
        main={false}
        // The store's layout pads its pages and, on a phone, sits under a bar the chat does not have; the chat
        // takes that room back so it fits the screen.
        className="max-md:-mx-4 max-md:-mt-2 max-md:-mb-14"
        header={<ChatBar title={order.customerName} back={page} />}
        crumbs={[
          { label: orders("title"), href: list },
          { label: `#${order.number}`, href: page },
          { label: t("withCustomer", { name: order.customerName }) },
        ]}
        aside={
          <>
            <CustomerDetails order={order} />
            <Next order={order} list={list} />
          </>
        }
      >
        <ChatPanel
          orderId={order.id}
          side="seller"
          initial={chat}
          windowEnd={isOpen(order) ? order.windowEnd : undefined}
          card={
            <ChatOrderCard order={order} phoneTitle={t("orderTitle", { number: order.number })} />
          }
          day={day}
        />
      </ChatScreen>
    </>
  );
}
