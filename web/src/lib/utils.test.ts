import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { cn, typeStyles } from "./utils";

describe("class merging", () => {
  it("knows every type style tokens.css defines", () => {
    const tokens = readFileSync(new URL("../styles/tokens.css", import.meta.url), "utf8");
    const theme = tokens.slice(tokens.indexOf("@theme"));
    const defined = [...theme.matchAll(/--text-([a-z0-9-]+):/g)]
      .map((match) => match[1])
      .filter((name) => !name.includes("--"));

    expect([...typeStyles].toSorted()).toEqual(defined.toSorted());
  });

  it("keeps a text colour beside a type style", () => {
    expect(cn("text-body-sm text-avatar-foreground")).toBe("text-body-sm text-avatar-foreground");
  });

  it("lets a later type style replace an earlier one", () => {
    expect(cn("text-body-sm", "text-label")).toBe("text-label");
  });
});
