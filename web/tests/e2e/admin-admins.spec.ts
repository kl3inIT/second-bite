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

// SEC-75 › the admins, on the accounts page (SEC-106 folded Settings › Quản trị viên into it): an address
// granted from the page's head, a revoke from a row's menu after asking, never one's own.
test.describe("the admins", () => {
  test("an address is made an admin from the accounts, and one that is not is refused", async ({
    page,
  }, testInfo) => {
    await signInAsAdmin(page, `admins.grant.${testInfo.project.name}`);
    await page.goto("/vi/admin/accounts?role=admin");
    await expect(page.getByRole("tab", { name: /Quản trị\s*3/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );

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
    await expect(page.getByRole("tab", { name: /Quản trị\s*4/ })).toBeVisible();
    await expect(page.getByRole("table", { name: "Tài khoản" })).toContainText(
      "lan.moi@example.com",
    );
  });

  test("one's own revoke is in the menu, disabled, with its reason", async ({ page }, testInfo) => {
    const me = await signInAsAdmin(page, `admins.self.${testInfo.project.name}`);
    await page.goto("/vi/admin/accounts?role=admin");
    const mine = page
      .getByRole("table", { name: "Tài khoản" })
      .getByRole("row")
      .filter({ hasText: me });

    await (await hydrated(mine.getByRole("button", { name: `Thao tác cho ${me}` }))).click();
    const revoke = page.getByRole("menuitem", { name: /Thu quyền quản trị/ });
    await expect(revoke).toHaveAttribute("aria-disabled", "true");
    await expect(revoke).toContainText("Không tự thu quyền của mình");
    await expectNoSeriousA11yViolations(page);
  });

  test("another admin is revoked from their row after asking", async ({ page }, testInfo) => {
    await signInAsAdmin(page, `admins.revoke.${testInfo.project.name}`);
    await page.goto("/vi/admin/accounts?role=admin");
    const table = page.getByRole("table", { name: "Tài khoản" });

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
    await expect(page.getByRole("tab", { name: /Quản trị\s*2/ })).toBeVisible();
    await expect(table).not.toContainText("thu.admin@example.com");
  });
});
