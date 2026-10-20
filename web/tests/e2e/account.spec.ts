import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

test.describe("the bottom bar and the account tab", () => {
  test("on a phone, the bar leads to the account tab, which signs in and out", async ({
    page,
    isMobile,
  }, testInfo) => {
    test.skip(
      !isMobile,
      "The bottom bar is for phones; a wide screen has the header and the footer.",
    );
    const email = `chi.${testInfo.project.name}@example.com`;
    await page.goto("/vi");

    const bar = page.getByRole("navigation", { name: "Điều hướng chính" });
    await expect(bar.getByRole("link", { name: "Trang chủ" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(bar.getByText("Đơn của tôi")).toBeVisible();
    await expect(bar.getByRole("link", { name: /Đơn của tôi/ })).toHaveCount(0);
    await expect(page.getByRole("contentinfo")).toBeHidden();

    await (await hydrated(bar.getByRole("link", { name: "Tài khoản" }))).click();
    await expect(page).toHaveURL(/\/vi\/account$/);
    await expect(page.getByRole("heading", { name: "Bạn chưa đăng nhập" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Điều khoản sử dụng" })).toHaveAttribute(
      "href",
      "/vi/terms",
    );
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("link", { name: "Đăng nhập", exact: true }).click();
    await (await hydrated(page.getByLabel("Email"))).fill(email);
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await page.getByLabel("Mã đăng nhập 6 số").fill("123456");

    await expect(page).toHaveURL(/\/vi\/account$/);
    await expect(page.getByRole("heading", { name: email })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await (await hydrated(page.getByRole("button", { name: "Đăng xuất" }))).click();
    await expect(page.getByRole("heading", { name: "Bạn chưa đăng nhập" })).toBeVisible();
  });

  test("the account tab carries the header and is kept out of search engines", async ({ page }) => {
    await page.goto("/vi/account");

    await expect(
      page.getByRole("banner").getByRole("link", { name: /về trang chủ/ }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Tài khoản" })).toBeAttached();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expectNoSeriousA11yViolations(page);
  });

  test("on a wide screen, the footer keeps the terms and there is no bottom bar", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "A phone has the bottom bar instead.");
    await page.goto("/vi");
    await expect(page.getByRole("navigation", { name: "Điều hướng chính" })).toBeHidden();
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: "Điều khoản sử dụng" }),
    ).toBeVisible();
  });
});
