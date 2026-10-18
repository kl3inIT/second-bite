import { describe, expect, it } from "vitest";

import { avatarTone, avatarTones, initials } from "./seller";

describe("a seller's avatar", () => {
  it("takes the first letters of the first and the last word, with their marks", () => {
    expect(initials("Lò Bánh Mây")).toBe("LM");
    expect(initials("Gỏi Cuốn Sen")).toBe("GS");
    expect(initials("  ẩm thực   ông Đức ")).toBe("ẨĐ");
  });

  it("takes one letter from one word and nothing from no words", () => {
    expect(initials("Kaze")).toBe("K");
    expect(initials("   ")).toBe("");
  });

  it("keeps the same colour for the same seller", () => {
    expect(avatarTone("se-bakery")).toBe(avatarTone("se-bakery"));
    expect(avatarTones).toContain(avatarTone("se-rice"));
  });
});
