import { describe, expect, it } from "vitest";

import { homePath, readHomeQuery } from "./home-query";

describe("the home's address", () => {
  it("reads words, a known kind and the collect-now switch", () => {
    expect(readHomeQuery({ q: " bánh mì ", kind: "bakery", now: "1" })).toEqual({
      q: "bánh mì",
      kind: "bakery",
      now: true,
    });
  });

  it("drops an unknown kind and empty words instead of sending them to the backend", () => {
    expect(readHomeQuery({ q: "  ", kind: "pizza", now: "yes" })).toEqual({
      q: undefined,
      kind: undefined,
      now: undefined,
    });
  });
});

describe("the home's path, which sign-in returns to", () => {
  it("is the root without a query, and keeps each filter", () => {
    expect(homePath({})).toBe("/");
    expect(homePath({ q: "bánh mì", kind: "bakery", now: true })).toBe(
      "/?q=b%C3%A1nh+m%C3%AC&kind=bakery&now=1",
    );
  });
});
