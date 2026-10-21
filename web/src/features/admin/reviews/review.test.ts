import { describe, expect, test } from "vitest";

import { readReviewQuery, reviewsHref, statusLook } from "./review";

describe("the reviews' address", () => {
  test("reads every review, ten a page, newest first, by default", () => {
    expect(readReviewQuery({})).toEqual({
      tab: "all",
      page: 1,
      size: 10,
      q: "",
      stars: undefined,
      seller: undefined,
      sort: "desc",
    });
  });

  test("keeps what it knows and drops what it does not", () => {
    expect(
      readReviewQuery({ tab: "reported", stars: "1", seller: "s-7", q: " lừa ", size: "50" }),
    ).toMatchObject({ tab: "reported", stars: 1, seller: "s-7", q: "lừa", size: 50 });
    expect(readReviewQuery({ tab: "shown", stars: "6", size: "7", page: "0" })).toMatchObject({
      tab: "all",
      stars: undefined,
      size: 10,
      page: 1,
    });
  });

  test("writes only what differs from the default, and reads back the same", () => {
    expect(reviewsHref(readReviewQuery({}))).toBe("/admin/reviews");
    const query = readReviewQuery({ tab: "hidden", stars: "2", page: "3", sort: "asc" });
    const href = reviewsHref(query);
    expect(href).toBe("/admin/reviews?tab=hidden&stars=2&sort=asc&page=3");
    expect(readReviewQuery(Object.fromEntries(new URL(href, "http://x").searchParams))).toEqual(
      query,
    );
  });
});

test("a review's status looks as Figma AD-DG1 draws it", () => {
  expect(statusLook("shown").variant).toBe("fresh");
  expect(statusLook("reported").variant).toBe("outline");
  expect(statusLook("hidden").variant).toBe("outline");
});
