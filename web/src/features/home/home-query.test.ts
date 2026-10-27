import { describe, expect, it } from "vitest";

import { homePath, readHomeQuery } from "./home-query";

describe("the home's address", () => {
  it("reads words, a known kind and the collect-now switch", () => {
    expect(readHomeQuery({ q: " bánh mì ", kind: "bakery", now: "1" })).toEqual({
      q: "bánh mì",
      kind: "bakery",
      now: true,
      near: undefined,
    });
  });

  it("reads a place as latitude,longitude and drops anything else", () => {
    expect(readHomeQuery({ near: "21.057,105.896" }).near).toBe("21.057,105.896");
    expect(readHomeQuery({ near: "Tasco Mall" }).near).toBeUndefined();
    expect(readHomeQuery({ near: "21.057" }).near).toBeUndefined();
  });

  it("drops an unknown kind and empty words instead of sending them to the backend", () => {
    expect(readHomeQuery({ q: "  ", kind: "pizza", now: "yes" })).toEqual({
      q: undefined,
      kind: undefined,
      now: undefined,
      near: undefined,
    });
  });
});

describe("the home's path, which sign-in returns to", () => {
  it("is the root without a query, and keeps each filter", () => {
    expect(homePath({})).toBe("/");
    expect(homePath({ q: "bánh mì", kind: "bakery", now: true })).toBe(
      "/?q=bánh+mì&kind=bakery&now=1",
    );
    expect(homePath({ near: "21.057,105.896" })).toBe("/?near=21.057,105.896");
    expect(homePath({ now: false })).toBe("/");
  });
});
