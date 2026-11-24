import { describe, expect, it } from "vitest";

import {
  defaultShifts,
  parseShiftValue,
  problemsOf,
  queryString,
  shiftReportQuery,
  shiftValue,
  shiftsOf,
} from "./shifts";

describe("shifts", () => {
  it("writes and reads a shift as the API does", () => {
    const shift = { name: "Ca chiều, muộn", from: "12:00", until: "18:00" };
    expect(shiftValue(shift)).toBe("12:00-18:00,Ca chiều, muộn");
    expect(parseShiftValue(shiftValue(shift))).toEqual(shift);
    expect(parseShiftValue("12:00-25:00,Ca")).toBeNull();
    expect(parseShiftValue("no comma")).toBeNull();
  });

  it("falls back to the three shifts of the day for an address without whole ones", () => {
    expect(shiftsOf(null)).toEqual(defaultShifts);
    expect(shiftsOf(["bad"])).toEqual(defaultShifts);
    expect(shiftsOf(["06:00-12:00,Sớm", "12:00-11:00,Sai"])).toEqual(defaultShifts);
    expect(shiftsOf(["06:00-12:00,Sớm"])).toEqual([{ name: "Sớm", from: "06:00", until: "12:00" }]);
  });

  it("holds shifts to the server's rules", () => {
    expect(problemsOf(defaultShifts)).toEqual([]);
    expect(problemsOf([{ name: " ", from: "06:00", until: "12:00" }])).toContainEqual({
      row: 0,
      field: "name",
      reason: "name",
    });
    expect(problemsOf([{ name: "A", from: "12:00", until: "12:00" }])).toContainEqual({
      row: 0,
      field: "until",
      reason: "order",
    });
    expect(
      problemsOf([
        { name: "A", from: "06:00", until: "12:00" },
        { name: "B", from: "11:59", until: "18:00" },
      ]),
    ).toContainEqual({ row: 1, field: "from", reason: "overlap" });
    expect(problemsOf([{ name: "A", from: "24:00", until: "24:00" }]).length).toBeGreaterThan(0);
    expect(problemsOf([])).toContainEqual({ row: 0, field: "name", reason: "count" });
  });

  it("builds the query and leaves the default shifts out of it", () => {
    const from = new Date("2026-11-22T00:00:00Z");
    const to = new Date("2026-11-24T00:00:00Z");
    expect(shiftReportQuery({ from, to, store: null, shifts: defaultShifts })).toEqual({
      since: "2026-11-22",
      until: "2026-11-24",
    });
    const query = shiftReportQuery({
      from,
      to,
      store: "s1",
      shifts: [{ name: "Cả ngày", from: "00:00", until: "24:00" }],
    });
    expect(query).toEqual({
      since: "2026-11-22",
      until: "2026-11-24",
      sellerId: "s1",
      shift: ["00:00-24:00,Cả ngày"],
    });
    expect(queryString(query)).toBe(
      "since=2026-11-22&until=2026-11-24&sellerId=s1&shift=00%3A00-24%3A00%2CC%E1%BA%A3+ng%C3%A0y",
    );
  });

  it("reads at most 31 days, the last ones", () => {
    const query = shiftReportQuery({
      from: new Date("2026-01-01T00:00:00Z"),
      to: new Date("2026-11-24T00:00:00Z"),
      store: null,
      shifts: defaultShifts,
    });
    expect(query.since).toBe("2026-10-25");
  });
});
