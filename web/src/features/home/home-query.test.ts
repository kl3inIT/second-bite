import { describe, expect, it } from "vitest";

import { readHomeQuery } from "./home-query";

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
