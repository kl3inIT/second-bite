"use server";

import { keepAccess } from "./order-access";

/** Keeps an order placed in this browser readable here without signing in (SEC-76 › decision 7). */
export async function keepOrder(orderId: string, access: string): Promise<void> {
  await keepAccess(orderId, access);
}
