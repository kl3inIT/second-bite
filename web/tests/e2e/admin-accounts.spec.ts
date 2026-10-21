import { expect, test } from "@playwright/test";

import { adminSidebar, isReleased, openAdminMenu, signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);
// The page shows "Sắp ra mắt" until its backend exists (pages.ts); these run again once it is released.
test.skip(!isReleased("accounts"), "not released yet");

// SEC-62 › Accounts (Figma AD-TK1 to AD-TK4). The identity module has no admin list of accounts yet, so the list
// is empty and no account is found; the screens with sample accounts are checked in accounts-render.test.ts.
test.describe("the accounts", () => {
  test("the list is empty on each tab until the identity module lists accounts", async ({
    page,
    isMobile,
  }, testInfo) => {
    await signInTo(page, "/admin/accounts", testInfo, { who: "taikhoan" });

    await expect(page.getByRole("heading", { level: 1, name: "Tài khoản" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("navigation", { name: "Vị trí trang" })).toContainText(
      "Người dùng",
    );
    const tabs = page.getByRole("tablist", { name: "Tài khoản theo vai trò" });
    await expect(tabs.getByRole("tab", { name: "Tất cả" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("searchbox", { name: "Tìm tài khoản" })).toBeVisible();
    await expect(page.getByRole("combobox", { name: /Trạng thái/ })).toBeVisible();
    await expect(page.getByText("Chưa có tài khoản nào")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(tabs.getByRole("tab", { name: "Chủ cửa hàng/Nhân viên" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/accounts\?tab=seller$/);
    await expect(tabs.getByRole("tab", { name: "Chủ cửa hàng/Nhân viên" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByText("Chưa có chủ cửa hàng hay nhân viên nào")).toBeVisible();

    if (isMobile) await openAdminMenu(page);
    await expect(
      adminSidebar(page).getByRole("link", { name: "Tài khoản", exact: true }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("an account that does not exist keeps the admin shell", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/accounts/a-1", testInfo, { who: "mottaikhoan" });
    await expect(
      page.getByRole("heading", { level: 1, name: "Không tìm thấy trang này" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Về Tổng quan", exact: true })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
});
