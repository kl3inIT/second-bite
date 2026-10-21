import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

// SEC-76 › Figma L5, L6. The stub backend takes 123456 as the right code, and a new account has no name.
test.describe("ordering from the cart", () => {
  test("signs in over the cart, gives a name the first time, and keeps the cart", async ({
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
    await expect(name).toBeHidden();
    await expect(page.getByText("Đặt món trên web sắp có.", { exact: false })).toBeVisible();

    // Named now, "Đặt món" asks nothing more.
    await page.reload();
    await (await hydrated(page.getByRole("button", { name: "Đặt món" }))).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByText("Đặt món trên web sắp có.", { exact: false })).toBeVisible();
  });
});
