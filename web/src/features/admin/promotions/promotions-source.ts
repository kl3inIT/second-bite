import "server-only";

import type { PromotionList, PromotionQuery } from "./promotion";
import type { StoreOption } from "./promotion-form";

/**
 * The promotion codes an admin sees (Figma AD-MK1). No module keeps promotion codes yet and no issue or decision
 * covers them (SEC-62 design › What waits), so there are none and the page shows its empty state. The backend
 * that adds them replaces this read, with the query as its filters.
 */
export async function listPromotions(_query: PromotionQuery): Promise<PromotionList> {
  return { items: [], total: 0 };
}

/**
 * The stores a code can be given to (Figma AD-MK2 › Cửa hàng áp dụng). It is read with the promotions backend,
 * which decides which stores take part; until then there are none to choose.
 */
export async function listPromotionStores(): Promise<StoreOption[]> {
  return [];
}
