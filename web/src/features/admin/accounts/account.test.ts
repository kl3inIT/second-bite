import { describe, expect, test } from "vitest";

import {
  accountsHref,
  orderLook,
  readAccountQuery,
  readDetailTab,
  roleLook,
  sellersLabel,
  statusLook,
  tabOf,
  toggleSort,
} from "./account";

describe("the accounts' address", () => {
  test("reads every account, ten a page, newest first, by default", () => {
    expect(readAccountQuery({})).toEqual({
      tab: "all",
      page: 1,
      size: 10,
      q: "",
      status: undefined,
      from: undefined,
      to: undefined,
      sort: "createdAt",
      direction: "desc",
    });
  });

  test("keeps what it knows and drops what it does not", () => {
    expect(
      readAccountQuery({ tab: "seller", status: "locked", from: "2026-10-01", sort: "orders" }),
    ).toMatchObject({ tab: "seller", status: "locked", from: "2026-10-01", sort: "orders" });
    expect(
      readAccountQuery({ tab: "owner", status: "banned", to: "2026/10/20", sort: "email" }),
    ).toMatchObject({ tab: "all", status: undefined, to: undefined, sort: "createdAt" });
  });

  test("writes only what differs from the default, and reads back the same", () => {
    expect(accountsHref(readAccountQuery({}))).toBe("/admin/accounts");
    const query = readAccountQuery({ tab: "customer", q: "minh", size: "20", page: "2" });
    const href = accountsHref(query);
    expect(href).toBe("/admin/accounts?tab=customer&q=minh&size=20&page=2");
    expect(readAccountQuery(Object.fromEntries(new URL(href, "http://x").searchParams))).toEqual(
      query,
    );
  });

  test("a heading sorts its column down first, then up", () => {
    const byName = toggleSort(readAccountQuery({ page: "4" }), "name");
    expect(byName).toMatchObject({ sort: "name", direction: "desc", page: 1 });
    expect(toggleSort(byName, "name").direction).toBe("asc");
  });

  test("an account's page opens on its recent orders", () => {
    expect(readDetailTab(undefined)).toBe("orders");
    expect(readDetailTab("stores")).toBe("stores");
    expect(readDetailTab("payments")).toBe("orders");
  });
});

describe("an account", () => {
  test("sits under the tab of its role", () => {
    expect(tabOf("customer")).toBe("customer");
    expect(tabOf("owner")).toBe("seller");
    expect(tabOf("staff")).toBe("seller");
    expect(tabOf("admin")).toBe("admin");
  });

  test("names its first store and how many more", () => {
    expect(sellersLabel([])).toBeUndefined();
    expect(sellersLabel([{ id: "1", name: "Trà sữa Mây" }])).toBe("Trà sữa Mây");
    expect(
      sellersLabel([
        { id: "1", name: "Trà sữa Mây" },
        { id: "2", name: "Cơm nhà Hạnh" },
      ]),
    ).toBe("Trà sữa Mây +1");
  });

  test("looks as Figma AD-TK1 and AD-TK2 draw it", () => {
    expect(roleLook("customer")).toEqual({ tone: "neutral", icon: null });
    expect(roleLook("owner").tone).toBe("info");
    expect(statusLook("active").tone).toBe("success");
    expect(statusLook("locked").tone).toBe("error");
    expect(orderLook("held").tone).toBe("info");
    expect(orderLook("no_show").tone).toBe("warning");
    expect(orderLook("cancelled").tone).toBe("neutral");
  });
});
