import { describe, expect, it } from "vitest";

import type { MessageBody } from "@/lib/api/generated";

import {
  closed,
  closesAt,
  isSeen,
  lastSeq,
  mergeChat,
  unseenUpTo,
  withMessage,
  withSeen,
  type Chat,
} from "./chat-model";

function message(seq: number, from: MessageBody["from"]): MessageBody {
  return { seq, from, text: `m${seq}`, sentAt: "2026-10-21T13:14:00Z" };
}

function chat(messages: MessageBody[], seen = { customer: 0, seller: 0 }): Chat {
  return { messages, seen, open: true };
}

describe("an order's chat", () => {
  it("merges messages by number, each once and oldest first", () => {
    const merged = mergeChat(
      chat([message(1, "seller"), message(2, "customer")]),
      chat([message(3, "seller"), message(2, "customer")]),
    );

    expect(merged.messages.map((m) => m.seq)).toEqual([1, 2, 3]);
  });

  it("never takes back what a side has seen, and keeps the newer read's state", () => {
    const merged = mergeChat(
      { ...chat([], { customer: 4, seller: 1 }), closesAt: "2026-10-21T15:00:00Z" },
      { ...chat([], { customer: 2, seller: 3 }), open: false },
    );

    expect(merged.seen).toEqual({ customer: 4, seller: 3 });
    expect(merged.open).toBe(false);
    expect(merged.closesAt).toBe("2026-10-21T15:00:00Z");
  });

  it("takes the first read as it is", () => {
    const first = chat([message(1, "seller")]);
    expect(mergeChat(undefined, first)).toBe(first);
  });

  it("asks after the last message it holds", () => {
    expect(lastSeq(undefined)).toBe(0);
    expect(lastSeq(chat([]))).toBe(0);
    expect(lastSeq(chat([message(1, "seller"), message(5, "customer")]))).toBe(5);
  });

  it("adds a message sent, a mark seen, and the end of the chat", () => {
    const base = chat([message(1, "seller")]);

    expect(withMessage(base, message(2, "customer")).messages).toHaveLength(2);
    expect(withSeen(base, "customer", 1).seen).toEqual({ customer: 1, seller: 0 });
    expect(withSeen(withSeen(base, "customer", 3), "customer", 1).seen.customer).toBe(3);
    expect(closed(base).open).toBe(false);
  });

  it("finds the last message of the other side that a side has not seen", () => {
    const messages = [message(1, "seller"), message(2, "customer"), message(3, "seller")];

    expect(unseenUpTo(chat(messages), "customer")).toBe(3);
    expect(unseenUpTo(chat(messages, { customer: 3, seller: 0 }), "customer")).toBe(0);
    expect(unseenUpTo(chat(messages), "seller")).toBe(2);
    expect(unseenUpTo(chat([message(1, "customer")]), "customer")).toBe(0);
  });

  it("knows a message was seen once the other side has read up to it", () => {
    const own = message(2, "customer");
    expect(isSeen(chat([own], { customer: 0, seller: 1 }), own)).toBe(false);
    expect(isSeen(chat([own], { customer: 0, seller: 2 }), own)).toBe(true);
  });

  it("closes at the time the API gives, or else at the window's end", () => {
    expect(closesAt({ ...chat([]), closesAt: "a" }, "b")).toBe("a");
    expect(closesAt(chat([]), "b")).toBe("b");
    expect(closesAt(chat([]), undefined)).toBeUndefined();
  });
});
