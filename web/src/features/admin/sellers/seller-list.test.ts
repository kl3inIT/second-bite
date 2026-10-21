import { describe, expect, it } from "vitest";

import type { SellerBody } from "@/lib/api/generated";

import {
  applyListQuery,
  areaOf,
  areasOf,
  defaultQuery,
  isFiltered,
  listQueryString,
  listStatuses,
  neighboursOf,
  readListQuery,
  readStatus,
  toggleSort,
} from "./seller-list";

function seller(name: string, address: string, updatedAt: string): SellerBody {
  return {
    id: `se-${name}`,
    name,
    address,
    phone: "0900 000 100",
    latitude: 21.05,
    longitude: 105.89,
    status: "active",
    createdAt: "2026-10-01T09:00:00+07:00",
    updatedAt,
  };
}

const rows = [
  seller("Tiệm bánh Pháp", "Tầng 1, Tasco Mall, Việt Hưng", "2026-10-20T10:00:00+07:00"),
  seller("Cơm nhà Hạnh", "Tầng 3, khu ẩm thực, Tasco Mall", "2026-10-19T23:30:00+07:00"),
  seller("Xôi xéo Bà Tư", "Tầng B1, Tasco Mall", "2026-10-18T08:00:00+07:00"),
  seller("Đậu phụ Đông", "Tầng 1, Tasco Mall", "2026-10-18T08:00:00+07:00"),
];

describe("the stores list's address", () => {
  it("reads the defaults from an empty address and writes nothing back", () => {
    const query = readListQuery(new URLSearchParams());
    expect(query).toEqual(defaultQuery);
    expect(listQueryString(query)).toBe("");
  });

  it("keeps what it can use and drops what it cannot", () => {
    const query = readListQuery({
      status: "blocked",
      q: "bánh",
      size: "50",
      page: "2",
      sort: "name",
      from: "2026-10-01",
      to: "hôm nay",
    });
    expect(query).toMatchObject({ status: "blocked", q: "bánh", size: 50, page: 2, sort: "name" });
    expect(query.dir).toBe("asc");
    expect(query.to).toBeUndefined();
    expect(readListQuery({ status: "closed", size: "15", page: "-1" })).toMatchObject({
      status: "active",
      size: 10,
      page: 1,
    });
  });

  it("writes a state it reads back the same", () => {
    const query = {
      ...defaultQuery,
      status: "pending" as const,
      area: "Tầng 1",
      sort: "address" as const,
      dir: "desc" as const,
    };
    expect(readListQuery(new URLSearchParams(listQueryString(query)))).toEqual(query);
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
    expect(isFiltered({ ...defaultQuery, from: "2026-10-01" })).toBe(true);
  });

  it("turns a sorted column the other way and starts a new one in its natural order", () => {
    expect(toggleSort(defaultQuery, "updatedAt")).toEqual({ sort: "updatedAt", dir: "asc" });
    expect(toggleSort(defaultQuery, "name")).toEqual({ sort: "name", dir: "asc" });
    expect(toggleSort({ ...defaultQuery, sort: "name", dir: "asc" }, "name")).toEqual({
      sort: "name",
      dir: "desc",
    });
  });
});

describe("the areas", () => {
  it("are read from the address", () => {
    expect(areaOf("Tầng 3, khu ẩm thực, Tasco Mall")).toBe("Tầng 3");
    expect(areaOf("tang B1, Tasco Mall")).toBe("Tầng B1");
    expect(areaOf("Tasco Mall, Việt Hưng")).toBeUndefined();
  });

  it("are listed once each, in order", () => {
    expect(areasOf(rows)).toEqual(["Tầng 1", "Tầng 3", "Tầng B1"]);
  });
});

describe("the stores shown", () => {
  it("are the newest change first by default", () => {
    const shown = applyListQuery(rows, defaultQuery);
    expect(shown.total).toBe(4);
    // Two changed at the same moment keep the name's order.
    expect(shown.rows.map((row) => row.name)).toEqual([
      "Tiệm bánh Pháp",
      "Cơm nhà Hạnh",
      "Đậu phụ Đông",
      "Xôi xéo Bà Tư",
    ]);
  });

  it("are found by name or address without the marks", () => {
    const byName = applyListQuery(rows, { ...defaultQuery, q: "banh phap" });
    expect(byName.rows.map((row) => row.name)).toEqual(["Tiệm bánh Pháp"]);
    const byAddress = applyListQuery(rows, { ...defaultQuery, q: "AM THUC" });
    expect(byAddress.rows.map((row) => row.name)).toEqual(["Cơm nhà Hạnh"]);
    expect(applyListQuery(rows, { ...defaultQuery, q: "dau phu dong" }).total).toBe(1);
    expect(applyListQuery(rows, { ...defaultQuery, q: "bánh cuốn" }).total).toBe(0);
  });

  it("are narrowed to an area and to change days in Vietnam's time", () => {
    expect(applyListQuery(rows, { ...defaultQuery, area: "Tầng 1" }).total).toBe(2);
    // 23:30 on the 19th in Vietnam is still the 19th there, whatever the browser's zone.
    const days = applyListQuery(rows, { ...defaultQuery, from: "2026-10-19", to: "2026-10-19" });
    expect(days.rows.map((row) => row.name)).toEqual(["Cơm nhà Hạnh"]);
  });

  it("are sorted by name in Vietnamese order", () => {
    const shown = applyListQuery(rows, { ...defaultQuery, sort: "name", dir: "asc" });
    expect(shown.rows.map((row) => row.name)).toEqual([
      "Cơm nhà Hạnh",
      "Đậu phụ Đông",
      "Tiệm bánh Pháp",
      "Xôi xéo Bà Tư",
    ]);
  });

  it("lead from one store to the one before and after it, as the list first opens", () => {
    expect(neighboursOf(rows, "se-Cơm nhà Hạnh")).toEqual({
      previous: "se-Tiệm bánh Pháp",
      next: "se-Đậu phụ Đông",
      position: 2,
      total: 4,
    });
    expect(neighboursOf(rows, "se-Tiệm bánh Pháp").previous).toBeUndefined();
    expect(neighboursOf(rows, "se-khác")).toEqual({ position: 0, total: 4 });
  });

  it("are cut into pages, a page past the end showing the last", () => {
    const many = Array.from({ length: 23 }, (_, i) =>
      seller(
        `Cửa hàng ${i + 1}`,
        "Tầng 1",
        `2026-10-${String(i + 1).padStart(2, "0")}T09:00:00+07:00`,
      ),
    );
    const second = applyListQuery(many, { ...defaultQuery, page: 2 });
    expect(second.rows).toHaveLength(10);
    expect(second.rows[0].name).toBe("Cửa hàng 13");
    const past = applyListQuery(many, { ...defaultQuery, page: 9 });
    expect(past.page).toBe(3);
    expect(past.rows).toHaveLength(3);
  });
});
