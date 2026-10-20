import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

test.describe("the search", () => {
  test("finds dishes by words without accents, naming their seller, then the sellers", async ({
    page,
  }) => {
    await page.goto("/vi/search?q=xoi");

    await expect(page.getByRole("searchbox", { name: "Tìm món hoặc quán" })).toHaveValue("xoi");
    await expect(page.getByText("1 món cho “xoi”")).toBeVisible();
    const dish = page.getByRole("article").filter({ hasText: "Xôi thập cẩm, 1 hộp" });
    await expect(dish.getByText("Quầy deli siêu thị")).toBeVisible();
    await expect(dish.getByText("Còn 5 phần")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByRole("link", { name: "Quán (1)" }))).click();
    await expect(page).toHaveURL(/\/vi\/search\?q=xoi&tab=sellers$/);
    await expect(page.getByRole("region", { name: "Quầy deli siêu thị" })).toBeVisible();
    await expect(page.getByText("Nhận 21:15–21:45")).toBeVisible();
  });

  test("groups every dish by seller without words, and narrows them by price", async ({ page }) => {
    await page.goto("/vi/search");

    await expect(page.getByRole("region", { name: "Tiệm bánh Pháp" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Quầy deli siêu thị" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByRole("button", { name: "Giá" }))).click();
    await page.getByRole("menuitem", { name: "Dưới 30.000đ" }).click();

    await expect(page).toHaveURL(/\/vi\/search\?maxPrice=30000$/);
    await expect(page.getByRole("button", { name: "Giá: Dưới 30.000đ" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Tiệm bánh Pháp" })).toBeHidden();
    await expect(page.getByRole("region", { name: "Quầy deli siêu thị" })).toBeVisible();
  });

  test("remembers recent searches in this browser until they are removed", async ({ page }) => {
    await page.goto("/vi/search?q=xoi");
    const field = await hydrated(page.getByRole("searchbox", { name: "Tìm món hoặc quán" }));
    await page.getByRole("button", { name: "Xoá chữ đã gõ" }).click();
    await expect(field).toBeFocused();

    const recent = page.getByRole("region", { name: "Tìm gần đây" });
    await expect(recent.getByRole("link", { name: "xoi" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Bánh", exact: true })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await recent.getByRole("button", { name: "Xoá “xoi” khỏi tìm gần đây" }).click();
    await expect(recent).toBeHidden();
  });

  test("goes back to the home from its arrow", async ({ page }) => {
    await page.goto("/vi/search?q=xoi");
    await (await hydrated(page.getByRole("link", { name: "Về trang chủ", exact: true }))).click();
    await expect(page).toHaveURL(/\/vi$/);
  });
});
