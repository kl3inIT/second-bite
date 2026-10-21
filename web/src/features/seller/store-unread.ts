"use server";

import { getStoreOrders } from "./my-sellers";
import { vietnamToday } from "./store-day";

/**
 * The messages the customers of today's orders wrote that the store's people have not read (SEC-117), for the
 * "Đơn" tab. Zero for a person who is not one of the store's people, whom the API refuses.
 */
export async function readStoreUnread(sellerId: string): Promise<number> {
  try {
    const orders = await getStoreOrders(sellerId, vietnamToday());
    return orders.reduce((sum, order) => sum + (order.unreadMessages ?? 0), 0);
  } catch {
    return 0;
  }
}
