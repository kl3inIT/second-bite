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

  test("from the account tab, with the emailed code, then signed out", async ({
    page,
    isMobile,
  }, testInfo) => {
    test.skip(!isMobile, "The account tab is a phone's screen; the flow is the same on a desktop.");
    const email = `xoa.${testInfo.project.name}@example.com`;
    await signIn(page, email);

    await page.goto("/vi/account");
    await (await hydrated(page.getByRole("link", { name: "Xoá tài khoản" }))).click();
    await expect(page).toHaveURL(/\/vi\/delete-account$/);
    await expect(page.getByText(`Chúng tôi sẽ gửi mã 6 số đến ${email}`)).toBeVisible();
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
    await expect(page.getByRole("heading", { name: "Đã xoá tài khoản" })).toBeVisible();

    await page.goto("/vi/account");
    await expect(page.getByRole("heading", { name: "Bạn chưa đăng nhập" })).toBeVisible();
  });

  test("from the account menu on a desktop", async ({ page, isMobile }, testInfo) => {
    test.skip(isMobile, "A phone reaches it from the account tab.");
    const email = `menu.${testInfo.project.name}@example.com`;
    await signIn(page, email);

    await page.goto("/vi");
    await (await hydrated(page.getByRole("button", { name: `Tài khoản ${email}` }))).click();
    await expect(page.getByRole("menuitem", { name: "Đăng xuất" })).toBeVisible();
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });
    await page.getByRole("menuitem", { name: "Xoá tài khoản" }).click();

    await expect(page).toHaveURL(/\/vi\/delete-account$/);
    await expect(page.getByText(`Chúng tôi sẽ gửi mã 6 số đến ${email}`)).toBeVisible();
  });

  test("warns the owner of a seller that it closes", async ({ page }, testInfo) => {
    await signIn(page, `owner.${testInfo.project.name}@example.com`);

    await page.goto("/vi/delete-account");
    await expect(page.getByText("Bạn đang là chủ quán")).toBeVisible();
    await expect(page.getByText(/Xoá tài khoản sẽ đóng Bánh mì Tasco/)).toBeVisible();
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });
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
