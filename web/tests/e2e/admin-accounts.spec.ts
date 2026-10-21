import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

/** Signs in as an admin of its own, so the admins it sees are its own in the stub. */
async function signInAsAdmin(page: Page, name: string) {
  const response = await page.request.post("/api/auth/sessions", {
    data: {
      challengeId: `ch-${encodeURIComponent(`admin.${name}@example.com`)}`,
      code: "123456",
      session: "cookie",
    },
  });
  expect(response.status()).toBe(201);
}

// SEC-75 › the accounts (Figma AD-TK1 and AD-TK2 as proposed), on the stub's eight customers and three admins.
test.describe("the accounts", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await signInAsAdmin(page, `accounts.${testInfo.project.name}.${testInfo.title.length}`);
  });

  test("the admin's home opens the accounts, the newest first, with their stores and last sign-in", async ({
    page,
  }) => {
    await page.goto("/vi/admin");
    await expect(page).toHaveURL(/\/vi\/admin\/accounts$/);
    await expect(page.getByRole("heading", { level: 1, name: "Tài khoản" })).toBeVisible();

    await expect(page.getByRole("tab", { name: /Tất cả\s*11/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    const table = page.getByRole("table", { name: "Tài khoản" });
    await expect(table.getByRole("row")).toHaveCount(12);
    await expect(table.getByRole("row").nth(1)).toContainText("linh@example.com");
    await expect(table.getByRole("row").nth(1)).toContainText("Chưa đăng nhập");
    await expect(table.getByRole("row", { name: /Quốc Bảo/ })).toContainText("La Paris · Chủ");
    await expect(table.getByRole("row", { name: /Thu Hà/ })).toContainText("La Paris · Nhân viên");
    await expect(table.getByRole("columnheader", { name: "Ngày tạo" })).toHaveAttribute(
      "aria-sort",
      "descending",
    );
    await expectNoSeriousA11yViolations(page);
  });

  test("a tab, words without marks and a head narrow and order the list", async ({ page }) => {
    await page.goto("/vi/admin/accounts");
    const table = page.getByRole("table", { name: "Tài khoản" });

    await (await hydrated(page.getByRole("tab", { name: /Quản trị\s*3/ }))).click();
    await expect(page).toHaveURL(/role=admin/);
    await expect(table.getByRole("row")).toHaveCount(4);

    await page.getByRole("tab", { name: /Tất cả/ }).click();
    await page.getByRole("searchbox", { name: "Tìm theo tên hoặc email" }).fill("duc khang");
    await expect(page).toHaveURL(/q=duc\+khang/);
    await expect(table.getByRole("row")).toHaveCount(2);
    await expect(table).toContainText("Đức Khang");

    await page.getByRole("searchbox", { name: "Tìm theo tên hoặc email" }).fill("không có ai");
    await expect(page.getByText("Không tìm thấy tài khoản")).toBeVisible();
    await page.getByRole("button", { name: "Xoá từ khoá" }).click();
    await expect(table.getByRole("row")).toHaveCount(12);

    await table.getByRole("button", { name: "Lần đăng nhập cuối" }).click();
    await expect(page).toHaveURL(/sort=signedIn/);
    await expect(table.getByRole("columnheader", { name: "Lần đăng nhập cuối" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    await expect(table.getByRole("row").last()).toContainText("Chưa đăng nhập");
    await expectNoSeriousA11yViolations(page);
  });

  test("an account shows its figures, latest orders, sign-in and stores", async ({ page }) => {
    await page.goto("/vi/admin/accounts");
    await (
      await hydrated(
        page.getByRole("table", { name: "Tài khoản" }).getByRole("link", { name: "Quốc Bảo" }),
      )
    ).click();
    await expect(page).toHaveURL(/\/vi\/admin\/accounts\/ac-bao$/);

    await expect(page.getByRole("heading", { level: 1, name: "Quốc Bảo" })).toBeVisible();
    await expect(page.getByRole("paragraph").filter({ hasText: "bao@example.com" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Vị trí trang" })).toContainText("Tài khoản");
    await expect(page.getByRole("definition").filter({ hasText: "83%" })).toBeVisible();
    await expect(page.getByRole("term").filter({ hasText: "Tỉ lệ đến lấy" })).toBeVisible();
    const recent = page.getByRole("list").filter({ hasText: "Không đến" });
    await expect(recent.getByRole("listitem")).toHaveCount(5);
    await expect(recent).toContainText("Đang giữ");
    await expect(page.getByText("Google", { exact: true }).filter({ visible: true })).toBeVisible();
    await expect(page.getByText("Chủ cửa hàng")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("a customer is made an admin after asking, and revoked again", async ({ page }) => {
    await page.goto("/vi/admin/accounts/ac-phong");

    await (
      await hydrated(page.getByRole("button", { name: "Cấp quyền quản trị Tuấn Phong" }))
    ).click();
    const ask = page.getByRole("alertdialog", { name: "Cấp quyền quản trị cho Tuấn Phong?" });
    await expectNoSeriousA11yViolations(page);
    await ask.getByRole("button", { name: "Cấp quyền" }).click();
    await expect(page.getByText("Đã cấp quyền quản trị cho phong@example.com")).toBeVisible();
    await expect(page.getByRole("button", { name: "Thu quyền Tuấn Phong" })).toBeVisible();

    await page.getByRole("button", { name: "Thu quyền Tuấn Phong" }).click();
    await page
      .getByRole("alertdialog", { name: "Thu quyền quản trị của Tuấn Phong?" })
      .getByRole("button", { name: "Thu quyền" })
      .click();
    await expect(page.getByText("Đã thu quyền quản trị của Tuấn Phong")).toBeVisible();
    await expect(page.getByRole("button", { name: "Cấp quyền quản trị Tuấn Phong" })).toBeVisible();
  });

  test("a row's menu names its actions, opens the account and makes a customer an admin", async ({
    page,
  }) => {
    await page.goto("/vi/admin/accounts");
    const table = page.getByRole("table", { name: "Tài khoản" });
    const menu = await hydrated(table.getByRole("button", { name: "Thao tác cho Đức Khang" }));

    await menu.hover();
    await expect(page.getByRole("tooltip", { name: "Thao tác" })).toBeVisible();
    await menu.click();
    await expect(page.getByRole("menuitem", { name: "Xem chi tiết" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await page.getByRole("menuitem", { name: "Cấp quyền quản trị…" }).click();
    await page
      .getByRole("alertdialog", { name: "Cấp quyền quản trị cho Đức Khang?" })
      .getByRole("button", { name: "Cấp quyền" })
      .click();
    await expect(page.getByText("Đã cấp quyền quản trị cho khang@example.com")).toBeVisible();
    await expect(table.getByRole("row", { name: /Đức Khang/ })).toContainText("Quản trị");

    await table.getByRole("button", { name: "Thao tác cho Quốc Bảo" }).click();
    await page.getByRole("menuitem", { name: "Xem chi tiết" }).click();
    await expect(page).toHaveURL(/\/vi\/admin\/accounts\/ac-bao$/);
  });

  test("an admin's own account cannot be revoked from its page", async ({ page }) => {
    await page.goto("/vi/admin/accounts?role=admin");
    const table = page.getByRole("table", { name: "Tài khoản" });
    await (await hydrated(table.getByRole("link", { name: /^admin\.accounts\./ }))).click();

    await expect(page.getByText("Không tự thu quyền của mình")).toBeVisible();
    await expect(page.getByRole("button", { name: /Thu quyền/ })).toHaveCount(0);
  });

  test("an account that never ordered says so, and an unknown one is not found", async ({
    page,
  }) => {
    await page.goto("/vi/admin/accounts/ac-linh");
    await expect(page.getByRole("heading", { level: 1, name: "linh@example.com" })).toBeVisible();
    await expect(page.getByText("Tài khoản này chưa đặt đơn nào.")).toBeVisible();
    await expect(page.getByText("Chưa là chủ hay nhân viên của cửa hàng nào.")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.goto("/vi/admin/accounts/00000000-0000-4000-8000-000000000000");
    await expect(page.getByRole("heading", { name: "Không tìm thấy trang này" })).toBeVisible();
  });
});
