import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in and opens a store first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

/** Signs in with the stub's right code, opens a store of that name and returns its identifier. */
async function storeNamed(
  page: Page,
  who: string,
  testInfo: { project: { name: string } },
  name: string,
) {
  await page.goto(`/vi/sign-in?returnTo=${encodeURIComponent("/open-store")}`);
  await (
    await hydrated(page.getByLabel("Email"))
  ).fill(`${who}.${testInfo.project.name}@example.com`);
  await page.getByRole("button", { name: "Gửi mã" }).click();
  await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
  await (await hydrated(page.getByLabel("Tên quán"))).fill(name);
  await page.getByLabel("Số điện thoại").fill("0912345678");
  await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall");
  await page.getByRole("button", { name: "Tạo quán" }).click();
  await expect(page).toHaveURL(/\/vi\/stores\/se-1-/, { timeout: 20_000 });
  return page.url().split("/").pop() ?? "";
}

const row = (page: Page, text: RegExp | string) =>
  page.getByRole("listitem").filter({ hasText: text });

// SEC-78 › The seller's order tab (Figma Q5, Q5b to Q5g), and SEC-102 › its steps and the order's own page (Q5h to
// Q5k): the orders of a day, prepared, marked ready and handed over.
test.describe("the order tab of a store", () => {
  test("opens the scanner of an order's code, and says when there is no camera", async ({
    page,
  }, testInfo) => {
    await storeNamed(page, "kim", testInfo, "Tiệm có đơn");
    await page.getByRole("link", { name: "Đơn", exact: true }).click();

    await page.getByRole("button", { name: "Quét mã đơn" }).click();
    const dialog = page.getByRole("dialog", { name: "Quét mã đơn" });
    await expect(dialog.getByText("Đưa mã QR của khách vào khung")).toBeVisible();
    // The check runs with no camera and no permission to ask for one.
    await expect(dialog.getByText(/Chưa mở được camera/)).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await dialog.getByRole("button", { name: "Đóng" }).click();
    await expect(dialog).toHaveCount(0);
  });

  test("lists the day's orders with who ordered them, in four tabs", async ({ page }, testInfo) => {
    const store = await storeNamed(page, "ha", testInfo, "Tiệm có đơn");
    await page.getByRole("link", { name: "Đơn", exact: true }).click();

    await expect(page.getByRole("heading", { level: 1, name: "Đơn" })).toBeVisible();
    await expect(page.getByText("Chuẩn bị 3 · sẵn sàng 1")).toBeVisible();
    await expect(page.getByRole("link", { name: "Chuẩn bị · 3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(page.getByRole("link", { name: "Sẵn sàng · 1" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Đã giao · 1" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Đã hủy · 1" })).toBeVisible();

    const held = row(page, "Lê Thu Hà · 0905111222");
    await expect(held).toContainText("Cơm sườn nướng");
    await expect(held).toContainText(/#SB-\d+/);
    await expect(held).toContainText("1 suất");
    await expect(held).toContainText("30.000đ");
    await expect(
      held.getByRole("button", { name: "Sao chép số điện thoại 0905111222" }),
    ).toBeVisible();
    await expect(row(page, "Nguyễn An · 0912345678")).toContainText("2 túi");
    await expect(row(page, "Nguyễn An · 0912345678")).toContainText("114.000đ");
    // An order being prepared is marked ready first; it is handed over only once it is ready.
    await expect(held.getByRole("button", { name: "Báo sẵn sàng" })).toBeVisible();
    await expect(held.getByRole("button", { name: "Đã giao" })).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("link", { name: "Sẵn sàng · 1" }).click();
    await expect(page).toHaveURL(new RegExp(`/vi/stores/${store}/orders\\?tab=ready`));
    const ready = row(page, "Đỗ Hương · 0966333444");
    await expect(ready.getByRole("button", { name: "Đã giao" })).toBeVisible();
    await expect(ready.getByRole("button", { name: "Báo sẵn sàng" })).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("link", { name: "Đã giao · 1" }).click();
    await expect(page).toHaveURL(new RegExp(`/vi/stores/${store}/orders\\?tab=delivered`));
    await expect(page.getByText("Hôm nay 1 đơn · 57.000đ")).toBeVisible();
    await expect(
      row(page, "Phạm Quốc Bảo · 0933222888").getByRole("button", { name: "Hoàn tác" }),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("link", { name: "Đã hủy · 1" }).click();
    await expect(row(page, "Võ Lan · 0900123456")).toContainText(
      "Khách tự hủy trên trang người dùng",
    );
    // A customer's own cancelling is not the seller's to take back.
    await expect(
      row(page, "Võ Lan · 0900123456").getByRole("button", { name: "Hoàn tác" }),
    ).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);
  });

  test("marks an order ready, hands it over and takes it back", async ({ page }, testInfo) => {
    const store = await storeNamed(page, "an", testInfo, "Tiệm có đơn");
    await page.goto(`/vi/stores/${store}/orders`);

    await (
      await hydrated(
        row(page, "Lê Thu Hà · 0905111222").getByRole("button", { name: "Báo sẵn sàng" }),
      )
    ).click();
    await expect(page.getByRole("link", { name: "Chuẩn bị · 2" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sẵn sàng · 2" })).toBeVisible();
    await expect(row(page, "Lê Thu Hà · 0905111222")).toHaveCount(0);

    await page.getByRole("link", { name: "Sẵn sàng · 2" }).click();
    await (
      await hydrated(row(page, "Lê Thu Hà · 0905111222").getByRole("button", { name: "Đã giao" }))
    ).click();
    await expect(page.getByText("Đã giao cho Lê Thu Hà")).toBeVisible();
    await expect(page.getByRole("link", { name: "Sẵn sàng · 1" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Đã giao · 2" })).toBeVisible();
    await expect(row(page, "Lê Thu Hà · 0905111222")).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);

    // Taking the hand-over back opens the order again, which is being prepared.
    await page.getByRole("button", { name: "Hoàn tác" }).click();
    await expect(page.getByRole("link", { name: "Chuẩn bị · 3" })).toBeVisible();
    await page.getByRole("link", { name: "Chuẩn bị · 3" }).click();
    await expect(row(page, "Lê Thu Hà · 0905111222")).toBeVisible();
  });

  test("opens an order's own page, with its steps and the next one", async ({ page }, testInfo) => {
    const store = await storeNamed(page, "hong", testInfo, "Tiệm có đơn");
    await page.goto(`/vi/stores/${store}/orders`);

    await (await hydrated(row(page, "Lê Thu Hà · 0905111222").getByRole("link"))).first().click();
    await expect(page).toHaveURL(new RegExp(`/vi/stores/${store}/orders/or-1-`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Đơn mới · đang chuẩn bị");
    const track = page.getByRole("list", { name: "Các bước của đơn" });
    await expect(track.getByRole("listitem").filter({ hasText: "Chuẩn bị" })).toHaveAttribute(
      "aria-current",
      "step",
    );
    await expect(page.getByText("Món đã đặt · 1 phần")).toBeVisible();
    await expect(page.getByText("Lê Thu Hà", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Đã giao" })).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByRole("button", { name: "Báo sẵn sàng" }))).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Đã báo sẵn sàng · chờ khách đến",
    );
    await expect(track.getByRole("listitem").filter({ hasText: "Sẵn sàng" })).toHaveAttribute(
      "aria-current",
      "step",
    );
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("button", { name: "Đã giao" }).click();
    await expect(page).toHaveURL(new RegExp(`/vi/stores/${store}/orders\\?undo=`));
    await expect(page.getByText("Đã giao cho Lê Thu Hà")).toBeVisible();
  });

  test("cancels an order with a reason, which the cancelled tab shows", async ({
    page,
  }, testInfo) => {
    const store = await storeNamed(page, "minh", testInfo, "Tiệm có đơn");
    await page.goto(`/vi/stores/${store}/orders`);

    await (
      await hydrated(row(page, "Trần Minh · 0987654321").getByRole("button", { name: "Hủy đơn" }))
    ).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("Hủy đơn của Trần Minh?")).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Không nghe máy" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expectNoSeriousA11yViolations(page);

    await dialog.getByRole("button", { name: "Lý do khác" }).click();
    await dialog.getByLabel("Ghi lý do").fill("Khách đổi ý");
    await dialog.getByRole("button", { name: "Hủy đơn", exact: true }).click();

    await expect(page.getByRole("link", { name: "Chuẩn bị · 2" })).toBeVisible();
    await page.getByRole("link", { name: "Đã hủy · 2" }).click();
    await expect(row(page, "Trần Minh · 0987654321")).toContainText(
      "Lý do: Lý do khác · Khách đổi ý",
    );
    await row(page, "Trần Minh · 0987654321").getByRole("button", { name: "Hoàn tác" }).click();
    await expect(page.getByRole("link", { name: "Đã hủy · 1" })).toBeVisible();
  });

  test("searches by phone number and picks another day", async ({ page }, testInfo) => {
    const store = await storeNamed(page, "lan", testInfo, "Tiệm có đơn");
    await page.goto(`/vi/stores/${store}/orders`);

    await (await hydrated(page.getByLabel("Tìm đơn"))).fill("0912");
    await expect(page).toHaveURL(/q=0912/);
    await expect(page.getByText("1 kết quả")).toBeVisible();
    await expect(row(page, "Nguyễn An · 0912345678")).toBeVisible();
    await expect(row(page, "Lê Thu Hà · 0905111222")).toHaveCount(0);

    await page.getByLabel("Tìm đơn").fill("xyz");
    await expect(page.getByText("Không có đơn nào khớp “xyz”.")).toBeVisible();
    await page.getByLabel("Tìm đơn").fill("");
    await expect(row(page, "Lê Thu Hà · 0905111222")).toBeVisible();

    await page.getByRole("link", { name: "Ngày trước" }).click();
    await expect(page).toHaveURL(/day=\d{4}-\d{2}-\d{2}/);
    await expect(page.getByText("Chưa có đơn nào đang chuẩn bị ngày này.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Chuẩn bị · 0" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("button", { name: /^Chọn ngày/ }).click();
    await expect(page.getByRole("link", { name: "Hôm nay" })).toBeVisible();
    await expect(page.getByRole("grid")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await page.getByRole("link", { name: "Hôm nay" }).click();
    await expect(page.getByText("Chuẩn bị 3 · sẵn sàng 1")).toBeVisible();
  });
});
