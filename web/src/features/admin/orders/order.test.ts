import { describe, expect, it } from "vitest";

import {
  canCancel,
  dayInVietnam,
  defaultOrderSort,
  filterOrders,
  inRange,
  orderClock,
  orderStatusFilter,
  pageOf,
  sellersOf,
  sortOrders,
  toggleSort,
} from "./order";
import { sampleOrder, sampleRows } from "./test-samples";

const all = { search: "", sellerId: "all", status: "all", range: {} } as const;

describe("the orders' filters", () => {
  it("reads the status from the address, falling back to all", () => {
    expect(orderStatusFilter("expired")).toBe("expired");
    expect(orderStatusFilter("waiting")).toBe("waiting");
    expect(orderStatusFilter(["ready", "x"])).toBe("ready");
    expect(orderStatusFilter("paid")).toBe("all");
    expect(orderStatusFilter(undefined)).toBe("all");
  });

  it("keeps the orders still held under waiting", () => {
    const waiting = filterOrders(sampleRows, { ...all, status: "waiting" });
    expect(waiting.map((row) => row.status)).toEqual([
      "confirmed",
      "ready",
      "ready",
      "confirmed",
      "confirmed",
    ]);
    expect(filterOrders(sampleRows, { ...all, status: "expired" })).toHaveLength(2);
  });

  it("searches the code, the customer and the store without minding marks or the #", () => {
    expect(filterOrders(sampleRows, { ...all, search: "#sb-24831" }).map((r) => r.id)).toEqual([
      "o-0",
    ]);
    expect(filterOrders(sampleRows, { ...all, search: "minh anh" })).toHaveLength(1);
    expect(filterOrders(sampleRows, { ...all, search: "tiem banh" })).toHaveLength(3);
  });

  it("keeps one store's orders", () => {
    expect(filterOrders(sampleRows, { ...all, sellerId: "s-may" }).map((r) => r.id)).toEqual([
      "o-2",
      "o-6",
      "o-10",
    ]);
  });

  it("compares days in Vietnam time, both ends included", () => {
    // 17:30 UTC on the 20th is already the 21st in Vietnam.
    expect(dayInVietnam("2026-10-20T17:30:00Z")).toBe("2026-10-21");
    const day = { from: new Date("2026-10-20T05:00:00Z") };
    expect(inRange("2026-10-20T14:00:00Z", day)).toBe(true);
    expect(inRange("2026-10-20T17:30:00Z", day)).toBe(false);
    expect(
      inRange("2026-10-21T01:00:00Z", { from: day.from, to: new Date("2026-10-21T05:00:00Z") }),
    ).toBe(true);
    expect(inRange("2026-10-19T01:00:00Z", {})).toBe(true);
  });

  it("lists the stores of the rows once each, by name", () => {
    expect(sellersOf(sampleRows).map((s) => s.name)).toEqual([
      "Bún chả Phố Hàng",
      "Cơm nhà Hạnh",
      "Tiệm bánh Pháp",
      "Trà sữa Mây",
    ]);
  });
});

describe("the orders' sort and pages", () => {
  it("starts with the latest pickup and flips a column pressed twice", () => {
    expect(sortOrders(sampleRows, defaultOrderSort)[0].id).toBe("o-11");
    const byTotal = toggleSort(defaultOrderSort, "total");
    expect(byTotal).toEqual({ key: "total", direction: "desc" });
    expect(toggleSort(byTotal, "total")).toEqual({ key: "total", direction: "asc" });
    expect(sortOrders(sampleRows, { key: "total", direction: "asc" })[0].totalVnd).toBe(30_000);
    expect(sortOrders(sampleRows, { key: "seller", direction: "asc" })[0].sellerName).toBe(
      "Bún chả Phố Hàng",
    );
  });

  it("cuts pages of ten and keeps the page within those there are", () => {
    expect(pageOf(sampleRows, 2, 10).rows).toHaveLength(2);
    expect(pageOf(sampleRows, 9, 10).page).toBe(2);
    expect(pageOf([], 3, 10)).toEqual({ rows: [], page: 1 });
  });
});

describe("an order", () => {
  it("is held until its window ends, then overdue, or says how it closed", () => {
    expect(orderClock(sampleOrder, new Date("2026-10-20T13:52:00Z"))).toEqual({
      kind: "held",
      minutesLeft: 38,
    });
    expect(orderClock(sampleOrder, new Date("2026-10-20T14:31:00Z"))).toEqual({ kind: "overdue" });
    expect(orderClock({ ...sampleOrder, status: "expired" }, new Date())).toEqual({
      kind: "closed",
      status: "expired",
    });
  });

  it("needs a reason to be cancelled, and a note for another reason", () => {
    expect(canCancel(undefined, "x")).toBe(false);
    expect(canCancel("customerAsked", "")).toBe(true);
    expect(canCancel("other", "  ")).toBe(false);
    expect(canCancel("other", "Cửa hàng đóng cửa sớm")).toBe(true);
  });
});
