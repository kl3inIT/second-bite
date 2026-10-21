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

// SEC-37 › Verification plan › Web. The stub backend takes 123456 as the right deletion code.
test.describe("deleting an account on the web", () => {
  test("anyone reads what is deleted and is asked to sign in first", async ({ page }) => {
    await page.goto("/vi/delete-account");

    await expect(page.getByRole("heading", { level: 1, name: "Xoá tài khoản" })).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Bị xoá ngay khi bạn xác nhận" }),
    ).toBeVisible();
    await expect(page.getByText("Được giữ lại, không còn gắn với bạn")).toBeVisible();
    await expect(page.getByRole("link", { name: "Đăng nhập", exact: true }).last()).toHaveAttribute(
      "href",
      "/vi/sign-in?returnTo=%2Fdelete-account",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/vi\/delete-account$/,
    );
    await expectNoSeriousA11yViolations(page);
  });

  test("from the account tab through account settings, with the emailed code, then signed out", async ({
    page,
    isMobile,
  }, testInfo) => {
    test.skip(!isMobile, "The account tab is a phone's screen; the flow is the same on a desktop.");
    const email = `xoa.${testInfo.project.name}@example.com`;
    await signIn(page, email);

    await page.goto("/vi/account");
    // Deletion is not offered beside sign-out, only at the foot of account settings.
    await expect(page.getByRole("link", { name: "Xoá tài khoản" })).toHaveCount(0);
    await (await hydrated(page.getByRole("link", { name: "Cài đặt tài khoản" }))).click();
    await expect(page).toHaveURL(/\/vi\/account\/settings$/);
    await (await hydrated(page.getByRole("link", { name: "Xoá tài khoản" }))).click();
    await expect(page).toHaveURL(/\/vi\/delete-account$/);
    await expect(page.getByText(`Chúng tôi sẽ gửi mã 6 số đến ${email}`)).toBeVisible();
    await expect(
      page.getByText("Khi bạn nhập đúng mã, tài khoản bị xoá ngay và không thể hoàn tác."),
    ).toBeVisible();
    await expect(page.getByText("Bạn đang là chủ quán")).toHaveCount(0);
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });

    await (await hydrated(page.getByRole("button", { name: "Gửi mã xác nhận" }))).click();
    await expect(page.getByRole("heading", { name: "Nhập mã xác nhận" })).toBeVisible();
    const confirm = page.getByRole("button", { name: "Xoá vĩnh viễn tài khoản" });
    await expect(confirm).toBeDisabled();

    await page.getByLabel("Mã xác nhận 6 số").fill("111111");
    await confirm.click();
    await expect(
      page.getByText("Mã chưa đúng. Xem lại email mới nhất rồi nhập lại."),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });

    await page.getByLabel("Mã xác nhận 6 số").fill("123456");
    await confirm.click();
    // The confirmation is the page read again without the session (SEC-69): it is still there once the
    // server has answered, not replaced by the way to sign in.
    await expect(page).toHaveURL(/\/vi\/delete-account\?done=1$/);
    await expect(page.getByRole("heading", { name: "Đã xoá tài khoản" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Đăng nhập để xoá tài khoản" })).toHaveCount(0);
    // Figma Q5: only the confirmation, without what the deletion takes.
    await expect(page.getByText("Được giữ lại, không còn gắn với bạn")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Đã xoá tài khoản" })).toBeFocused();
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });
    await page.reload();
    await expect(page.getByRole("heading", { name: "Đã xoá tài khoản" })).toBeVisible();

    await page.goto("/vi/account");
    await expect(page.getByRole("heading", { name: "Bạn chưa đăng nhập" })).toBeVisible();
  });

  test("from the account menu on a desktop, through account settings", async ({
    page,
    isMobile,
  }, testInfo) => {
    test.skip(isMobile, "A phone reaches it from the account tab.");
    const email = `menu.${testInfo.project.name}@example.com`;
    await signIn(page, email);

    await page.goto("/vi");
    await (await hydrated(page.getByRole("button", { name: `Tài khoản ${email}` }))).click();
    await expect(page.getByRole("menuitem", { name: "Đăng xuất" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Xoá tài khoản" })).toHaveCount(0);
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });
    await page.getByRole("menuitem", { name: "Cài đặt tài khoản" }).click();

    await expect(page).toHaveURL(/\/vi\/account\/settings$/);
    await expect(page.getByRole("heading", { level: 1, name: "Cài đặt tài khoản" })).toBeVisible();
    await expect(page.getByRole("definition").filter({ hasText: email })).toBeVisible();
    await expect(page.getByText("Chưa có")).toBeVisible();
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });
    await page.getByRole("link", { name: "Xoá tài khoản" }).click();

    await expect(page).toHaveURL(/\/vi\/delete-account$/);
    await expect(page.getByText(`Chúng tôi sẽ gửi mã 6 số đến ${email}`)).toBeVisible();
  });

  test("account settings names the shops of an owner, and is not for someone signed out", async ({
    page,
  }, testInfo) => {
    await page.goto("/vi/account/settings");
    await expect(page).toHaveURL(/\/vi\/sign-in\?returnTo=%2Faccount%2Fsettings$/);

    await signIn(page, `owner.settings.${testInfo.project.name}@example.com`);
    await page.goto("/vi/account/settings");
    await expect(page.getByText("Bánh mì Tasco · Chủ quán")).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("warns the owner of a seller that it closes", async ({ page }, testInfo) => {
    await signIn(page, `owner.${testInfo.project.name}@example.com`);

    await page.goto("/vi/delete-account");
    await expect(page.getByText("Bạn đang là chủ quán")).toBeVisible();
    await expect(page.getByText(/Xoá tài khoản sẽ đóng Bánh mì Tasco/)).toBeVisible();
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });
  });

  test("the first step goes back to account settings without sending a code", async ({
    page,
  }, testInfo) => {
    await signIn(page, `back.${testInfo.project.name}@example.com`);

    await page.goto("/vi/delete-account");
    await (await hydrated(page.getByRole("link", { name: "Giữ tài khoản" }))).click();
    await expect(page).toHaveURL(/\/vi\/account\/settings$/);
  });

  test("a session that ends before the sellers are read shows the deletion, not an error", async ({
    page,
  }, testInfo) => {
    await signIn(page, `ending.${testInfo.project.name}@example.com`);

    await page.goto("/vi/delete-account");
    await expect(page.getByRole("button", { name: "Gửi mã xác nhận" })).toBeVisible();
    await page.goto("/vi/account/settings");
    await expect(page.getByRole("heading", { level: 1, name: "Cài đặt tài khoản" })).toBeVisible();
  });

  test("someone signed in at ?done=1 still gets the deletion", async ({ page }, testInfo) => {
    await signIn(page, `done.${testInfo.project.name}@example.com`);

    await page.goto("/vi/delete-account?done=1");
    await expect(page.getByRole("button", { name: "Gửi mã xác nhận" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Đã xoá tài khoản" })).toHaveCount(0);
  });

  test("is in English under /en", async ({ page }) => {
    await page.goto("/en/delete-account");

    await expect(
      page.getByRole("heading", { level: 1, name: "Delete your account" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Sign in to delete your account" }),
    ).toBeVisible();
  });
});
