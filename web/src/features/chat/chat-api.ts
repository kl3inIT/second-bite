import { listOrderMessages } from "@/lib/api/generated";

import { type Chat, lastSeq, mergeChat, PAGE_SIZE } from "./chat-model";

/** A chat holds at most 500 messages (docs/specs/order.md), which is this many pages. */
const MAX_PAGES = 5;

/** The headers an order's reader sends: its access when it did not sign in, the session when it did. */
export type ChatHeaders = Record<string, string> | undefined;

/**
 * The messages after `after`, all the pages of them, with what each side has seen and whether the chat is open.
 * The page on the server reads from 0; the browser, after each notice, from the last message it holds.
 */
export async function readChat(orderId: string, headers: ChatHeaders, after = 0): Promise<Chat> {
  let chat: Chat | undefined;
  let cursor = after;
  for (let page = 0; page < MAX_PAGES; page++) {
    const { data } = await listOrderMessages({
      path: { orderId },
      query: { after: cursor, limit: PAGE_SIZE },
      headers,
    });
    chat = mergeChat(chat, data);
    if (data.messages.length < PAGE_SIZE) break;
    cursor = lastSeq(data);
  }
  return chat as Chat;
}
