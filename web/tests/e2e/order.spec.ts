import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

// SEC-76 › Figma L5, L6, O7. The stub backend takes 123456 as the right code, and a new account has no name.
test.describe("ordering from the cart", () => {
  test("signs in over the cart, gives a name the first time, and orders it", async ({
    page,
  }, testInfo) => {
    await page.goto("/vi/sellers/se-la-paris");
    await (
      await hydrated(
        page.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }),
      )
    ).click();
    await page.getByRole("link", { name: "Xem giỏ hàng" }).click();

    await expect(page).toHaveURL(/\/vi\/cart$/);
    await (await hydrated(page.getByRole("button", { name: "Đặt món" }))).click();
    const signIn = page.getByRole("dialog", { name: "Đăng nhập để đặt món" });
    await expect(
      signIn.getByText(
        "Đăng nhập xong, bạn quay lại đúng đơn này. Giỏ 1 phần của La Paris vẫn được giữ.",
      ),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await signIn.getByLabel("Email").fill(`order.${testInfo.project.name}@example.com`);
    await signIn.getByRole("button", { name: "Gửi mã" }).click();
    await signIn.getByLabel("Mã đăng nhập 6 số").fill("123456");

    const name = page.getByRole("dialog", { name: "Quán gọi bạn là gì?" });
    await expect(name).toBeVisible();
    await expect(page).toHaveURL(/\/vi\/cart$/);
    await expect(page.getByText("1× Bánh Croissant Truyền Thống")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await name.getByLabel("Tên hiển thị").fill("Minh Anh");
    await name.getByRole("button", { name: "Tiếp tục đặt món" }).click();

    await expect(page).toHaveURL(/\/vi\/orders\/or-\d+$/);
    await expect(page.getByRole("heading", { name: "Đã xác nhận" })).toBeVisible();
    await expect(page.getByText("1× Bánh Croissant Truyền Thống")).toBeVisible();

    // The cart was ordered, so it is gone.
    await page.goto("/vi/cart");
    await expect(page.getByText("Giỏ hàng đang trống")).toBeVisible();
  });

  // Figma O7: someone else ordered first. The stub sells no more croissants than the three it has, so a cart
  // holding four (written before the last ones went) is refused.
  test("says which dish ran out and orders what is left", async ({ page }, testInfo) => {
    await page.goto("/vi/sign-in?returnTo=/cart");
    await (
      await hydrated(page.getByLabel("Email"))
    ).fill(`het.${testInfo.project.name}@example.com`);
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
    await expect(page).toHaveURL(/\/vi\/cart$/);

    await page.goto("/vi/sellers/se-la-paris");
    await (
      await hydrated(
        page.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }),
      )
    ).click();
    await page.evaluate(() => {
      const cart = JSON.parse(localStorage.getItem("secondbite.cart") ?? "null");
      cart.lines[0].quantity = 4;
      localStorage.setItem("secondbite.cart", JSON.stringify(cart));
    });
    await page.goto("/vi/cart");
    await (await hydrated(page.getByRole("button", { name: "Đặt món" }))).click();
    const name = page.getByRole("dialog", { name: "Quán gọi bạn là gì?" });
    await name.getByLabel("Tên hiển thị").fill("Hà");
    await name.getByRole("button", { name: "Tiếp tục đặt món" }).click();

    const gone = page.getByRole("dialog", { name: "Bánh Croissant Truyền Thống vừa hết" });
    await expect(
      gone.getByText("Người khác vừa đặt phần cuối. Bạn chưa bị tính tiền."),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await gone
      .getByRole("button", { name: "Đặt 3× Bánh Croissant Truyền Thống · 66.000đ" })
      .click();
    await expect(page).toHaveURL(/\/vi\/orders\/or-\d+$/);
    await expect(page.getByText("3× Bánh Croissant Truyền Thống")).toBeVisible();
  });
});
