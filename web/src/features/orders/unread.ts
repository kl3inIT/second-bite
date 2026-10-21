"use server";

import { readUnread } from "./read-orders";

/** The reader's unread messages and open orders, for the bottom bar's "Đơn của tôi" tab (SEC-117). */
export async function readOrdersUnread(): Promise<{ unread: number; open: string[] }> {
  return readUnread();
}
