import { notFound } from "next/navigation";
import { getFormatter, getTimeZone, getTranslations } from "next-intl/server";

import { PageBar } from "@/components/page-bar";
import { LiveRefresh } from "@/features/orders/live-refresh";
import { dayOf, isOpen, nowMs } from "@/features/orders/order";
import { readOrder } from "@/features/orders/read-orders";
import { SignInPrompt } from "@/features/orders/sign-in-prompt";

import { ChatPanel } from "./chat-panel";
import { ChatOrderCard, ChatScreen, SellerDetails } from "./chat-parts";
import { readOrderChat } from "./read-chat";

/**
 * A customer's chat with the seller of an order (SEC-117, Figma K7, K7b, WK8): the blue bar with the seller's
 * name, and the chat with the order's card; on a wide screen the order and the seller beside it. The order is
 * read as its own page reads it, so a customer who did not sign in opens it with the access this browser keeps.
 * It reads the request, so it renders inside Suspense.
 */
export async function CustomerChat({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const read = await readOrder(orderId);
  if (!read.known) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-8">
        <SignInPrompt returnTo={`/orders/${orderId}/chat`} />
      </main>
    );
  }
  const order = read.value;
  if (!order) notFound();

  const [t, orders, format, timeZone, chat] = await Promise.all([
    getTranslations("Chat"),
    getTranslations("Orders"),
    getFormatter(),
    getTimeZone(),
    readOrderChat(order.id, order.access),
  ]);
  const day =
    dayOf(order.createdAt, nowMs(), timeZone) === "today"
      ? t("confirmedToday", { number: order.number })
      : t("confirmedOn", {
          date: orders("date", {
            day: format.dateTime(new Date(order.createdAt), "dayOfMonth"),
            month: format.dateTime(new Date(order.createdAt), "monthOfYear"),
          }),
          number: order.number,
        });
  const page = `/orders/${order.id}`;

  return (
    <>
      <LiveRefresh
        topics={[`order:${order.id}`]}
        orderIds={[order.id]}
        at={[order.windowStart, order.windowEnd]}
      />
      <ChatScreen
        header={<PageBar title={order.seller.name} back={page} returnTo={`${page}/chat`} />}
        crumbs={[
          { label: orders("mine"), href: "/orders" },
          { label: `#${order.number}`, href: page },
          { label: t("withStore", { seller: order.seller.name }) },
        ]}
        aside={<SellerDetails order={order} />}
      >
        <ChatPanel
          orderId={order.id}
          access={order.access}
          side="customer"
          initial={chat}
          windowEnd={isOpen(order) ? order.windowEnd : undefined}
          card={<ChatOrderCard order={order} />}
          day={day}
        />
      </ChatScreen>
    </>
  );
}
