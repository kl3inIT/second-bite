import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

/** Signs in through the API, as the sign-in screen does; the cookie lands in the browser's jar. */
async function signIn(page: Page, email: string) {
  const response = await page.request.post("/api/auth/sessions", {
    data: { challengeId: `ch-${encodeURIComponent(email)}`, code: "123456", session: "cookie" },
  });
  expect(response.status()).toBe(201);
}

// SEC-61 › Verification: the display name is changed from account settings, in the server's words when refused.
test.describe("naming the account on the web", () => {
  test("changes the display name, after the server refuses an empty one", async ({
    page,
  }, testInfo) => {
    await signIn(page, `ten.${testInfo.project.name}@example.com`);
    await page.goto("/vi/account/settings");

    const row = page.getByRole("definition").filter({ hasText: "Chưa có" });
    await expect(row).toBeVisible();
    await (await hydrated(page.getByRole("button", { name: "Sửa tên hiển thị" }))).click();

    const field = page.getByRole("textbox", { name: "Tên hiển thị" });
    await expect(field).toBeFocused();
    await field.fill("   ");
    await page.getByRole("button", { name: "Lưu" }).click();
    await expect(page.getByText("Nhập tên hiển thị từ 1 đến 50 ký tự.")).toBeVisible();
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });

    await field.fill("  Trần Thị Lan ");
    await page.getByRole("button", { name: "Lưu" }).click();

    await expect(page.getByRole("heading", { level: 2, name: "Trần Thị Lan" })).toBeVisible();
    await expect(page.getByRole("definition").filter({ hasText: "Trần Thị Lan" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Tên hiển thị" })).toHaveCount(0);
  });

  test("keeps the name when editing is cancelled", async ({ page }, testInfo) => {
    await signIn(page, `huy.${testInfo.project.name}@example.com`);
    await page.goto("/vi/account/settings");

    await (await hydrated(page.getByRole("button", { name: "Sửa tên hiển thị" }))).click();
    await page.getByRole("textbox", { name: "Tên hiển thị" }).fill("Tên khác");
    await page.getByRole("button", { name: "Huỷ" }).click();

    await expect(page.getByRole("definition").filter({ hasText: "Chưa có" })).toBeVisible();
  });
});

// SEC-208 › Verification plan › Web: an account made with a username changes its password from account settings with
// the old one as the only proof; an account that signs in by email has no password and is not offered the form.
test.describe("changing the password on the web", () => {
  test("refuses a wrong current password, then changes it", async ({ page }) => {
    const username = `doi.${Date.now().toString(36)}`;
    const made = await page.request.post("/api/auth/accounts", {
      data: { username, password: "a long password", session: "cookie" },
    });
    expect(made.status()).toBe(201);

    await page.goto("/vi/account/settings");
    await expect(page.getByRole("heading", { level: 2, name: "Đổi mật khẩu" })).toBeVisible();
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });

    const current = await hydrated(page.getByLabel("Mật khẩu hiện tại"));
    const next = page.getByLabel("Mật khẩu mới", { exact: true });
    const confirm = page.getByLabel("Nhập lại mật khẩu mới");
    const submit = page.getByRole("button", { name: "Đổi mật khẩu" });

    await current.fill("not the password");
    await next.fill("a better password");
    await confirm.fill("a better password");
    await submit.click();
    await expect(page.getByText("Mật khẩu chưa đúng.")).toBeVisible();
    await expect(current).toHaveValue("");

    // The two new passwords differ: refused before the server is asked, the current one kept as typed.
    await current.fill("a long password");
    await confirm.fill("another one");
    await submit.click();
    await expect(page.getByText("Mật khẩu nhập lại chưa khớp.")).toBeVisible();
    await expect(current).toHaveValue("a long password");

    await confirm.fill("a better password");
    await submit.click();
    await expect(page.getByRole("status")).toContainText("Đã đổi mật khẩu");
    await expect(current).toHaveValue("");

    const old = await page.request.post("/api/auth/password-sessions", {
      data: { username, password: "a long password", session: "cookie" },
    });
    expect(old.status()).toBe(400);
    const fresh = await page.request.post("/api/auth/password-sessions", {
      data: { username, password: "a better password", session: "cookie" },
    });
    expect(fresh.status()).toBe(201);
  });

  test("does not offer the form to an account that signs in by email", async ({
    page,
  }, testInfo) => {
    await signIn(page, `matkhau.${testInfo.project.name}@example.com`);
    await page.goto("/vi/account/settings");

    await expect(page.getByRole("heading", { level: 2, name: "Xoá tài khoản" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Đổi mật khẩu" })).toHaveCount(0);
  });
});
