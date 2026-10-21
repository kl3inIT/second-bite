import type { MemberBody } from "@/lib/api/generated";

/**
 * Reviewing a store (SEC-64, SEC-65), behind the `storeReview` flag: what the admin reads about a store beyond its
 * status, as the backend is expected to give it.
 *
 * - `reason`: the words an admin wrote when rejecting or blocking the store, which its owner reads too.
 * - `blockedBy`: who blocked it, an admin moderating (`admin`) or its owner deleting their account
 *   (`owner_deleted`, SEC-65 records this as a reason rather than an empty `status_changed_by`).
 * - `duplicate`: a store blocked by an admin whose phone or address this pending store shares (SEC-65), for the
 *   admin to decide on.
 */
export type SellerReview = {
  reason?: string;
  blockedBy?: "admin" | "owner_deleted";
  duplicate?: SellerDuplicate;
};

/** A blocked store a pending one matches, and on what (SEC-65): the blocked store's own record, never an account. */
export type SellerDuplicate = {
  sellerId: string;
  name: string;
  match: "phone" | "address";
};

/** The longest reason an admin writes on a reject or a block. */
export const REASON_MAX = 500;

/** Whether a reason can be sent: some words, at most REASON_MAX characters. */
export function isReason(text: string): boolean {
  const reason = text.trim();
  return reason.length > 0 && reason.length <= REASON_MAX;
}

/**
 * Whether a store still has an owner. A store whose owner deleted their account keeps its staff but no owner, and
 * SEC-65 refuses to bring it back (`activate` fails), since nobody could manage it.
 */
export function hasOwner(members: readonly Pick<MemberBody, "role">[]): boolean {
  return members.some((member) => member.role === "owner");
}
