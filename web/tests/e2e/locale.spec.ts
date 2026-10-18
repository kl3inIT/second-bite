import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";

test.describe("on a Vietnamese device", () => {
  test.use({ locale: "vi-VN" });

  test("opens in Vietnamese", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/vi$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await expect(
      page.getByRole("heading", { level: 2, name: "Tối nay ở Tasco Mall" }),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("switches to English and keeps the choice", async ({ page }) => {
    await page.goto("/vi");
    await page.getByRole("link", { name: "Switch to English" }).click();

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("heading", { level: 2, name: "Tonight at Tasco Mall" }),
    ).toBeVisible();

    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });

  test("answers an unknown address with the Vietnamese not-found page", async ({ page }) => {
    const response = await page.goto("/vi/khong-co-trang-nay");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Không tìm thấy trang này" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("link", { name: "Về trang chủ" }).click();
    await expect(page).toHaveURL(/\/vi$/);
  });
});

test.describe("on an English device", () => {
  test.use({ locale: "en-GB" });

  test("opens in English", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expectNoSeriousA11yViolations(page);
  });
});
