import type { AdminSeller } from "./seller-list";

// The writes of reviewing a store (SEC-64), as the backend is expected to take them: each status change is its
// own action, never a writable status, and reject and block carry a reason the owner reads in their email.

/** The body of `POST /admin/sellers/{sellerId}/reject` and of `…/block`: the reason, 1 to 500 characters. */
export type StatusReasonRequest = { reason: string };

/**
 * Whether the backend takes a reason. SEC-64 has not built `…/reject` nor a reason on `…/block`, so the dialogs'
 * buttons stay off with "Sắp có"; the change that builds them turns this on with the `storeReview` flag.
 */
export const reasonsReady: boolean = false;

/**
 * Rejects a store never admitted (`pending` to `rejected`). SEC-64 has not built `POST
 * /admin/sellers/{sellerId}/reject`, so this is never called while `reasonsReady` is off; it answers the store, and
 * a store in another status is refused with 409.
 */
export async function rejectSeller(
  _sellerId: string,
  _request: StatusReasonRequest,
): Promise<AdminSeller> {
  throw new Error("SEC-64 has not built POST /admin/sellers/{sellerId}/reject");
}

/**
 * Blocks an admitted store (`active` to `blocked`) with its reason. SEC-64 has not given `POST
 * /admin/sellers/{sellerId}/block` a body yet, so this is never called while `reasonsReady` is off.
 */
export async function blockSellerWithReason(
  _sellerId: string,
  _request: StatusReasonRequest,
): Promise<AdminSeller> {
  throw new Error("SEC-64 has not built a reason on POST /admin/sellers/{sellerId}/block");
}

/**
 * The code SEC-65 is expected to refuse `activate` with for a store that has no owner left; the toast says why
 * instead of "try again".
 */
export const OWNERLESS_CODE = "SELLER_HAS_NO_OWNER";
