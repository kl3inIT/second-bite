import "server-only";

import type { AdminOrderRow, OrderSummary } from "./order";

export type OrderList = { items: AdminOrderRow[]; summary?: OrderSummary };

/**
 * The orders an admin sees (AD-DH1). SEC-15 has not built the `order` module nor `GET /admin/orders` yet, so
 * there are none and the page shows its empty state; this becomes an `adminRead` of the generated SDK then.
 */
export async function listAdminOrders(): Promise<OrderList> {
  return { items: [] };
}
