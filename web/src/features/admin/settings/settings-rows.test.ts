import { describe, expect, it } from "vitest";

import { flattenTree } from "./tree";

describe("a tree as a table shows it", () => {
  it("puts each row under its parent, in the order given", () => {
    const rows = flattenTree([
      { id: "b1", parentId: "b" },
      { id: "d" },
      { id: "b" },
      { id: "d1", parentId: "d" },
      { id: "b2", parentId: "b" },
    ]);
    expect(rows.map(({ id, depth }) => `${id}:${depth}`)).toEqual([
      "d:0",
      "d1:1",
      "b:0",
      "b1:1",
      "b2:1",
    ]);
  });

  it("shows a row whose parent is missing at the top", () => {
    expect(flattenTree([{ id: "x", parentId: "gone" }])).toEqual([
      { id: "x", parentId: "gone", depth: 0 },
    ]);
  });
});
