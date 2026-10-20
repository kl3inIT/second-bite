import "server-only";

import type { AdminOrder, AdminOrderRow, OrderSummary } from "./order";

export type OrderList = { items: AdminOrderRow[]; summary?: OrderSummary };

/**
 * The orders an admin sees (AD-DH1). SEC-15 has not built the `order` module nor `GET /admin/orders` yet, so
 * there are none and the page shows its empty state; this becomes an `adminRead` of the generated SDK then.
 */
export async function listAdminOrders(): Promise<OrderList> {
  return { items: [] };
}

/**
 * One order (AD-DH3). Nothing until SEC-15 builds `GET /admin/orders/{id}`, so every address gets the admin's
 * not-found page (ORDER_NOT_FOUND once the API answers).
 */
export async function getAdminOrder(_orderId: string): Promise<AdminOrder | undefined> {
  return undefined;
}
