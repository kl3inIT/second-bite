import { expect, test } from "@playwright/test";

import { adminSidebar, isReleased, openAdminMenu, signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);
// The page shows "Sắp ra mắt" until its backend exists (pages.ts); these run again once it is released.
test.skip(!isReleased("issues"), "not released yet");

// SEC-62 › Problem reports (Figma AD-BL1 to AD-BL4). SEC-13 has not built the reports, so the queue is empty
// and no report is found; the screens with sample reports are checked in issues-render.test.ts.
test.describe("the problem reports", () => {
  test("the queue is empty on each tab until SEC-13", async ({ page, isMobile }, testInfo) => {
    await signInTo(page, "/admin/issues", testInfo, { who: "baoloi" });

    await expect(page.getByRole("heading", { level: 1, name: "Báo lỗi" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
    const crumbs = page.getByRole("navigation", { name: "Đường dẫn" });
    await expect(crumbs).toContainText("Vận hành");
    const tabs = page.getByRole("navigation", { name: "Báo lỗi theo trạng thái" });
    await expect(tabs.getByRole("link", { name: "Mới" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("searchbox", { name: "Tìm báo lỗi" })).toBeVisible();
    await expect(page.getByText("Loại:")).toBeVisible();
    await expect(page.getByText("Người xử lý:")).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Đơn / cửa hàng liên quan" }),
    ).toBeAttached();
    await expect(page.getByText("Không có báo lỗi mới")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(tabs.getByRole("link", { name: "Đã xong" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/issues\?tab=done$/);
    await expect(page.getByText("Chưa có báo lỗi đã xong")).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Xong lúc" })).toBeAttached();

    if (isMobile) await openAdminMenu(page);
    await expect(adminSidebar(page).getByRole("link", { name: "Báo lỗi" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("a search goes into the address", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/issues?tab=in_progress", testInfo, { who: "timbaoloi" });
    await (await hydrated(page.getByRole("searchbox", { name: "Tìm báo lỗi" }))).fill("SB-24817");
    await expect(page).toHaveURL(/\/vi\/admin\/issues\?tab=in_progress&q=SB-24817$/);
    await expect(page.getByText("Không có báo lỗi đang xử lý")).toBeVisible();
  });

  test("a report that does not exist keeps the admin shell", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/issues/BL-1042", testInfo, { who: "motbaoloi" });
    await expect(
      page.getByRole("heading", { level: 1, name: "Không tìm thấy trang này" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Về Tổng quan", exact: true })).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
    await expectNoSeriousA11yViolations(page);
  });
});
