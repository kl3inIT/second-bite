import "server-only";

import { sessionHeaders } from "@/features/identity/session";

import { type Chat } from "./chat-model";
import { readChat } from "./chat-api";

/**
 * An order's chat as its page reads it on the server: with the session and, for a customer who did not sign in,
 * the order's access, which the page has from the order. It reads the request, so it renders inside Suspense.
 */
export async function readOrderChat(orderId: string, access?: string): Promise<Chat> {
  const session = await sessionHeaders();
  return readChat(orderId, { ...session, ...(access ? { "Order-Access": access } : {}) });
}
