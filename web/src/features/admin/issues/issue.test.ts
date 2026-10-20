import { describe, expect, test } from "vitest";

import { issuesHref, kindLook, readIssueQuery, statusLook } from "./issue";

describe("the problem reports' address", () => {
  test("reads the new reports, ten a page, newest first, by default", () => {
    expect(readIssueQuery({})).toEqual({
      tab: "new",
      page: 1,
      size: 10,
      q: "",
      kind: undefined,
      handler: undefined,
      sort: "desc",
    });
  });

  test("keeps what it knows and drops what it does not", () => {
    expect(
      readIssueQuery({
        tab: "done",
        page: "3",
        size: "20",
        q: "  SB-24817 ",
        kind: "refund",
        handler: "none",
        sort: "asc",
      }),
    ).toEqual({
      tab: "done",
      page: 3,
      size: 20,
      q: "SB-24817",
      kind: "refund",
      handler: "none",
      sort: "asc",
    });
    expect(
      readIssueQuery({ tab: "x", page: "-2", size: "15", kind: "y", sort: "z" }),
    ).toMatchObject({
      tab: "new",
      page: 1,
      size: 10,
      kind: undefined,
      sort: "desc",
    });
    expect(readIssueQuery({ page: ["2", "3"] }).page).toBe(1);
  });

  test("writes only what differs from the default", () => {
    expect(issuesHref(readIssueQuery({}))).toBe("/admin/issues");
    const query = readIssueQuery({ tab: "in_progress", page: "2", q: "Minh Anh", kind: "cancel" });
    expect(issuesHref(query)).toBe("/admin/issues?tab=in_progress&q=Minh+Anh&kind=cancel&page=2");
    expect(
      readIssueQuery(Object.fromEntries(new URL(issuesHref(query), "http://x").searchParams)),
    ).toEqual(query);
  });
});

describe("how a report's type and status look", () => {
  test("as Figma AD-BL1 and AD-BL2 draw them", () => {
    expect(kindLook("food_problem").tone).toBe("warning");
    expect(kindLook("refund").tone).toBe("info");
    expect(kindLook("store_closed").tone).toBe("error");
    expect(kindLook("cancel").tone).toBe("neutral");
    expect(kindLook("other").tone).toBe("neutral");
    expect(statusLook("in_progress").tone).toBe("neutral");
    expect(statusLook("done").tone).toBe("success");
  });
});
