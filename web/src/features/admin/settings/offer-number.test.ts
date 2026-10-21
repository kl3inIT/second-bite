import { describe, expect, it } from "vitest";

import { leftNumber, typedNumber } from "./offer-number";

describe("a settings number as it is typed", () => {
  it("takes digits only and holds a number over its bound to the bound", () => {
    expect(typedNumber("2a0", 5, 90)).toEqual({ draft: undefined, value: 20 });
    expect(typedNumber("120", 5, 90)).toEqual({ draft: undefined, value: 90 });
  });

  it("shows a number under its bound as typed, the value under it held to the bound", () => {
    expect(typedNumber("2", 5, 90)).toEqual({ draft: "2", value: 5 });
    expect(typedNumber("", 5, 90)).toEqual({ draft: "", value: undefined });
  });

  it("keeps the typed number held to its bounds once the field is left, empty as the lowest", () => {
    expect(leftNumber("2", 5, 90)).toBe(5);
    expect(leftNumber("", 5, 90)).toBe(5);
    expect(leftNumber("40", 5, 90)).toBe(40);
  });
});
