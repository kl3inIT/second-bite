import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

test.describe("the search", () => {
  test("finds dishes by words without accents, naming their seller, then the sellers", async ({
    page,
  }) => {
    await page.goto("/vi/search?q=banh+bao");

    await expect(page.getByRole("searchbox", { name: "Tìm món hoặc quán" })).toHaveValue(
      "banh bao",
    );
    await expect(page.getByText("1 món cho “banh bao”")).toBeVisible();
    const dish = page.getByRole("article").filter({ hasText: "Bánh bao xá xíu" });
    await expect(dish.getByText("Panda Chef")).toBeVisible();
    await expect(dish.getByText("Còn 5 phần")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByRole("link", { name: "Quán (1)" }))).click();
    await expect(page).toHaveURL(/\/vi\/search\?q=banh\+bao&tab=sellers$/);
    await expect(page.getByRole("region", { name: "Panda Chef" })).toBeVisible();
    await expect(page.getByText("Nhận 21:15–21:45")).toBeVisible();
  });

  test("groups every dish by seller without words, and narrows them by price", async ({ page }) => {
    await page.goto("/vi/search");

    await expect(page.getByRole("region", { name: "La Paris" })).toBeVisible();
    await expect(page.getByRole("region", { name: "KFC" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByRole("button", { name: "Giá" }))).click();
    await page.getByLabel("Từ").fill("20000");
    await page.getByLabel("Đến").fill("30000");
    await page.getByRole("button", { name: "Áp dụng" }).click();

    await expect(page).toHaveURL(/\/vi\/search\?minPrice=20000&maxPrice=30000$/);
    await expect(page.getByRole("button", { name: "Giá: 20.000đ–30.000đ" })).toBeVisible();
    await expect(page.getByRole("region", { name: "KFC" })).toBeHidden();
    await expect(page.getByRole("region", { name: "La Paris" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Highlands Coffee" })).toBeHidden();
  });

  test("remembers recent searches in this browser until they are removed", async ({ page }) => {
    await page.goto("/vi/search?q=banh+bao");
    const field = await hydrated(page.getByRole("searchbox", { name: "Tìm món hoặc quán" }));
    await page.getByRole("button", { name: "Xoá chữ đã gõ" }).click();
    await expect(field).toBeFocused();

    const recent = page.getByRole("region", { name: "Tìm gần đây" });
    await expect(recent.getByRole("link", { name: "banh bao" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Bánh", exact: true })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await recent.getByRole("button", { name: "Xoá “banh bao” khỏi tìm gần đây" }).click();
    await expect(recent).toBeHidden();
  });

  test("goes back to the home from its arrow", async ({ page }) => {
    await page.goto("/vi/search?q=banh+bao");
    await (await hydrated(page.getByRole("link", { name: "Về trang chủ", exact: true }))).click();
    await expect(page).toHaveURL(/\/vi$/);
  });
});
