import { describe, expect, it } from "vitest";

import { formatCost, formatPrice } from "./format";

describe("a price as people read it", () => {
  it("writes đồng one way in both languages", () => {
    expect(formatPrice(39_000)).toBe("39.000đ");
  });

  it("says food given away at 0đ is free, in the page's words, and any other price as it is", () => {
    expect(formatCost(0, "Miễn phí")).toBe("Miễn phí");
    expect(formatCost(0, "Free")).toBe("Free");
    expect(formatCost(39_000, "Miễn phí")).toBe("39.000đ");
  });
});
