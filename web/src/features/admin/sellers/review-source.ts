import "server-only";

import type { SellerReview } from "./review";
import type { AdminSeller } from "./seller-list";

// The reads of reviewing a store (SEC-64, SEC-65), called only while the `storeReview` flag is on. The backend
// has none of them yet, so each gives nothing and the page shows what it shows for an empty answer.

/**
 * The rejected stores. SEC-64 has not built the `rejected` status, so `GET /admin/sellers?status=rejected` is
 * refused today; there are none and the card's list shows its empty state.
 */
export async function listRejectedSellers(): Promise<AdminSeller[]> {
  return [];
}

/**
 * How many stores are rejected. SEC-64 has not added `rejected` to `GET /admin/summary`'s `sellers`, so the card
 * shows no figure.
 */
export async function countRejectedSellers(): Promise<number | undefined> {
  return undefined;
}

/**
 * Why a store is rejected or blocked and which blocked store it matches. SEC-64 has not built `reason` on reject
 * and block, SEC-65 has not built `blockedBy` nor the match against blocked stores; expected as fields of
 * `GET /admin/sellers/{sellerId}` (`statusReason`, `blockedBy`, `duplicate`). Until then there is nothing to say.
 */
export async function readSellerReview(_sellerId: string): Promise<SellerReview> {
  return {};
}
