import { describe, expect, it } from "vitest";

import { mergeActivity } from "./activity";
import { axisTicks, dailySeries } from "./daily-series";
import { addDays, dateToDay, dayInVietnam, daysBetween, dayToDate, isDay, weekday } from "./days";
import { chartDays, rangeDays, readOverviewRange } from "./overview-range";

describe("days in Vietnam time", () => {
  it("takes the day it is in Vietnam, not in UTC", () => {
    // 20 October 2026 at 18:30 UTC is already the 21st in Hanoi (UTC+7).
    expect(dayInVietnam(new Date("2026-10-20T18:30:00Z"))).toBe("2026-10-21");
    expect(dayInVietnam(new Date("2026-10-20T16:59:00Z"))).toBe("2026-10-20");
  });

  it("counts across months and years", () => {
    expect(addDays("2026-10-01", -1)).toBe("2026-09-30");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(daysBetween("2026-09-21", "2026-10-20")).toBe(30);
    expect(daysBetween("2026-10-20", "2026-10-20")).toBe(1);
  });

  it("refuses what is not a real day", () => {
    expect(isDay("2026-10-20")).toBe(true);
    expect(isDay("2026-02-30")).toBe(false);
    expect(isDay("20/10/2026")).toBe(false);
    expect(isDay(undefined)).toBe(false);
    expect(isDay(["2026-10-20"])).toBe(false);
  });

  it("starts the week on Monday", () => {
    expect(weekday("2026-10-19")).toBe(0);
    expect(weekday("2026-10-25")).toBe(6);
  });

  it("names the same day as a Date in Vietnam and back from a calendar", () => {
    const date = dayToDate("2026-10-20");
    expect(dayInVietnam(date)).toBe("2026-10-20");
    expect(dateToDay(new Date(2026, 9, 20))).toBe("2026-10-20");
  });
});

describe("the dashboard's span", () => {
  it("reads today unless the address names a span it offers", () => {
    expect(readOverviewRange(undefined)).toBe("today");
    expect(readOverviewRange("7d")).toBe("7d");
    expect(readOverviewRange("30d")).toBe("30d");
    expect(readOverviewRange("90d")).toBe("today");
    expect(readOverviewRange(["7d"])).toBe("today");
  });

  it("ends every span today, both ends counted", () => {
    expect(rangeDays("today", "2026-10-20")).toEqual({ from: "2026-10-20", to: "2026-10-20" });
    expect(rangeDays("7d", "2026-10-20")).toEqual({ from: "2026-10-14", to: "2026-10-20" });
    expect(rangeDays("30d", "2026-10-20")).toEqual({ from: "2026-09-21", to: "2026-10-20" });
  });

  it("draws a week when the span is today alone", () => {
    expect(chartDays("today", "2026-10-20")).toEqual({ from: "2026-10-14", to: "2026-10-20" });
    expect(chartDays("30d", "2026-10-20")).toEqual(rangeDays("30d", "2026-10-20"));
  });
});

describe("the chart's y axis", () => {
  it("steps from 0 in round numbers, over the highest count", () => {
    expect(axisTicks(5)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(axisTicks(37)).toEqual([0, 10, 20, 30, 40]);
    expect(axisTicks(50)).toEqual([0, 10, 20, 30, 40, 50]);
    expect(axisTicks(7)).toEqual([0, 2, 4, 6, 8]);
    expect(axisTicks(120)).toEqual([0, 50, 100, 150]);
  });

  it("keeps 0 to 4 for an empty or flat week", () => {
    expect(axisTicks(0)).toEqual([0, 1, 2, 3, 4]);
    expect(axisTicks(1)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe("the chart's days", () => {
  it("matches new accounts to the posts' days and counts a missing day as none", () => {
    expect(
      dailySeries(
        [
          { date: "2026-10-19", count: 3 },
          { date: "2026-10-20", count: 0 },
        ],
        [{ date: "2026-10-20", count: 2 }],
      ),
    ).toEqual([
      { date: "2026-10-19", posts: 3, accounts: 0 },
      { date: "2026-10-20", posts: 0, accounts: 2 },
    ]);
  });
});

describe("the recent activity", () => {
  const sellers = [
    { id: "s1", name: "Tiệm bánh Pháp", openedAt: "2026-10-20T08:47:00+07:00" },
    { id: "s2", name: "Cơm nhà Hạnh", openedAt: "2026-10-18T09:00:00+07:00" },
  ];
  const offers = [
    {
      id: "o1",
      name: "Bánh mì bơ tỏi",
      postedAt: "2026-10-20T10:15:00+07:00",
      sellerId: "s1",
      sellerName: "Tiệm bánh Pháp",
    },
    {
      id: "o2",
      name: "Cơm trưa",
      postedAt: "2026-10-19T11:00:00+07:00",
      sellerId: "s2",
      sellerName: "Cơm nhà Hạnh",
    },
  ];

  it("puts stores and posts in one list, newest first", () => {
    expect(mergeActivity(sellers, offers, 5).map((item) => item.key)).toEqual([
      "offer-o1",
      "seller-s1",
      "offer-o2",
      "seller-s2",
    ]);
  });

  it("orders by the moment, whatever the offset it is written in", () => {
    const utc = [{ id: "s3", name: "Trà sữa Mây", openedAt: "2026-10-20T03:30:00Z" }];
    // 03:30 UTC is 10:30 in Hanoi: after the 10:15 post.
    expect(mergeActivity(utc, offers, 1)[0]?.key).toBe("seller-s3");
  });

  it("keeps only the newest", () => {
    expect(mergeActivity(sellers, offers, 2)).toHaveLength(2);
    expect(mergeActivity([], [], 5)).toEqual([]);
  });
});
