"use server";

import { getStoreOrders } from "./my-sellers";
import { vietnamToday } from "./store-day";

/**
 * How many of today's orders have messages from their customers that the store's people have not read (SEC-117), for
 * the "Đơn" tab. Zero for a person who is not one of the store's people, whom the API refuses.
 */
export async function readStoreUnread(sellerId: string): Promise<number> {
  try {
    const orders = await getStoreOrders(sellerId, vietnamToday());
    return orders.filter((order) => order.unreadMessages).length;
  } catch {
    return 0;
  }
}
