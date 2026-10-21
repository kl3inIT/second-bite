/**
 * The admin's feature flags (SEC-62): a part of a screen that is built ahead of its backend waits here, off, while
 * the screen keeps working as it does today. Unlike a page's `released` flag (pages.ts), which swaps a whole page
 * for the coming-soon page, a feature flag hides new parts inside an open page. A component reads its flag through
 * a prop that defaults to `isFeatureOn(key)`, so a unit test turns the part on by passing the prop, never through
 * the environment. Only the coordinator turns a flag on, in the change that brings its backend.
 */
export const adminFeatures = {
  /**
   * SEC-64 and SEC-65: the store states `rejected` beside `pending`, `active` and `blocked`; a reason on reject and
   * on block; the pending queue opened first; who blocked a store (an admin, or its owner deleting their account);
   * a store matching a blocked one flagged at approval; an owner-less store that cannot be unblocked.
   */
  storeReview: false,
  /** SEC-64: an admin opens a store for its owner, given by email address, active at once. */
  openForOwner: false,
} satisfies Record<string, boolean>;

export type AdminFeature = keyof typeof adminFeatures;

/** Whether a feature's part of the admin shows. */
export function isFeatureOn(key: AdminFeature): boolean {
  return adminFeatures[key];
}
