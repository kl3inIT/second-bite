import { describe, expect, it } from "vitest";

import { initials, signInDay } from "./admin-rows";
import { auditActionLook, auditQuery, auditSearch } from "./audit-log";
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

describe("an admin's avatar letters", () => {
  it("are the first and last words' first letters", () => {
    expect(initials("Minh Anh")).toBe("MA");
    expect(initials("Đức Huy")).toBe("ĐH");
    expect(initials("Nguyễn Thu Trang")).toBe("NT");
    expect(initials("an")).toBe("AN");
    expect(initials("  ")).toBe("");
  });
});

describe("the day an admin last signed in", () => {
  const now = new Date("2026-10-20T03:00:00Z"); // 10:00 on 20 October in Vietnam

  it("is today or yesterday in Vietnam's days", () => {
    expect(signInDay(new Date("2026-10-19T17:30:00Z"), now)).toBe("today"); // 00:30 on the 20th
    expect(signInDay(new Date("2026-10-19T16:30:00Z"), now)).toBe("yesterday"); // 23:30 on the 19th
    expect(signInDay(new Date("2026-10-18T10:00:00Z"), now)).toBe("earlier");
  });
});

describe("the audit log's filters", () => {
  it("read from the address, unknown or malformed values falling back", () => {
    expect(auditQuery({})).toEqual({ q: "", actor: "all", action: "all", page: 1 });
    expect(
      auditQuery({
        q: " Bún chả ",
        actor: "Minh Anh",
        action: "sellerBlocked",
        from: "2026-10-14",
        to: "2026-10-20",
        page: "3",
      }),
    ).toEqual({
      q: "Bún chả",
      actor: "Minh Anh",
      action: "sellerBlocked",
      from: "2026-10-14",
      to: "2026-10-20",
      page: 3,
    });
    expect(auditQuery({ action: "dropTables", from: "14/10", page: "-2" })).toEqual({
      q: "",
      actor: "all",
      action: "all",
      page: 1,
    });
    expect(auditQuery({ q: ["a", "b"] }).q).toBe("a");
  });

  it("write back to the address without their defaults", () => {
    expect(auditSearch({ q: "", actor: "all", action: "all", page: 1 })).toBe("");
    expect(
      auditSearch({ q: "bún", actor: "all", action: "offerRemoved", from: "2026-10-14", page: 2 }),
    ).toBe("?q=b%C3%BAn&action=offerRemoved&from=2026-10-14&page=2");
  });
});

describe("how an audit action looks", () => {
  it("is red for a block, amber for a removal, green for an unblock", () => {
    expect(auditActionLook("sellerBlocked").tone).toBe("error");
    expect(auditActionLook("offerRemoved").tone).toBe("warning");
    expect(auditActionLook("sellerUnblocked").tone).toBe("success");
    expect(auditActionLook("offerSettingsChanged").tone).toBe("info");
  });
});
