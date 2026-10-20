import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

test.describe("a dish, its seller and the cart", () => {
  test("opens a dish from the search and its seller from the dish", async ({ page }) => {
    await page.goto("/vi/search?q=croissant");
    await (await hydrated(page.getByRole("link", { name: "Bánh Croissant Truyền Thống" }))).click();

    await expect(page).toHaveURL(/\/vi\/offers\/of-croissant$/);
    await expect(page.getByRole("heading", { level: 1, name: "Bánh Croissant Truyền Thống" })).toBeVisible();
    await expect(page.getByText("Nhận hôm nay 21:00 – 21:45")).toBeVisible();
    await expect(page.getByText("Giảm 56% · còn 3 phần")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Điều hướng chính" })).toBeHidden();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByRole("link", { name: "Xem quán" }))).click();
    await expect(page).toHaveURL(/\/vi\/sellers\/se-la-paris$/);
    await expect(page.getByRole("heading", { level: 1, name: "La Paris" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Đang giảm tối nay" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("fills a cart up to the portions left, asks before another seller's dish, and confirms it", async ({
    page,
  }) => {
    await page.goto("/vi/sellers/se-la-paris");
    const add = await hydrated(page.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }));
    await add.click();
    await add.click();
    await add.click();

    await expect(page.getByLabel("3 phần Bánh Croissant Truyền Thống trong giỏ")).toHaveText("3");
    await expect(add).toBeDisabled();
    await expect(page.getByText("-56% · đã chọn đủ 3 phần")).toBeVisible();
    await expect(page.getByText("3 phần · tiết kiệm 84.000đ")).toBeVisible();

    await page.goto("/vi/offers/of-ha-cao");
    await (await hydrated(page.getByRole("button", { name: "Thêm vào giỏ" }))).click();
    const sheet = page.getByRole("dialog", { name: "Bắt đầu giỏ mới?" });
    await expect(sheet.getByText("Giỏ của bạn đang có 3 phần của La Paris.", { exact: false })).toBeVisible();
    await sheet.getByRole("button", { name: "Giữ giỏ hiện tại" }).click();
    await expect(sheet).toBeHidden();

    await page.goto("/vi/cart");
    await expect(page.getByRole("heading", { level: 1, name: "Xác nhận đơn" })).toBeVisible();
    await expect(page.getByText("3× Bánh Croissant Truyền Thống")).toBeVisible();
    await expect(page.getByText("Tiền món (3 phần)")).toBeVisible();
    await expect(page.getByRole("radio", { name: "Chuyển khoản tại quầy" })).toBeChecked();
    await expectNoSeriousA11yViolations(page);
  });

  test("says when a seller has nothing tonight", async ({ page }) => {
    await page.goto("/vi/sellers/se-unknown");

    await expect(page.getByText("Quán chưa có món tối nay")).toBeVisible();
  });
});
