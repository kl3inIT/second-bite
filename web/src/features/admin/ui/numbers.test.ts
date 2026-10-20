import { describe, expect, it } from "vitest";

import { clamp, pageNumbers } from "./numbers";

describe("an admin number field", () => {
  it("holds a value to its bounds", () => {
    expect(clamp(120, 5, 90)).toBe(90);
    expect(clamp(2, 5, 90)).toBe(5);
    expect(clamp(20, 5, 90)).toBe(20);
  });
});

describe("the pages a pagination shows", () => {
  it("shows every page up to seven", () => {
    expect(pageNumbers(1, 4)).toEqual([1, 2, 3, 4]);
  });

  it("shows the ends and the pages around the current one, with gaps", () => {
    expect(pageNumbers(1, 20)).toEqual([1, 2, "gap", 20]);
    expect(pageNumbers(10, 20)).toEqual([1, "gap", 9, 10, 11, "gap", 20]);
    expect(pageNumbers(20, 20)).toEqual([1, "gap", 19, 20]);
  });
});
