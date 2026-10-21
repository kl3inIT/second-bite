import { expect, type Page, test } from "@playwright/test";

import { adminSidebar, isReleased, openAdminMenu, signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

/** The coming-soon page (Figma AD-TT6): the page's name and "Sắp có" in one card, nothing to press. */
async function expectComingSoon(page: Page, name: string) {
  const heading = page.getByRole("heading", { level: 1, name });
  await expect(heading).toBeVisible();
  const card = page.getByRole("main").locator("section", { has: heading });
  await expect(card.getByText("Sắp có", { exact: true })).toBeVisible();
  await expect(card.getByRole("button")).toHaveCount(0);
  await expect(card.getByRole("link")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
}

// SEC-62 › Menu đầy đủ và trang Sắp ra mắt (docs: admin-web-flow): a page whose backend does not exist yet keeps
// its place in the menu with "Sắp có" and shows the coming-soon page, its code kept behind its flag (pages.ts).
test.describe("the pages that are not released yet", () => {
  test.skip(isReleased("orders") && isReleased("reports"), "Every page here is released.");

  test("a page shows its name and Sắp có, and the menu holds only the open pages", async ({
    page,
    isMobile,
  }, testInfo) => {
    await signInTo(page, "/admin/orders", testInfo, { who: "sapco" });

    await expectComingSoon(page, "Đơn hàng");
    const crumbs = page.getByRole("navigation", { name: "Vị trí trang" });
    await expect(crumbs).toContainText("Vận hành");
    await expect(crumbs).toContainText("Đơn hàng");

    // An entry joins the menu with its screen (SEC-75 › Shell): no entry opens a coming-soon page.
    if (isMobile) await openAdminMenu(page);
    await expect(
      adminSidebar(page).getByRole("link", { name: "Cửa hàng", exact: true }),
    ).toBeVisible();
    await expect(
      adminSidebar(page).getByRole("link", { name: "Tổng quan", exact: true }),
    ).toBeVisible();
    await expect(adminSidebar(page).getByRole("link", { name: "Đơn hàng" })).toHaveCount(0);
    await expect(adminSidebar(page).getByText("Sắp có")).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);
  });

  test("a detail page shows the coming-soon page of its list", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/orders/SB-24817", testInfo, { who: "sapco-don" });
    await expectComingSoon(page, "Đơn hàng");
  });

  test("the reports read Quản trị / Báo cáo", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/reports", testInfo, { who: "sapco-baocao" });
    await expectComingSoon(page, "Báo cáo");
    await expect(page.getByRole("navigation", { name: "Vị trí trang" })).toHaveText(
      /^Quản trị\s*\/\s*Báo cáo$/,
    );
    await expectNoSeriousA11yViolations(page);
  });

  test("a marketing page and a settings page show it too", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/promotions", testInfo, { who: "sapco-mk" });
    await expectComingSoon(page, "Mã giảm giá");
    await expectNoSeriousA11yViolations(page);

    await page.goto("/vi/admin/settings/categories");
    await expectComingSoon(page, "Danh mục");
    await expect(page.getByRole("navigation", { name: "Vị trí trang" })).toContainText("Cài đặt");
    await expectNoSeriousA11yViolations(page);
  });

  test("the settings menu holds only the open settings pages", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/settings/offers", testInfo, { who: "sapco-cd" });
    const menu = page.getByRole("navigation", { name: "Mục cài đặt" });
    // As the sidebar, the settings menu holds only the pages that are open (SEC-75 › Shell).
    await expect(menu.getByRole("link")).toHaveCount(3);
    await expect(menu.getByRole("link", { name: "Bài đăng", exact: true })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Email", exact: true })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Quản trị viên", exact: true })).toBeVisible();
    await expect(menu.getByText("Sắp có")).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);
  });
});
