import { describe, expect, it } from "vitest";

import { readReturnTo } from "./return-to";

describe("where sign-in returns to", () => {
  it("keeps a path on this site with its query", () => {
    expect(readReturnTo("/offers/of-bread?from=home")).toBe("/offers/of-bread?from=home");
  });

  it("drops the language, which the person keeps", () => {
    expect(readReturnTo("/en/offers/of-bread")).toBe("/offers/of-bread");
    expect(readReturnTo("/vi")).toBe("/");
  });

  it("goes home for anything that is not a path on this site", () => {
    for (const value of [
      undefined,
      ["/a", "/b"],
      "",
      "offers",
      "https://evil.example/",
      "//evil.example/",
      String.raw`/\evil.example/`,
      String.raw`/\/evil.example/`,
    ]) {
      expect(readReturnTo(value)).toBe("/");
    }
  });

  it("keeps a word that only starts like a language", () => {
    expect(readReturnTo("/video")).toBe("/video");
  });
});
