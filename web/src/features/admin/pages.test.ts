import { describe, expect, it } from "vitest";

import vi from "../../../messages/admin/shell.vi.json";

import { adminHref, adminPages, isReleased, lineage, matchAdminPage } from "./pages";

describe("the admin page registry", () => {
  it("finds the page an address shows, a detail page among them", () => {
    expect(matchAdminPage("/admin/sellers")).toBe("sellers");
    expect(matchAdminPage("/admin/sellers/se-1")).toBe("sellerDetail");
    expect(matchAdminPage("/admin/settings/legal")).toBe("settingsLegal");
    expect(matchAdminPage("/admin/content/banners/bn-1")).toBe("bannerDetail");
    expect(matchAdminPage("/admin/notifications/new")).toBe("notificationsCompose");
    expect(matchAdminPage("/admin/sellers/se-1/extra")).toBeUndefined();
    expect(matchAdminPage("/admin/nothing")).toBeUndefined();
  });

  it("heads a page outside the sidebar's groups with the admin itself", () => {
    expect(adminPages.overview.section).toBe("admin");
    expect(adminPages.reports.section).toBe("admin");
    expect(adminPages.settings.section).toBe("admin");
    expect(adminPages.sellers.section).toBe("operations");
  });

  it("builds an address with its parameters", () => {
    expect(adminHref("sellerDetail", { sellerId: "se 1" })).toBe("/admin/sellers/se%201");
    expect(() => adminHref("orderDetail")).toThrow(/orderId/);
  });

  it("names every page that has a name of its own in the shell catalog", () => {
    for (const key of Object.keys(adminPages)) {
      if (key.endsWith("Detail")) continue;
      expect(vi.pages, key).toHaveProperty(key);
    }
  });

  it("opens only the pages whose backend exists, a detail page through its parent", () => {
    expect(lineage("sellerDetail")).toEqual(["sellerDetail", "sellers"]);
    const open = (Object.keys(adminPages) as (keyof typeof adminPages)[]).filter((key) =>
      isReleased(key),
    );
    expect(open).toEqual([
      "overview",
      "sellers",
      "sellerDetail",
      "settings",
      "settingsOffers",
      "settingsEmail",
      "settingsAdmins",
    ]);
    expect(isReleased("orderDetail")).toBe(false);
  });
});
