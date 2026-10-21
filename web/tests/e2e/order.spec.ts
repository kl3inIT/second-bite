import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

const ORDER_URL = /\/vi\/orders\/[0-9a-f-]{36}$/;

async function addCroissant(page: Page) {
  await page.goto("/vi/sellers/se-la-paris");
  await (
    await hydrated(page.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }))
  ).click();
}

/** Gives who collects and confirms the number, as "Đặt món" asks (SEC-76 › decision 7). */
async function orderAs(page: Page, name: string, phone: string) {
  await (await hydrated(page.getByRole("button", { name: "Đặt món" }))).click();
  const sheet = page.getByRole("dialog", { name: "Người đến nhận" });
  await sheet.getByLabel("Tên").fill(name);
  await sheet.getByLabel("Số điện thoại").fill(phone);
  await sheet.getByRole("button", { name: "Tiếp tục" }).click();
  const check = page.getByRole("alertdialog", { name: "Số điện thoại này đúng chưa?" });
  await expect(check).toBeVisible();
  await check.getByRole("button", { name: "Đúng, đặt món" }).click();
}

// SEC-76 › Figma K5, O7, W2–W7: ordering needs no account, only a name and a phone number checked once.
test.describe("ordering from the cart", () => {
  test("orders with a name and a phone number, cancels, and finds the order among the ended ones", async ({
    page,
  }) => {
    await addCroissant(page);
    await page.getByRole("link", { name: "Xem giỏ hàng" }).click();
    await expect(page).toHaveURL(/\/vi\/cart$/);

    await expect(page.getByLabel("Tên")).toHaveCount(0);
    await (await hydrated(page.getByRole("button", { name: "Đặt món" }))).click();
    const sheet = page.getByRole("dialog", { name: "Người đến nhận" });
    await sheet.getByRole("button", { name: "Tiếp tục" }).click();
    await expect(sheet.getByText("Nhập tên từ 1 đến 50 ký tự.")).toBeVisible();
    await expect(sheet.getByText("Nhập số điện thoại 10 số, bắt đầu bằng 0.")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await sheet.getByLabel("Tên").fill("Minh Anh");
    await sheet.getByLabel("Số điện thoại").fill("0900 000 000");
    await sheet.getByRole("button", { name: "Tiếp tục" }).click();
    const check = page.getByRole("alertdialog", { name: "Số điện thoại này đúng chưa?" });
    await expect(check.getByText("0900 000 000")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await check.getByRole("button", { name: "Sửa" }).click();
    await expect(sheet.getByLabel("Số điện thoại")).toHaveValue("0900 000 000");
    await sheet.getByRole("button", { name: "Tiếp tục" }).click();
    await check.getByRole("button", { name: "Đúng, đặt món" }).click();

    await expect(page).toHaveURL(ORDER_URL);
    await expect(page.getByRole("heading", { name: "Đã xác nhận" })).toBeVisible();
    await expect(page.getByText("1× Bánh Croissant Truyền Thống")).toBeVisible();

    await (await hydrated(page.getByRole("button", { name: "Huỷ đơn" }))).click();
    const cancel = page.getByRole("alertdialog", { name: /Huỷ đơn SB-\d+\?/ });
    await cancel.getByRole("button", { name: "Không đến kịp" }).click();
    await cancel.getByRole("button", { name: "Huỷ đơn" }).click();
    await expect(page.getByRole("heading", { name: "Đã huỷ đơn" })).toBeVisible();

    await page.goto("/vi/orders?state=ended");
    await expect(page.getByRole("link", { name: /Bánh Croissant Truyền Thống/ })).toBeVisible();

    // The cart was ordered, so it is gone, and the contact is kept for the next order.
    await addCroissant(page);
    await page.goto("/vi/cart");
    await (await hydrated(page.getByRole("button", { name: "Đặt món" }))).click();
    const again = page.getByRole("dialog", { name: "Người đến nhận" });
    await expect(again.getByLabel("Tên")).toHaveValue("Minh Anh");
    await expect(again.getByLabel("Số điện thoại")).toHaveValue("0900000000");
  });

  // Figma O7: someone else ordered first. The cart holds a dish the stub no longer sells beside a croissant,
  // as a cart written before the last portions went would.
  test("says which dish ran out and orders what is left", async ({ page }) => {
    await addCroissant(page);
    await page.evaluate(() => {
      const cart = JSON.parse(localStorage.getItem("secondbite.cart") ?? "null");
      const [basket] = cart.baskets;
      basket.lines.push({ ...basket.lines[0], id: "of-gone-tart", name: "Bánh Tart Trứng" });
      localStorage.setItem("secondbite.cart", JSON.stringify(cart));
    });
    await page.goto("/vi/cart");
    await orderAs(page, "Hà", "0900000001");

    const gone = page.getByRole("dialog", { name: "Bánh Tart Trứng vừa hết" });
    await expect(
      gone.getByText("Người khác vừa đặt phần cuối. Bạn chưa bị tính tiền."),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await gone
      .getByRole("button", { name: "Đặt 1× Bánh Croissant Truyền Thống · 22.000đ" })
      .click();
    await expect(page).toHaveURL(ORDER_URL);
    await expect(page.getByText("1× Bánh Croissant Truyền Thống")).toBeVisible();
    await expect(page.getByText("Bánh Tart Trứng")).toHaveCount(0);
  });
});
