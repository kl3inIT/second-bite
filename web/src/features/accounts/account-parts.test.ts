import { describe, expect, it } from "vitest";

import { initialsOf, nameOf } from "./account-parts";

describe("an account's name in the lists", () => {
  it("is its name, or its address until it has one", () => {
    expect(nameOf({ displayName: "Quốc Bảo", email: "bao@example.com" })).toBe("Quốc Bảo");
    expect(nameOf({ displayName: "", email: "bao@example.com" })).toBe("bao@example.com");
  });

  it("gives two initials from the first and last words, marks kept", () => {
    expect(initialsOf({ displayName: "Nguyễn Văn Đức", email: "x@example.com" })).toBe("NĐ");
    expect(initialsOf({ displayName: "", email: "dong.lan@example.com" })).toBe("DL");
    expect(initialsOf({ displayName: "", email: "minh@example.com" })).toBe("M");
  });
});
