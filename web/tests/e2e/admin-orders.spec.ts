import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

async function signInAsAdmin(page: Page, name: string) {
  const response = await page.request.post("/api/auth/sessions", {
    data: {
      challengeId: `ch-${encodeURIComponent(`admin.${name}@example.com`)}`,
      code: "123456",
      session: "cookie",
    },
  });
  expect(response.status()).toBe(201);
}

// SEC-135 › every store's orders and an order's page (Figma AD-DH1, AD-DH3), on the stub's twelve orders
// across four stores, two of each status: 2 collected, 4 still to collect, 2 expired.
test.describe("the admin's orders", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await signInAsAdmin(page, `orders.${testInfo.project.name}.${testInfo.title.length}`);
  });

  test("the menu opens every store's orders, with three cards", async ({ page }) => {
    await page.goto("/vi/admin/sellers");
    await (await hydrated(page.getByRole("link", { name: "Đơn hàng" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/orders$/);

    await expect(page.getByRole("heading", { level: 1, name: "Đơn hàng" })).toBeVisible();
    const cards = page.getByRole("group", { name: "Lọc theo trạng thái" });
    for (const [card, count] of [
      ["Đã nhận", "2"],
      ["Đang chờ nhận", "4"],
      ["Hết hạn", "2"],
    ])
      await expect(cards.getByRole("button", { name: new RegExp(`^${card}`) })).toContainText(
        count!,
      );

    const table = page.getByRole("table", { name: "Đơn hàng" });
    await expect(table.getByRole("row")).toHaveCount(11);
    await expect(page.getByText("Hiển thị 1–10 trên 12 đơn")).toBeVisible();
    // The latest window first: SB-24831 at the first store, three lines of which two are shown.
    const first = table.getByRole("row").nth(1);
    await expect(first).toContainText("SB-24831");
    await expect(first).toContainText("Tiệm bánh Pháp");
    await expect(first).toContainText("+1 món");
    await expectNoSeriousA11yViolations(page);
  });

  test("a card filters its orders, and words find a store's", async ({ page }) => {
    await page.goto("/vi/admin/orders");

    const expired = await hydrated(page.getByRole("button", { name: /^Hết hạn/ }));
    await expired.click();
    await expect(page).toHaveURL(/state=expired/);
    await expect(expired).toHaveAttribute("aria-pressed", "true");
    const table = page.getByRole("table", { name: "Đơn hàng" });
    await expect(table.getByRole("row")).toHaveCount(3);

    await expired.click();
    await (
      await hydrated(page.getByRole("searchbox", { name: "Tìm mã đơn, tên khách hoặc cửa hàng" }))
    ).fill("phap");
    await expect(page).toHaveURL(/q=phap/);
    await expect(table.getByRole("row")).toHaveCount(4);
    await expect(table.getByText("Cơm nhà Hạnh")).toHaveCount(0);
  });

  test("an order opens its page, with its lines, its strip and its store", async ({ page }) => {
    await page.goto("/vi/admin/orders");

    await (await hydrated(page.getByRole("link", { name: "SB-24831" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/orders\/or-admin-00$/);
    await expect(page.getByRole("heading", { level: 1, name: "SB-24831" })).toBeVisible();

    const strip = page.getByRole("definition").filter({ hasText: /^Còn \d+ phút$/ });
    await expect(strip).toBeVisible();
    await expect(page.getByText("Tổng thu tại quầy")).toBeVisible();
    await expect(page.getByText("3 món · 4 phần")).toBeVisible();
    await expect(page.getByText("Túi bánh mì và croissant, 4 chiếc")).toBeVisible();
    await expect(page.getByText("Tổng tiền (trả tại quầy)")).toBeVisible();
    await expect(page.getByText("228.000đ").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Xem cửa hàng" })).toHaveAttribute(
      "href",
      /\/vi\/admin\/sellers\/se-admin-\d+$/,
    );
    await expectNoSeriousA11yViolations(page);
  });

  test("says when nothing matches, and clears the filters", async ({ page }) => {
    await page.goto("/vi/admin/orders?q=khong-co-don-nay");

    await expect(page.getByText("Không có đơn nào khớp bộ lọc")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await (await hydrated(page.getByRole("button", { name: "Xoá bộ lọc" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/orders$/);
    await expect(page.getByRole("table", { name: "Đơn hàng" }).getByRole("row")).toHaveCount(11);
  });
});
