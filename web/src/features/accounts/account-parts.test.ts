import { describe, expect, it } from "vitest";

import { initialsOf, nameOf } from "./account-parts";

describe("an account's name in the lists", () => {
  it("is its name, or its address until it has one", () => {
    expect(nameOf({ displayName: "Quốc Bảo", email: "bao@example.com", username: "" })).toBe(
      "Quốc Bảo",
    );
    expect(nameOf({ displayName: "", email: "bao@example.com", username: "" })).toBe(
      "bao@example.com",
    );
  });

  it("is the username of an account that has no address, until it has a name", () => {
    expect(nameOf({ displayName: "", email: "", username: "lan.anh" })).toBe("lan.anh");
    expect(nameOf({ displayName: "Lan Anh", email: "", username: "lan.anh" })).toBe("Lan Anh");
  });

  it("gives two initials from the first and last words, marks kept", () => {
    expect(
      initialsOf({ displayName: "Nguyễn Văn Đức", email: "x@example.com", username: "" }),
    ).toBe("NĐ");
    expect(initialsOf({ displayName: "", email: "dong.lan@example.com", username: "" })).toBe("DL");
    expect(initialsOf({ displayName: "", email: "minh@example.com", username: "" })).toBe("M");
  });

  it("takes them from the username when there is no address", () => {
    expect(initialsOf({ displayName: "", email: "", username: "thu.ha_88" })).toBe("TH");
  });

  it("leaves out a note in brackets and words without a letter", () => {
    const named = (displayName: string) =>
      initialsOf({ displayName, email: "x@example.com", username: "" });
    expect(named("Nhữ Đình Nhật (HE182328)")).toBe("NN");
    expect(named("Nhu Dinh Nhat (K18 HL)")).toBe("NN");
    expect(named("An 2004")).toBe("A");
    expect(named("(HE182328)")).toBe("?");
  });
});
