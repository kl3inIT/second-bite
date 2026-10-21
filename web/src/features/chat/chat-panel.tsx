"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { useLive, useLivePolling } from "@/features/orders/use-live";
import { ApiError, failureOf } from "@/lib/api/client";
import { markOrderMessagesSeen, sendOrderMessage } from "@/lib/api/generated";
import type { Side } from "@/lib/live-client";
import { cn } from "@/lib/utils";

import { readChat } from "./chat-api";
import { ChatFooter } from "./chat-footer";
import {
  type Chat,
  closed,
  closesAt,
  isSeen,
  lastSeq,
  mergeChat,
  unseenUpTo,
  withMessage,
  withSeen,
} from "./chat-model";

/** While the socket is down, an open chat reads what is new this often, and only while the tab is shown. */
const POLL_MS = 5000;
/** How close to the end the messages must be scrolled for a new one to bring the end into view. */
const NEAR_END_PX = 96;
/** The longest a timer may wait. */
const MAX_TIMER_MS = 2 ** 31 - 1;

/** A message being sent, or one that was not sent and waits for another try with the same key. */
type Outgoing = { key: string; text: string; failure?: { detail?: string; reference?: string } };

function subscribeVisibility(listener: () => void) {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}

/** Whether the tab is shown, so a message is marked seen only while someone can see it. */
function useTabShown(): boolean {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );
}

/**
 * Whether `deadline` has passed, which turns on at the moment it does. The server's reading of the chat decides
 * until the page has loaded, so the first render and the server's agree.
 */
function usePassed(deadline: string | undefined): boolean {
  const [now, setNow] = useState<number>();

  useEffect(() => {
    if (!deadline) return;
    const wait = Math.max(Date.parse(deadline) - Date.now(), 0);
    if (wait > MAX_TIMER_MS) return;
    const timer = setTimeout(() => setNow(Date.now()), wait);
    return () => clearTimeout(timer);
  }, [deadline]);

  return deadline !== undefined && now !== undefined && now >= Date.parse(deadline);
}

/**
 * An order's chat (Figma K7, Q7, WK8, Q5m): the order card, the day and the messages, the seller's or the
 * customer's on the left and the reader's on the right with "Đã xem" once read, and the foot to write in. The
 * messages are kept with TanStack Query; the live socket makes it read what is new after each notice (design
 * decisions 12 and 31), and every 5 seconds while the socket is down (decision 29). A message is sent with an
 * `Idempotency-Key`, so one sent twice on a poor connection is one message.
 */
