import { describe, expect, it } from "vitest";

import {
  canApprove,
  canReject,
  difference,
  filterRefunds,
  filterTransactions,
  paymentsTab,
  refundStatuses,
  sellerNames,
  sortRefunds,
  sortTransactions,
  statusFilter,
  transactionStatuses,
} from "./payment";
import { sampleRefunds, sampleTransactions } from "./test-samples";

describe("the payments page's address", () => {
  it("opens the transactions unless it names the refunds", () => {
    expect(paymentsTab(undefined)).toBe("transactions");
    expect(paymentsTab("refunds")).toBe("refunds");
    expect(paymentsTab("other")).toBe("transactions");
  });

  it("keeps a status only from the tab's own", () => {
    expect(statusFilter("mismatch", transactionStatuses)).toBe("mismatch");
    expect(statusFilter("pending", transactionStatuses)).toBe("all");
    expect(statusFilter(["pending"], refundStatuses)).toBe("pending");
  });
});

describe("the transactions", () => {
  const all = { search: "", method: "all", status: "all", range: {} } as const;

  it("filter by method, state and words", () => {
    expect(filterTransactions(sampleTransactions, { ...all, method: "cash" })).toHaveLength(5);
    expect(
      filterTransactions(sampleTransactions, { ...all, status: "mismatch" }).map((r) => r.code),
    ).toEqual(["GD-1045", "GD-1040"]);
    expect(filterTransactions(sampleTransactions, { ...all, search: "#sb-2041" })).toHaveLength(1);
    expect(filterTransactions(sampleTransactions, { ...all, search: "bun cha" })).toHaveLength(2);
  });

  it("sort by time, latest first, or by amount", () => {
    expect(sortTransactions(sampleTransactions, { key: "at", direction: "desc" })[0].code).toBe(
      "GD-1048",
    );
    expect(
      sortTransactions(sampleTransactions, { key: "amount", direction: "desc" })[0].amountVnd,
    ).toBe(50_000);
  });

  it("say how a transfer differs from the order", () => {
    expect(difference(40_000, 45_000)).toEqual({ kind: "short", amountVnd: 5_000 });
    expect(difference(50_000, 45_000)).toEqual({ kind: "over", amountVnd: 5_000 });
    expect(difference(45_000, 45_000)).toEqual({ kind: "even", amountVnd: 0 });
  });
});

describe("the refunds", () => {
  const all = { search: "", status: "all", seller: "all", range: {} } as const;

  it("filter by state, store and words", () => {
    expect(filterRefunds(sampleRefunds, { ...all, status: "pending" })).toHaveLength(5);
    expect(filterRefunds(sampleRefunds, { ...all, seller: "Tiệm bánh Pháp" })).toHaveLength(3);
    expect(filterRefunds(sampleRefunds, { ...all, search: "duc long" })).toHaveLength(1);
    expect(sellerNames(sampleRefunds)).toHaveLength(4);
  });

  it("sort by the day sent, latest first", () => {
    expect(sortRefunds(sampleRefunds, { key: "requestedAt", direction: "desc" })[0].code).toBe(
      "HT-0312",
    );
  });

  it("are approved for 1đ up to the order's amount, and refused with a reason", () => {
    expect(canApprove(45_000, 45_000)).toBe(true);
    expect(canApprove(0, 45_000)).toBe(false);
    expect(canApprove(45_001, 45_000)).toBe(false);
    expect(canReject("   ")).toBe(false);
    expect(canReject("Ảnh cho thấy món đủ phần")).toBe(true);
  });
});
