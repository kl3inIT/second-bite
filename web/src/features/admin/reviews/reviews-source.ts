import "server-only";

import type { AdminReviewRow, ReviewQuery, ReviewSeller, ReviewTab } from "./review";

export type ReviewList = {
  items: AdminReviewRow[];
  /** How many reviews the open tab holds, for the pagination. */
  total: number;
  /** How many reviews each tab holds, once the backend counts them. */
  counts?: Record<ReviewTab, number>;
  /** The stores with reviews, for the store filter. */
  sellers: ReviewSeller[];
};

/**
 * The reviews an admin moderates. Customers cannot review a store yet and no module keeps reviews, so there are
 * none and the page shows its empty state; the backend's list replaces this.
 */
export async function listAdminReviews(_query: ReviewQuery): Promise<ReviewList> {
  return { items: [], total: 0, sellers: [] };
}
