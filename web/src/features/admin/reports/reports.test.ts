import { describe, expect, it } from "vitest";

import { readReportQuery, weeklyTotals } from "./report-query";
import { nextReportSort, type ReportSellerRow, sortReportRows } from "./report-rows";

const today = "2026-10-20"; // a Tuesday

describe("the report's range", () => {
  it("opens on the 30 days that end today", () => {
    expect(readReportQuery({}, today)).toEqual({ from: "2026-09-21", to: today });
  });

  it("keeps a valid range and a store", () => {
    expect(readReportQuery({ from: "2026-10-01", to: "2026-10-07", seller: "s1" }, today)).toEqual({
      from: "2026-10-01",
      to: "2026-10-07",
      sellerId: "s1",
    });
  });

  it("falls back to the default for a reversed, half or unreadable range", () => {
    const fallback = { from: "2026-09-21", to: today };
    expect(readReportQuery({ from: "2026-10-07", to: "2026-10-01" }, today)).toEqual(fallback);
    expect(readReportQuery({ from: "2026-10-07" }, today)).toEqual(fallback);
    expect(readReportQuery({ from: "07/10/2026", to: today }, today)).toEqual(fallback);
    expect(readReportQuery({ seller: "" }, today)).toEqual(fallback);
  });

  it("keeps the last 90 days of a longer range, as the summary answers no more", () => {
    expect(readReportQuery({ from: "2026-01-01", to: today }, today)).toEqual({
      from: "2026-07-23",
      to: today,
    });
  });
});

describe("posts by week", () => {
  const days = (from: string, counts: number[]) =>
    counts.map((count, index) => {
      const at = new Date(`${from}T00:00:00Z`);
      at.setUTCDate(at.getUTCDate() + index);
      return { date: at.toISOString().slice(0, 10), count };
    });

  it("sums Monday to Sunday, keeping the cut first week and marking the one under way", () => {
    // Saturday 10 October to Tuesday 20 October.
    const weeks = weeklyTotals(days("2026-10-10", [1, 2, 3, 3, 3, 3, 3, 3, 3, 4, 5]), today);
    expect(weeks).toEqual([
      { from: "2026-10-10", to: "2026-10-11", count: 3, running: false },
      { from: "2026-10-12", to: "2026-10-18", count: 21, running: false },
      { from: "2026-10-19", to: "2026-10-20", count: 9, running: true },
    ]);
  });

  it("does not call a week under way once it is over or when the range ended before today", () => {
    expect(weeklyTotals(days("2026-10-12", [1, 1, 1, 1, 1, 1, 1]), "2026-10-18")).toEqual([
      { from: "2026-10-12", to: "2026-10-18", count: 7, running: false },
    ]);
    expect(weeklyTotals(days("2026-10-12", [2, 2]), today)[0]?.running).toBe(false);
    expect(weeklyTotals([], today)).toEqual([]);
  });
});

describe("the stores' lines", () => {
  const row = (name: string, orders: number): ReportSellerRow => ({
    sellerId: name,
    name,
    orders,
    portionsSaved: orders,
    collectionRate: 0.9,
    revenueVnd: orders * 39_000,
  });
  const rows = [row("Cơm nhà Hạnh", 96), row("Ánh Dương", 21), row("Bánh mì Hội An", 112)];

  it("sorts by orders, most first, and by name in Vietnamese order", () => {
    expect(sortReportRows(rows, { key: "orders", direction: "desc" }).map((r) => r.orders)).toEqual(
      [112, 96, 21],
    );
    expect(sortReportRows(rows, { key: "name", direction: "asc" }).map((r) => r.name)).toEqual([
      "Ánh Dương",
      "Bánh mì Hội An",
      "Cơm nhà Hạnh",
    ]);
  });

  it("turns the sorted column over, and starts another most first or A to Z", () => {
    expect(nextReportSort({ key: "orders", direction: "desc" }, "orders")).toEqual({
      key: "orders",
      direction: "asc",
    });
    expect(nextReportSort({ key: "orders", direction: "desc" }, "revenueVnd")).toEqual({
      key: "revenueVnd",
      direction: "desc",
    });
    expect(nextReportSort({ key: "orders", direction: "desc" }, "name")).toEqual({
      key: "name",
      direction: "asc",
    });
  });
});
