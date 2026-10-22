import type { MessageBody, MessagesOutputBody } from "@/lib/api/generated";
import type { Side } from "@/lib/live-client";

// What an order's chat holds in the browser (SEC-117 › docs/specs/order.md › The chat): its messages by number,
// what each side has seen, and whether it still takes messages.

export type Chat = Pick<MessagesOutputBody, "messages" | "seen" | "open" | "closesAt">;

/** The messages the API gives in a page, at most. */
export const PAGE_SIZE = 100;

export function otherSide(side: Side): Side {
  return side === "customer" ? "seller" : "customer";
}

/** The number of the last message held, 0 for none: what `after` asks from. */
export function lastSeq(chat: Pick<Chat, "messages"> | undefined): number {
  return chat?.messages.at(-1)?.seq ?? 0;
}

/**
 * What the browser holds once `incoming` is read: the messages of both by number, each once and oldest first;
 * what each side has seen only ever rises (a late answer never takes a mark back); the rest is the newer read's.
 */
export function mergeChat(current: Chat | undefined, incoming: Chat): Chat {
  if (!current) return incoming;
  const bySeq = new Map<number, MessageBody>();
  for (const message of [...current.messages, ...incoming.messages]) {
    bySeq.set(message.seq, message);
  }
  return {
    messages: [...bySeq.values()].toSorted((a, b) => a.seq - b.seq),
    seen: {
      customer: Math.max(current.seen.customer, incoming.seen.customer),
      seller: Math.max(current.seen.seller, incoming.seen.seller),
    },
    open: incoming.open,
    closesAt: incoming.closesAt ?? current.closesAt,
  };
}

/** The chat with a message the reader has just sent added. */
export function withMessage(chat: Chat, message: MessageBody): Chat {
  return mergeChat(chat, { ...chat, messages: [message] });
}

/** The chat with `side` having seen up to `seq`. */
export function withSeen(chat: Chat, side: Side, seq: number): Chat {
  return mergeChat(chat, { ...chat, messages: [], seen: { ...chat.seen, [side]: seq } });
}

/** The chat as it stands once the API has refused a message because the order ended. */
export function closed(chat: Chat): Chat {
  return { ...chat, open: false };
}

/** The last message the other side wrote that `side` has not seen, 0 for none. */
export function unseenUpTo(chat: Chat, side: Side): number {
  const theirs = chat.messages.filter((message) => message.from === otherSide(side));
  const last = theirs.at(-1)?.seq ?? 0;
  return last > chat.seen[side] ? last : 0;
}

/** Whether a message has been seen by the side that did not write it. */
export function isSeen(chat: Chat, message: MessageBody): boolean {
  return message.seq <= chat.seen[otherSide(message.from)];
}

/**
 * When the chat turns read-only: the API says so once the order is collected; before that it is the end of the
 * order's window, passed by the page while the order is open. Nothing when neither is known.
 */
export function closesAt(chat: Chat, windowEnd: string | undefined): string | undefined {
  return chat.closesAt ?? windowEnd;
}
