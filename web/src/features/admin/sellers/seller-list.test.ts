import { describe, expect, it } from "vitest";

import {
  defaultQuery,
  isFiltered,
  listQueryString,
  listStatuses,
  neighboursOf,
  readListQuery,
  readStatus,
} from "./seller-list";

describe("the stores list's address", () => {
  it("reads the defaults from an empty address and writes nothing back", () => {
    const query = readListQuery(new URLSearchParams(), false);
    expect(query).toEqual(defaultQuery);
    expect(listQueryString(query, false)).toBe("");
  });

  it("keeps what it can use and drops what it cannot", () => {
    const query = readListQuery({ status: "blocked", q: " bánh ", size: "50", page: "2" }, false);
    expect(query).toEqual({ status: "blocked", q: "bánh", size: 50, page: 2 });
    expect(readListQuery({ status: "closed", size: "15", page: "-1" }, false)).toEqual(
      defaultQuery,
    );
  });

  it("writes a state it reads back the same", () => {
    const query = { ...defaultQuery, status: "pending" as const, q: "banh", page: 3 };
    expect(readListQuery(new URLSearchParams(listQueryString(query, false)), false)).toEqual(query);
  });

  it("offers the rejected stores and opens on the pending queue only with the storeReview flag", () => {
    expect(listStatuses(false)).toEqual(["active", "pending", "blocked"]);
    expect(listStatuses(true)).toEqual(["pending", "active", "rejected", "blocked"]);
    expect(readStatus({ status: "rejected" }, false)).toBe("active");
    expect(readStatus({}, true)).toBe("pending");
    expect(readStatus({ status: "rejected" }, true)).toBe("rejected");

    const queue = readListQuery(new URLSearchParams(), true);
    expect(queue.status).toBe("pending");
    expect(listQueryString(queue, true)).toBe("");
    expect(listQueryString({ ...queue, status: "active" }, true)).toBe("status=active");
    expect(listQueryString({ ...defaultQuery, status: "pending" }, false)).toBe("status=pending");
  });

  it("knows when the list is narrowed", () => {
    expect(isFiltered(defaultQuery)).toBe(false);
    expect(isFiltered({ ...defaultQuery, q: "  " })).toBe(false);
    expect(isFiltered({ ...defaultQuery, q: "bánh" })).toBe(true);
  });
});

describe("a store's neighbours", () => {
  const rows = [{ id: "se-1" }, { id: "se-2" }, { id: "se-3" }, { id: "se-4" }];

  it("are the stores before and after it in the backend's order", () => {
    expect(neighboursOf(rows, "se-2")).toEqual({
      previous: "se-1",
      next: "se-3",
      position: 2,
      total: 4,
    });
    expect(neighboursOf(rows, "se-1").previous).toBeUndefined();
    expect(neighboursOf(rows, "se-x")).toEqual({ position: 0, total: 4 });
  });
});