export function ChatPanel({
  orderId,
  access,
  side,
  initial,
  windowEnd,
  card,
  day,
}: {
  orderId: string;
  /** The order's access, for a customer who did not sign in (docs/specs/order.md); the seller's people have none. */
  access?: string;
  side: Side;
  initial: Chat;
  /** When the order's window ends, while the order is still to be collected: the chat turns read-only then. */
  windowEnd?: string;
  /** The order's card, which heads the chat. */
  card: ReactNode;
  /** The day line under it, "Hôm nay · Đơn #… đã xác nhận". */
  day: string;
}) {
  const t = useTranslations("Chat");
  const format = useFormatter();
  const queryClient = useQueryClient();
  const polling = useLivePolling();
  const shown = useTabShown();
  const [outbox, setOutbox] = useState<Outgoing[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const atEnd = useRef(true);
  const queryKey = ["order-chat", orderId];
  const headers = access ? { "Order-Access": access } : undefined;

  const { data: chat, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const held = queryClient.getQueryData<Chat>(queryKey);
      return mergeChat(held, await readChat(orderId, headers, lastSeq(held)));
    },
    initialData: initial,
    staleTime: Infinity,
  });

  useLive([`order:${orderId}`], (event) => {
    if (event.type === "synced" || event.orderId === orderId) void refetch();
  });

  useEffect(() => {
    if (!polling) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void refetch();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [polling, refetch]);

  const markSeen = useEffectEvent((upTo: number) => {
    markOrderMessagesSeen({ path: { orderId }, headers, body: { upTo } }).then(
      () => {
        queryClient.setQueryData<Chat>(queryKey, (held) => held && withSeen(held, side, upTo));
        void queryClient.invalidateQueries({ queryKey: ["unread"] });
      },
      // A mark that failed is tried again with the next message.
      () => undefined,
    );
  });
  const unseen = unseenUpTo(chat, side);
  useEffect(() => {
    if (unseen > 0 && shown) markSeen(unseen);
  }, [unseen, shown]);

  const passed = usePassed(closesAt(chat, windowEnd));
  const locked = !chat.open || passed;

  useLayoutEffect(() => {
    const element = scroller.current;
    if (element && atEnd.current) element.scrollTop = element.scrollHeight;
  }, [chat.messages.length, outbox.length]);

  function deliver(item: Outgoing) {
    setOutbox((all) =>
      all.map((each) => (each.key === item.key ? { key: each.key, text: each.text } : each)),
    );
    sendOrderMessage({
      path: { orderId },
      headers: { ...headers, "Idempotency-Key": item.key },
      body: { text: item.text },
    }).then(
      ({ data }) => {
        queryClient.setQueryData<Chat>(queryKey, (held) => held && withMessage(held, data));
        setOutbox((all) => all.filter((each) => each.key !== item.key));
      },
      (error: unknown) => {
        if (error instanceof ApiError && error.code === "ORDER_CHAT_CLOSED") {
          queryClient.setQueryData<Chat>(queryKey, (held) => held && closed(held));
          setOutbox((all) => all.filter((each) => each.key !== item.key));
          return;
        }
        const { detail, reference } = failureOf(error);
        setOutbox((all) =>
          all.map((each) =>
            each.key === item.key ? { ...each, failure: { detail, reference } } : each,
          ),
        );
      },
    );
  }

  function send(text: string) {
    const item = { key: crypto.randomUUID(), text };
    atEnd.current = true;
    setOutbox((all) => [...all, item]);
    deliver(item);
  }

  const time = (at: string) => format.dateTime(new Date(at), "time");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* A scrollable region takes keyboard focus, so its messages can be read without a pointer (WCAG 2.1.1). */}
      <section
        ref={scroller}
        aria-label={t("log")}
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be reachable by keyboard.
        tabIndex={0}
        onScroll={(event) => {
          const element = event.currentTarget;
          atEnd.current =
            element.scrollHeight - element.scrollTop - element.clientHeight < NEAR_END_PX;
        }}
        className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto bg-background p-4 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-inset"
      >
        {card}
        <p className="text-label text-muted-foreground">{day}</p>
        <ol aria-live="polite" className="flex flex-col gap-3.5">
          {chat.messages.map((message) => {
            const own = message.from === side;
            return (
              <li
                key={message.seq}
                className={cn("flex flex-col gap-1", own ? "items-end" : "items-start")}
              >
                <Bubble own={own} text={message.text} />
                <p className="text-label text-muted-foreground">
                  {own && isSeen(chat, message)
                    ? t("seen", { time: time(message.sentAt) })
                    : time(message.sentAt)}
                </p>
              </li>
            );
          })}
          {outbox.map((item) => (
            <li key={item.key} className="flex flex-col items-end gap-1">
              <Bubble own text={item.text} />
              {item.failure ? (
                <p
                  role="alert"
                  className="flex flex-wrap justify-end gap-x-2 text-label text-destructive"
                >
                  {item.failure.detail ?? t("failed", { reference: item.failure.reference ?? "—" })}
                  <button
                    type="button"
                    onClick={() => deliver(item)}
                    className="rounded-xs text-label-strong underline underline-offset-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {t("retry")}
                  </button>
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </section>
      <ChatFooter side={side} locked={locked} onSend={send} />
    </div>
  );
}

/** A message: the reader's on the right in the primary colour, the other side's on the left on white. */
function Bubble({ own, text }: { own: boolean; text: string }) {
  const t = useTranslations("Chat");

  return (
    <p
      className={cn(
        "max-w-3/4 rounded-xl px-3.5 py-2.5 text-body-sm wrap-break-word whitespace-pre-wrap",
        own
          ? "rounded-br-xs bg-primary text-primary-foreground"
          : "rounded-bl-xs bg-card text-card-foreground",
      )}
    >
      {own ? <span className="sr-only">{t("mine")} </span> : null}
      {text}
    </p>
  );
}
