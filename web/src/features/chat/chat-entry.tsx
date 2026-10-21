import type { Side } from "@/lib/live-client";

import { MessageLink } from "./message-link";
import { readOrderChat } from "./read-chat";

type Entry = { id: string; status: string; unreadMessages?: number };

/**
 * The way into an order's chat from the order's page: "Nhắn quán" / "Nhắn khách" while the chat can be written in,
 * which is while the order is open and after it was collected until the chat closes; "Xem tin nhắn" once it can
 * only be read, and then only when it has messages. No field of the order says whether it has messages, so an
 * order that is no longer open reads its chat here. It reads the request, so it renders inside Suspense.
 */
export async function ChatEntry({
  order,
  side,
  access,
  href,
  variant,
  className,
}: {
  order: Entry;
  side: Side;
  /** The order's access, for a customer who did not sign in. */
  access?: string;
  href: string;
  variant: "secondary" | "outline";
  className?: string;
}) {
  const to = side === "customer" ? "store" : "customer";
  if (order.status === "confirmed" || order.status === "ready") {
    return (
      <MessageLink
        to={to}
        href={href}
        unread={order.unreadMessages}
        variant={variant}
        className={className}
      />
    );
  }
  const chat = await readOrderChat(order.id, access);
  if (chat.messages.length === 0) return null;
  const writable = order.status === "collected" && chat.open;

  return (
    <MessageLink
      to={to}
      view={!writable}
      href={href}
      unread={order.unreadMessages}
      variant={variant}
      className={className}
    />
  );
}
