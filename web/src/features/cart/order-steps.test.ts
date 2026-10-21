import { describe, expect, it } from "vitest";

import { nextStep, resumesReady } from "./order-steps";

describe("ordering", () => {
  it("signs in first", () => {
    expect(nextStep(null)).toBe("signIn");
  });

  it("asks a name only while the account has none", () => {
    expect(nextStep({ displayName: "" })).toBe("name");
    expect(nextStep({ displayName: "   " })).toBe("name");
    expect(nextStep({ displayName: "Minh Anh" })).toBe("ready");
  });

  it("goes straight on after signing in only when nothing is left to ask", () => {
    expect(resumesReady({ displayName: "Minh Anh" }, true)).toBe(true);
    expect(resumesReady({ displayName: "" }, true)).toBe(false);
    expect(resumesReady(null, true)).toBe(false);
    expect(resumesReady({ displayName: "Minh Anh" }, false)).toBe(false);
  });
});
