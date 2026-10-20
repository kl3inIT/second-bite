import { describe, expect, it } from "vitest";

import { listSearch, oneOf, pageOf, pageSizeOf, searchOf, toggledSort } from "./list-query";
import { promotionDefaults, promotionQueryOf } from "./promotions/promotion";

describe("a marketing list's address", () => {
  it("reads what it knows and falls back to the defaults", () => {
    expect(promotionQueryOf({})).toEqual(promotionDefaults);
    expect(
      promotionQueryOf({
        status: "running",
        size: "20",
        page: "3",
        sort: "code",
        dir: "asc",
        q: " TASCO ",
      }),
    ).toEqual({
      ...promotionDefaults,
      status: "running",
      size: 20,
      page: 3,
      sort: "code",
      dir: "asc",
      q: "TASCO",
    });
    expect(promotionQueryOf({ status: "deleted", size: "7", page: "-2", dir: "up" })).toEqual(
      promotionDefaults,
    );
    expect(promotionQueryOf({ status: ["scheduled", "running"] }).status).toBe("scheduled");
  });

  it("keeps a page, a size and a choice only when they are valid", () => {
    expect(pageOf("2")).toBe(2);
    expect(pageOf("1.5")).toBe(1);
    expect(pageOf(undefined)).toBe(1);
    expect(pageSizeOf("50")).toBe(50);
    expect(pageSizeOf("100")).toBe(10);
    expect(oneOf("b", ["a", "b"] as const, "a")).toBe("b");
    expect(searchOf("x".repeat(120))).toHaveLength(100);
  });

  it("leaves the defaults out and goes back to the first page on a new filter", () => {
    const query = { ...promotionDefaults, page: 3 };
    expect(listSearch(query, { status: "running" }, promotionDefaults)).toBe("?status=running");
    expect(listSearch(query, { page: 4 }, promotionDefaults)).toBe("?page=4");
    expect(listSearch(promotionDefaults, { page: 1 }, promotionDefaults)).toBe("");
    expect(listSearch(query, { q: "tasco", size: 20 }, promotionDefaults)).toBe("?q=tasco&size=20");
    expect(listSearch({ placement: "home" }, { placement: "search" }, { placement: "home" })).toBe(
      "?placement=search",
    );
  });

  it("turns a sorted column around and starts another with its own direction", () => {
    expect(toggledSort({ sort: "period", dir: "desc" }, "period", "desc")).toEqual({
      sort: "period",
      dir: "asc",
    });
    expect(toggledSort({ sort: "period", dir: "desc" }, "code", "asc")).toEqual({
      sort: "code",
      dir: "asc",
    });
  });
});
