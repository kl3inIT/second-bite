import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

test.describe("a dish, its seller and the cart", () => {
  test("opens a dish on its seller's page from the search, and its sheet", async ({ page }) => {
    await page.goto("/vi/search?q=croissant");
    await (await hydrated(page.getByRole("link", { name: "Bánh Croissant Truyền Thống" }))).click();

    // Figma K4: the seller's page, scrolled to the dish's tinted row.
    await expect(page).toHaveURL(/\/vi\/sellers\/se-la-paris\?at=of-croissant#dish-of-croissant$/);
    await expect(page.getByRole("heading", { level: 1, name: "La Paris" })).toBeVisible();
    await expect(page.locator("#dish-of-croissant")).toBeInViewport();
    await expect(page.getByRole("navigation", { name: "Điều hướng chính" })).toBeHidden();
    await expectNoSeriousA11yViolations(page);

    // Figma K4a: the dish's sheet adds two portions at once.
    await (
      await hydrated(page.getByRole("button", { name: "Bánh Croissant Truyền Thống", exact: true }))
    ).click();
    const sheet = page.getByRole("dialog", { name: "Bánh Croissant Truyền Thống" });
    await expect(
      sheet.getByText(/^Croissant bơ Pháp nướng sáng nay.* Khoảng 80 g\.$/),
    ).toBeVisible();
    await expect(sheet.getByText("Hỏi quán về thành phần và dị ứng.")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await sheet.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }).click();
    await sheet.getByRole("button", { name: "Thêm vào giỏ · 44.000đ" }).click();
    await expect(sheet).toBeHidden();
    await expect(page.getByLabel("2 phần Bánh Croissant Truyền Thống trong giỏ")).toHaveText("2");

    await page.getByRole("searchbox", { name: "Tìm trong thực đơn La Paris" }).fill("eclair");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/q=eclair/);
    await expect(
      page.getByRole("button", { name: "Bánh Croissant Truyền Thống", exact: true }),
    ).toBeHidden();

    // A dish's old address leads to the same place.
    await page.goto("/vi/offers/of-croissant");
    await expect(page).toHaveURL(/\/vi\/sellers\/se-la-paris\?at=of-croissant#dish-of-croissant$/);
  });

  test("fills a cart from two sellers up to the portions left, and changes it on the confirmation", async ({
    page,
  }) => {
    await page.goto("/vi/sellers/se-la-paris");
    const add = await hydrated(
      page.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }),
    );
    await add.click();
    await add.click();
    await add.click();

    await expect(page.getByLabel("3 phần Bánh Croissant Truyền Thống trong giỏ")).toHaveText("3");
    await expect(add).toBeDisabled();
    await expect(page.getByText("đã chọn đủ 3 phần")).toBeVisible();
    await expect(page.getByText("3 phần · tiết kiệm 84.000đ")).toBeVisible();

    // Another seller's dish joins the same cart, in its own basket.
    await page.goto("/vi/sellers/se-panda-chef");
    await (await hydrated(page.getByRole("button", { name: "Thêm một phần Há cảo tôm" }))).click();
    await page.getByRole("link", { name: "Xem giỏ hàng" }).click();

    await expect(page.getByRole("heading", { level: 1, name: "Xác nhận đơn" })).toBeVisible();
    await expect(page.getByLabel("3 phần Bánh Croissant Truyền Thống trong giỏ")).toHaveText("3");
    await expect(
      page.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }),
    ).toBeDisabled();
    await expect(page.getByText("Tiền món (4 phần)")).toBeVisible();
    // Figma K5: one card per seller's order, and one order button for both.
    await expect(page.getByRole("heading", { level: 2, name: "La Paris" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Panda Chef" })).toBeVisible();
    await expect(page.getByText("Thanh toán tại quầy", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tổng cộng · 2 đơn" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Đặt 2 đơn" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    // Figma K5: at one portion, − takes the dish out at once.
    await page.getByRole("button", { name: "Bớt một phần Há cảo tôm" }).click();
    await expect(page.getByText("Há cảo tôm", { exact: true })).toBeHidden();
    await expect(page.getByText("Tiền món (3 phần)")).toBeVisible();
    await expect(page.getByRole("button", { name: "Đặt món" })).toBeVisible();
  });

  test("books from the card beside the dish on a wide screen", async ({ page, isMobile }) => {
    test.skip(isMobile, "A phone has the bar at the foot instead (Figma K4).");
    await page.goto("/vi/offers/of-croissant");
    await expect(
      page.getByRole("navigation", { name: "Bạn đang ở đây" }).getByText("La Paris"),
    ).toBeVisible();
    const card = page.getByRole("complementary", { name: "Đặt món" });
    await expect(card.getByText("Số phần · còn 3")).toBeVisible();
    await expect(card.getByText("Huỷ miễn phí trước 21:00.")).toBeVisible();
    await expect(card.getByRole("link", { name: "Chỉ đường" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (
      await hydrated(
        card.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }),
      )
    ).click();
    await card.getByRole("button", { name: "Thêm 2 phần vào giỏ · 44.000đ" }).click();
    await card.getByRole("link", { name: "Xem giỏ hàng · 2 phần" }).click();
    await expect(page.getByText("2× Bánh Croissant Truyền Thống")).toBeVisible();
  });

  test("says when a seller has nothing tonight", async ({ page }) => {
    await page.goto("/vi/sellers/se-unknown");

    await expect(page.getByRole("main").getByText("Quán chưa có món tối nay")).toBeVisible();
  });
});
