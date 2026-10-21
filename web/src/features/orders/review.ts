// A rating of a collected order (SEC-97 › decisions 1 and 2): one to five stars and any of the fixed tags, which
// the web words.

export const STARS = [1, 2, 3, 4, 5] as const;

export type Star = (typeof STARS)[number];

export const REVIEW_TAGS = [
  "fast_pickup",
  "good_quality",
  "good_variety",
  "fair_portions",
] as const;

export type ReviewTag = (typeof REVIEW_TAGS)[number];

/** Whether a tag from the API is one the web words, so a tag added on the server later is left out, not shown raw. */
export function isReviewTag(tag: string): tag is ReviewTag {
  return (REVIEW_TAGS as readonly string[]).includes(tag);
}
