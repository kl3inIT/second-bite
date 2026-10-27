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

  it("leaves out a note in brackets and words without a letter", () => {
    const named = (displayName: string) => initialsOf({ displayName, email: "x@example.com" });
    expect(named("Nhữ Đình Nhật (HE182328)")).toBe("NN");
    expect(named("Nhu Dinh Nhat (K18 HL)")).toBe("NN");
    expect(named("An 2004")).toBe("A");
    expect(named("(HE182328)")).toBe("?");
  });
});
