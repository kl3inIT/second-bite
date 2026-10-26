import type { StarCountsBody } from "@/lib/api/generated";

/**
 * The cells that filter a store's reviews (Figma Q1b-5): all of them, five stars, four stars, three stars or
 * fewer. Their numbers come from the counts the API answers whatever stars it was asked.
 */
export const reviewFilters = ["all", "five", "four", "low"] as const;

export type ReviewFilter = (typeof reviewFilters)[number];

/** The stars the API is asked for by a filter; none asks for every review. */
export function starsOf(filter: ReviewFilter): number[] {
  switch (filter) {
    case "five":
      return [5];
    case "four":
      return [4];
    case "low":
      return [1, 2, 3];
    case "all":
      return [];
  }
}

/** How many reviews each filter holds, from the counts of each number of stars. */
export function countsOf(counts: StarCountsBody): Record<ReviewFilter, number> {
  const low = counts.oneStar + counts.twoStars + counts.threeStars;
  return {
    all: low + counts.fourStars + counts.fiveStars,
    five: counts.fiveStars,
    four: counts.fourStars,
    low,
  };
}
