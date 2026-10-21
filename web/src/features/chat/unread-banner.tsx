import { MessageCircleIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Side } from "@/lib/live-client";

import { otherSide } from "./chat-model";
import { readOrderChat } from "./read-chat";

/**
 * "Quán vừa nhắn" at the top of an order's page (Figma D4; "Khách vừa nhắn" on the seller's, Q5j): the other
 * side's latest message in quotes and the way to the chat, shown while messages are unread (design decision 35).
 * The order carries only the count, so the text is read here from the chat. It reads the request, so it renders
 * inside Suspense. Nothing when there is no message to quote.
 */
export async function UnreadBanner({
  orderId,
  access,
  side,
  unread,
  href,
}: {
  orderId: string;
  /** The order's access, for a customer who did not sign in. */
  access?: string;
  /** Who reads the page; the banner quotes the other side. */
  side: Side;
  unread: number | undefined;
  /** The chat's address. */
  href: string;
}) {
  if (!unread) return null;
  const [t, chat] = await Promise.all([getTranslations("Chat"), readOrderChat(orderId, access)]);
  const latest = chat.messages.findLast((message) => message.from === otherSide(side));
  if (!latest) return null;

  return (
    <section
      aria-labelledby={`unread-${orderId}`}
      className="flex items-center gap-3 rounded-xl border border-secondary bg-card py-3 pr-5 pl-4 text-card-foreground"
    >
      <span
        aria-hidden
        className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-muted"
      >
        <MessageCircleIcon className="size-4.5 text-primary" />
        <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-destructive ring-2 ring-card" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p id={`unread-${orderId}`} className="text-body-sm-strong">
          {t(side === "customer" ? "storeWrote" : "customerWrote")}
        </p>
        <p className="truncate text-note text-muted-foreground">
          {t("quote", { text: latest.text })}
        </p>
      </div>
      <Link
        href={href}
        className="flex min-h-11 shrink-0 items-center rounded-sm text-body-sm-strong text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {t(side === "customer" ? "seeMessage" : "reply")}
      </Link>
    </section>
  );
}
