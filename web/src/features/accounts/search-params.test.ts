import { describe, expect, it } from "vitest";

import {
  loadAccountSearchParams,
  serializeAccountSearchParams,
  sortOf,
  sortedOf,
} from "./search-params";

describe("the accounts list's address", () => {
  it("defaults to every account, the newest first, 25 to a page", () => {
    const params = loadAccountSearchParams({});
    expect(params).toEqual({ role: null, q: "", sort: null, page: 1, size: 25 });
    expect(sortedOf(params.sort)).toEqual({ column: "created", direction: "descending" });
  });

  it("ignores a role, a sort or a size it does not know", () => {
    expect(loadAccountSearchParams({ role: "owner", sort: "email", size: "1000" })).toMatchObject({
      role: null,
      sort: null,
      size: 25,
    });
  });

  it("reads and writes a descending sort", () => {
    const sort = sortOf("signedIn", "descending");
    expect(sortedOf(sort)).toEqual({ column: "signedIn", direction: "descending" });
    expect(serializeAccountSearchParams({ role: "admin", sort, page: 2 })).toBe(
      "?role=admin&sort=-signedIn&page=2",
    );
  });
});
