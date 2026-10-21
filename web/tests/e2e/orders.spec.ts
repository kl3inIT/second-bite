import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";

test.use({ locale: "vi-VN" });

// "Đơn của tôi" (SEC-51, Figma D1, D4), against the stub backend's orders; ordering itself is in order.spec.ts.
test.describe("my orders", () => {
  test("ask someone signed out with no order in this browser to sign in", async ({ page }) => {
    await page.goto("/vi/orders");
    await expect(page.getByRole("heading", { name: "Đơn của tôi", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Chưa thấy đơn nào" })).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: "Đăng nhập", exact: true }),
    ).toHaveAttribute("href", "/vi/sign-in?returnTo=%2Forders");
    await expectNoSeriousA11yViolations(page);
  });
});
