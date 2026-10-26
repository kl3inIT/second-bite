import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";
import { pinHere, TASCO_MALL } from "./pin";

test.use({ locale: "vi-VN", permissions: ["geolocation"], geolocation: TASCO_MALL });
// Each test signs in and opens a store first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

/** Signs in with the stub's right code, opens a store of that name and lands on its home. */
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
  await pinHere(page);
  await page.getByRole("button", { name: "Tạo quán" }).click();
  await expect(page).toHaveURL(/\/vi\/stores\/se-1-/, { timeout: 20_000 });
  return page.url().split("/").pop() ?? "";
}

// The store's reviews (SEC-154, Figma Q1b-3 to Q1b-5): a card on the home, and a page of their own.
test.describe("the reviews of a store", () => {
  test("shows the mean and the latest reviews on the home, and opens them all", async ({
    page,
  }, testInfo) => {
    const store = await storeNamed(page, "lan", testInfo, "Tiệm có đơn");

    const card = page.getByRole("region", { name: "Đánh giá của quán" });
    await expect(card).toContainText("3 đánh giá");
    await expect(card).toContainText("Lê Thu Hà");
    await expect(card).toContainText("Bánh còn nóng, nhận nhanh.");
    await expect(card).toContainText("Nhận hàng nhanh");

    await card.getByRole("link", { name: "Xem tất cả" }).click();
    await expect(page).toHaveURL(`/vi/stores/${store}/reviews`);
    await expect(page.getByRole("heading", { level: 1, name: "Đánh giá của quán" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("filters the list by stars, the choice in the address", async ({ page }, testInfo) => {
    const store = await storeNamed(page, "hoa", testInfo, "Tiệm có đơn");
    await page.goto(`/vi/stores/${store}/reviews`);

    const list = page.getByRole("region", { name: "Danh sách đánh giá" });
    await expect(list.getByRole("listitem").filter({ hasText: "Lê Thu Hà" })).toBeVisible();
    await expect(list.getByRole("listitem").filter({ hasText: "Trần Minh" })).toBeVisible();

    await page.getByRole("link", { name: "≤ 3 sao · 1" }).click();
    await expect(page).toHaveURL(`/vi/stores/${store}/reviews?filter=low`);
    await expect(list.getByRole("listitem").filter({ hasText: "Trần Minh" })).toBeVisible();
    await expect(list.getByRole("listitem").filter({ hasText: "Lê Thu Hà" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "≤ 3 sao · 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("says so when the store has no review yet", async ({ page }, testInfo) => {
    const store = await storeNamed(page, "mai", testInfo, "Tiệm chưa có đánh giá");

    await expect(
      page.getByRole("region", { name: "Đánh giá của quán" }).getByText("Chưa có đánh giá nào."),
    ).toBeVisible();

    await page.goto(`/vi/stores/${store}/reviews`);
    await expect(
      page.getByText("Chưa có đánh giá nào. Khách đánh giá sau khi nhận món."),
    ).toBeVisible();
  });
});
