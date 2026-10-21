import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

/** Signs in as an admin of its own, so the grants and revokes of each test stay its own in the stub. */
async function signInAsAdmin(page: Page, name: string) {
  const email = `admin.${name}@example.com`;
  const response = await page.request.post("/api/auth/sessions", {
    data: { challengeId: `ch-${encodeURIComponent(email)}`, code: "123456", session: "cookie" },
  });
  expect(response.status()).toBe(201);
  return email;
}

// SEC-75 › Settings › Quản trị viên: who administers, granting by address, revoking after asking.
test.describe("the admins", () => {
  test("lists the admins, the caller marked and never revocable", async ({ page }, testInfo) => {
    const me = await signInAsAdmin(page, `admins.list.${testInfo.project.name}`);
    await page.goto("/vi/admin/settings/admins");

    await expect(
      page
        .getByRole("navigation", { name: "Mục cài đặt" })
        .getByRole("link", { name: "Quản trị viên" }),
    ).toHaveAttribute("aria-current", "page");
    const table = page.getByRole("table", { name: "Quản trị viên" });
    await expect(table.getByRole("row")).toHaveCount(4);
    const mine = table.getByRole("row").filter({ hasText: me });
    await expect(mine).toContainText("Bạn");

    // The caller's own revoke stays in the row's menu, disabled, with its reason.
    await (await hydrated(mine.getByRole("button", { name: `Thao tác cho ${me}` }))).click();
    const revoke = page.getByRole("menuitem", { name: /Thu quyền quản trị/ });
    await expect(revoke).toHaveAttribute("aria-disabled", "true");
    await expect(revoke).toContainText("Không tự thu quyền của mình");
    await expectNoSeriousA11yViolations(page);
  });

  test("grants an address, and refuses one that is not", async ({ page }, testInfo) => {
    await signInAsAdmin(page, `admins.grant.${testInfo.project.name}`);
    await page.goto("/vi/admin/settings/admins");

    await (await hydrated(page.getByRole("button", { name: "Thêm quản trị viên" }))).click();
    const dialog = page.getByRole("dialog", { name: "Thêm quản trị viên" });
    await dialog.getByRole("button", { name: "Cấp quyền" }).click();
    await expect(dialog.getByText("Nhập một địa chỉ email hợp lệ.")).toBeVisible();
    await expect(dialog.getByLabel("Email")).toBeFocused();
    await expectNoSeriousA11yViolations(page);

    await dialog.getByLabel("Email").fill("lan.moi@example.com");
    await dialog.getByRole("button", { name: "Cấp quyền" }).click();
    await expect(page.getByText("Đã cấp quyền quản trị cho lan.moi@example.com")).toBeVisible();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("table", { name: "Quản trị viên" }).getByRole("row")).toHaveCount(
      5,
    );
  });

  test("revokes another admin after asking", async ({ page }, testInfo) => {
    await signInAsAdmin(page, `admins.revoke.${testInfo.project.name}`);
    await page.goto("/vi/admin/settings/admins");
    const table = page.getByRole("table", { name: "Quản trị viên" });

    await (
      await hydrated(table.getByRole("button", { name: "Thao tác cho thu.admin@example.com" }))
    ).click();
    await page.getByRole("menuitem", { name: "Thu quyền quản trị…" }).click();
    const ask = page.getByRole("alertdialog", {
      name: "Thu quyền quản trị của thu.admin@example.com?",
    });
    await expect(ask).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await ask.getByRole("button", { name: "Thu quyền" }).click();

    await expect(page.getByText("Đã thu quyền quản trị của thu.admin@example.com")).toBeVisible();
    await expect(table.getByRole("row")).toHaveCount(3);
    await expect(table).not.toContainText("thu.admin@example.com");
  });
});
