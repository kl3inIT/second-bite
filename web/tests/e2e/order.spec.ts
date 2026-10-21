import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

const ORDER_URL = /\/vi\/orders\/[0-9a-f-]{36}$/;
const DISH = "Bánh Croissant Truyền Thống";

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
  const check = page.getByRole("alertdialog", { name: "Xác nhận đặt đơn với số điện thoại" });
  await expect(check).toBeVisible();
  await check.getByRole("button", { name: "Đúng, đặt món" }).click();
}

/** The dish's line on the order's page, its units and name in spans of their own (Figma D2 › Món đã đặt). */
function dishLine(page: Page) {
  return page.getByRole("main").getByText(DISH, { exact: true });
}

// SEC-76 › Figma K5, O7; SEC-83 › Figma D1–D5: ordering needs no account, only a name and a phone number
// checked once; the order is collected by its QR code or that name and number (SEC-86).
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
    const check = page.getByRole("alertdialog", {
      name: "Xác nhận đặt đơn với số điện thoại",
    });
    await expect(check.getByText("0900 000 000")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await check.getByRole("button", { name: "Sửa" }).click();
    await expect(sheet.getByLabel("Số điện thoại")).toHaveValue("0900 000 000");
    await sheet.getByRole("button", { name: "Tiếp tục" }).click();
    await check.getByRole("button", { name: "Đúng, đặt món" }).click();

    await expect(page).toHaveURL(ORDER_URL);
    await expect(page.getByRole("heading", { name: /^Đơn #SB-\d+$/, level: 1 })).toBeVisible();
    await expect(page.getByText("Đã xác nhận · quán đang chuẩn bị")).toBeVisible();
    await expect(page.getByText(/^Mã QR hiện khi món sẵn sàng/)).toBeVisible();
    await expect(dishLine(page)).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByRole("button", { name: /^Huỷ đơn/ }))).click();
    const cancel = page.getByRole("alertdialog", { name: /Huỷ đơn SB-\d+\?/ });
    await cancel.getByRole("button", { name: "Không đến kịp" }).click();
    await cancel.getByRole("button", { name: "Huỷ đơn" }).click();
    await expect(page.getByText(/^Đã huỷ lúc/)).toBeVisible();

    await page.goto("/vi/orders?state=ended");
    await expect(page.getByRole("heading", { name: "Hôm nay" })).toBeVisible();
    await expect(page.getByRole("link", { name: new RegExp(DISH) })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    // The cart was ordered, so it is gone, and the contact is kept for the next order.
    await addCroissant(page);
    await page.goto("/vi/cart");
    await (await hydrated(page.getByRole("button", { name: "Đặt món" }))).click();
    const again = page.getByRole("dialog", { name: "Người đến nhận" });
    await expect(again.getByLabel("Tên")).toHaveValue("Minh Anh");
    await expect(again.getByLabel("Số điện thoại")).toHaveValue("0900000000");
  });

  // Figma K6, K6b: the seller marks it ready, which shows its QR code, then hands it over, and it is rated once.
  test("shows the QR code once ready, then rates the order once collected", async ({ page }) => {
    await addCroissant(page);
    await page.goto("/vi/cart");
    await orderAs(page, "Lan", "0900000002");
    await expect(page).toHaveURL(ORDER_URL);
    const orderId = page.url().split("/").at(-1);

    await page.request.post(`/api/orders/${orderId}/ready`);
    await page.reload();
    await expect(page.getByText("Món đã sẵn sàng")).toBeVisible();
    await expect(page.getByText(/^Đưa mã QR cho quầy quét/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Cách nhận món" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.goto("/vi/orders");
    await expect(page.getByRole("link", { name: "Đang chờ nhận (1)" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Xem đơn" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.request.post(`/api/orders/${orderId}/hand-over`);
    await page.goto(`/vi/orders/${orderId}`);
    await expect(page.getByText(/^Đã nhận món lúc/)).toBeVisible();
    await expect(page.getByText("28.000đ", { exact: true })).toBeVisible();
    await expect(page.getByText("Tiết kiệm so với giá gốc · 1 phần không bị bỏ phí")).toBeVisible();

    const send = await hydrated(page.getByRole("button", { name: "Gửi đánh giá" }));
    await expect(send).toBeDisabled();
    await page.getByRole("radio", { name: "4 sao" }).click();
    await expect(page.getByText("Tốt", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Nhận hàng nhanh" }).click();
    await expect(page.getByRole("button", { name: "Nhận hàng nhanh" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.getByLabel("Viết vài dòng cho quán (không bắt buộc)").fill("Bánh còn giòn.");
    await expectNoSeriousA11yViolations(page);
    await send.click();

    await expect(page.getByRole("heading", { name: "Bạn đã đánh giá" })).toBeVisible();
    await expect(page.getByText("4 sao", { exact: true })).toBeAttached();
    await expect(page.getByText("Nhận hàng nhanh")).toBeVisible();
    await expect(page.getByText("“Bánh còn giòn.”")).toBeVisible();
    await expect(page.getByRole("button", { name: "Gửi đánh giá" })).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);
  });

  // Figma K8, K6: a cart from two sellers places two orders, each its own card and page, linked to the other.
  test("lists each seller's order on its own, and links the orders placed together", async ({
    page,
  }) => {
    await addCroissant(page);
    await page.goto("/vi/sellers/se-panda-chef");
    await (await hydrated(page.getByRole("button", { name: "Thêm một phần Há cảo tôm" }))).click();
    await page.goto("/vi/cart");
    await (await hydrated(page.getByRole("button", { name: "Đặt 2 đơn" }))).click();
    const sheet = page.getByRole("dialog", { name: "Người đến nhận" });
    await sheet.getByLabel("Tên").fill("Hà");
    await sheet.getByLabel("Số điện thoại").fill("0900000003");
    await sheet.getByRole("button", { name: "Tiếp tục" }).click();
    await page
      .getByRole("alertdialog", { name: "Xác nhận đặt đơn với số điện thoại" })
      .getByRole("button", { name: "Đúng, đặt món" })
      .click();
    await expect(page).toHaveURL(ORDER_URL);

    await page.goto("/vi/orders");
    await expect(page.getByRole("link", { name: "Đang chờ nhận (2)" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Xem đơn" })).toHaveCount(2);
    await expect(page.getByRole("heading", { level: 3, name: DISH })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Há cảo tôm" })).toBeVisible();

    await page.getByRole("link", { name: "Xem đơn" }).first().click();
    await expect(page).toHaveURL(ORDER_URL);
    const together = page.getByRole("link", { name: /^Cùng lần đặt: / });
    await expect(together).toHaveCount(1);
    const first = page.url();
    await together.click();
    await expect(page).not.toHaveURL(first);
    await expect(page).toHaveURL(ORDER_URL);
    await expect(page.getByRole("link", { name: /^Cùng lần đặt: / })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
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
    await expect(dishLine(page)).toBeVisible();
    await expect(page.getByText("Bánh Tart Trứng")).toHaveCount(0);
  });
});
