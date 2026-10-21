import { describe, expect, it } from "vitest";

import { contactProblems, groupedPhone, normalizedPhone } from "./contact";

describe("normalizedPhone", () => {
  it("takes out spaces, dots and dashes and writes +84 as 0", () => {
    expect(normalizedPhone(" 0900 000.00-0 ")).toBe("0900000000");
    expect(normalizedPhone("+84 900 000 000")).toBe("0900000000");
  });
});

describe("contactProblems", () => {
  it("accepts a name and a Vietnamese number in any of its usual spellings", () => {
    expect(contactProblems({ name: "Minh Anh", phone: "+84 900 000 000" })).toEqual({});
  });

  it("names each field that is wrong", () => {
    expect(contactProblems({ name: "  ", phone: "0900000000" })).toEqual({ name: true });
    expect(contactProblems({ name: "a".repeat(51), phone: "0900000000" })).toEqual({ name: true });
    expect(contactProblems({ name: "Minh Anh", phone: "12345" })).toEqual({ phone: true });
    expect(contactProblems({ name: "Minh Anh", phone: "1900000000" })).toEqual({ phone: true });
  });
});

describe("groupedPhone", () => {
  it("groups a stored number four, three, three", () => {
    expect(groupedPhone("0900000000")).toBe("0900 000 000");
  });
});
