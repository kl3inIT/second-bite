import { describe, expect, it } from "vitest";

import { countsOf, starsOf } from "./store-reviews";

describe("a store's review filters", () => {
  it("asks the API for the stars a filter holds", () => {
    expect(starsOf("all")).toEqual([]);
    expect(starsOf("five")).toEqual([5]);
    expect(starsOf("four")).toEqual([4]);
    expect(starsOf("low")).toEqual([1, 2, 3]);
  });

  it("counts each filter from the counts of each number of stars", () => {
    const counts = { oneStar: 1, twoStars: 2, threeStars: 3, fourStars: 4, fiveStars: 5 };
    expect(countsOf(counts)).toEqual({ all: 15, five: 5, four: 4, low: 6 });
  });
});
