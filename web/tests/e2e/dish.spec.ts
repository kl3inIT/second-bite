import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

test.describe("a dish, its seller and the cart", () => {
  test("opens a dish from the search and its seller from the dish", async ({ page }) => {
    await page.goto("/vi/search?q=croissant");
    await (await hydrated(page.getByRole("link", { name: "Bánh Croissant Truyền Thống" }))).click();

    await expect(page).toHaveURL(/\/vi\/offers\/of-croissant$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Bánh Croissant Truyền Thống" }),
    ).toBeVisible();
    // A phone has the bar at the foot, a wide screen the booking card beside the dish (Figma WK4); the page
    // holds both, one of them hidden.
    await expect(page.getByText("Nhận hôm nay 21:00 – 21:45").first()).toBeVisible();
    await expect(page.getByText("Giảm 56% · còn 3 phần").filter({ visible: true })).toBeVisible();
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
    const add = await hydrated(
      page.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }),
    );
    await add.click();
    await add.click();
    await add.click();

    await expect(page.getByLabel("3 phần Bánh Croissant Truyền Thống trong giỏ")).toHaveText("3");
    await expect(add).toBeDisabled();
    await expect(page.getByText("-56% · đã chọn đủ 3 phần")).toBeVisible();
    await expect(page.getByText("3 phần · tiết kiệm 84.000đ")).toBeVisible();

    await page.goto("/vi/offers/of-ha-cao");
    // Another seller's dish joins the same cart, in its own basket.
    await (
      await hydrated(
        page.getByRole("button", { name: /^Thêm (1 phần )?vào giỏ/ }).filter({ visible: true }),
      )
    ).click();
    await page
      .getByRole("link", { name: "Xem giỏ hàng · 4 phần" })
      .filter({ visible: true })
      .click();

    await expect(page.getByRole("heading", { level: 1, name: "Xác nhận đơn" })).toBeVisible();
    await expect(page.getByText("3× Bánh Croissant Truyền Thống")).toBeVisible();
    await expect(page.getByText("1× Há cảo tôm")).toBeVisible();
    await expect(page.getByText("Tiền món (4 phần)")).toBeVisible();
    await expect(page.getByRole("radio", { name: "Thanh toán tại quầy" })).toBeChecked();
    await expectNoSeriousA11yViolations(page);
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
