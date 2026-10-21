import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

// Signs in through the stub's API, as the web does; an address that starts with "admin" is an admin's.
async function signIn(page: Page, email: string) {
  const response = await page.request.post("/api/auth/sessions", {
    data: { challengeId: `ch-${encodeURIComponent(email)}`, code: "123456", session: "cookie" },
  });
  expect(response.status()).toBe(201);
}

// SEC-75 › Guard and Shell.
test.describe("the admin's frame", () => {
  test("someone signed out is sent to sign in and back, with a real redirect", async ({ page }) => {
    const response = await page.request.get("/vi/admin/settings?tab=email", { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toBe(
      "/vi/sign-in?returnTo=%2Fadmin%2Fsettings%3Ftab%3Demail",
    );
  });

  test("a customer sees the site's not-found page and no admin menu", async ({
    page,
  }, testInfo) => {
    await signIn(page, `khach.${testInfo.project.name}@example.com`);
    await page.goto("/vi/admin/settings");

    await expect(page.getByRole("heading", { name: "Không tìm thấy trang này" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Cài đặt" })).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  });

  test("an admin gets the sidebar, and an unknown page inside it", async ({
    page,
    isMobile,
  }, testInfo) => {
    await signIn(page, `admin.${testInfo.project.name}@example.com`);
    await page.goto("/vi/admin/nothing-here");

    await expect(page.getByRole("heading", { name: "Không tìm thấy trang này" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Vị trí trang" })).toContainText(
      "Không tìm thấy",
    );
    await expect(page.getByRole("contentinfo")).toBeHidden();
    await expect(page.getByRole("navigation", { name: "Điều hướng chính" })).toHaveCount(0);

    if (isMobile) {
      await (await hydrated(page.getByRole("button", { name: "Menu quản trị" }))).click();
    }
    const menu = isMobile
      ? page.getByRole("dialog", { name: "Menu quản trị" })
      : page.locator('[data-slot="sidebar"]');
    await expect(menu.getByRole("link", { name: "Tài khoản" })).toBeVisible();
    await expect(menu.getByRole("link", { name: "Cài đặt" })).toBeVisible();
    await expect(menu.getByText(`admin.${testInfo.project.name}@example.com`)).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("the sidebar stays collapsed after a reload", async ({ page, isMobile }, testInfo) => {
    test.skip(isMobile, "On a phone the sidebar is a sheet, closed until asked for.");
    await signIn(page, `admin.fold.${testInfo.project.name}@example.com`);
    await page.goto("/vi/admin/nothing-here");

    await (await hydrated(page.getByRole("button", { name: "Thu gọn thanh bên" }))).click();
    await expect(page.getByRole("button", { name: "Mở rộng thanh bên" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Tài khoản" }).getByText("Tài khoản")).toBeHidden();
    await expectNoSeriousA11yViolations(page);

    await page.reload();
    await expect(page.getByRole("button", { name: "Mở rộng thanh bên" })).toBeVisible();
  });
});
