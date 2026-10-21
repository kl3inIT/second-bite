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

// SEC-134 › every store's posts (Figma AD-BD1, AD-BD2), on the stub's 20 stores without a logo, each with a
// post of each status: 80 posts, 20 of each.
test.describe("the admin's posts", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await signInAsAdmin(page, `offers.${testInfo.project.name}.${testInfo.title.length}`);
  });

  test("the menu opens every store's posts, with a card per status", async ({ page }) => {
    await page.goto("/vi/admin/sellers");
    await (await hydrated(page.getByRole("link", { name: "Bài đăng" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/offers$/);

    await expect(page.getByRole("heading", { level: 1, name: "Bài đăng" })).toBeVisible();
    const cards = page.getByRole("group", { name: "Lọc theo trạng thái" });
    for (const status of ["Đang bán", "Hết hàng", "Đã đóng", "Đã gỡ"])
      await expect(cards.getByRole("button", { name: new RegExp(`^${status}`) })).toContainText(
        "20",
      );

    const table = page.getByRole("table", { name: "Bài đăng" });
    await expect(table.getByRole("row")).toHaveCount(11);
    await expect(page.getByText("Hiển thị 1–10 trên 80 bài đăng")).toBeVisible();
    // The newest first: the first store's post on sale.
    await expect(table.getByRole("row").nth(1)).toContainText("Túi bánh mì và croissant, 4 chiếc");
    await expect(table.getByRole("row").nth(1)).toContainText("Tiệm bánh Pháp");
    await expectNoSeriousA11yViolations(page);
  });

  test("a card filters by its status, and words by the dish or the store", async ({ page }) => {
    await page.goto("/vi/admin/offers");

    const withdrawn = await hydrated(page.getByRole("button", { name: /^Đã gỡ/ }));
    await withdrawn.click();
    await expect(page).toHaveURL(/status=withdrawn/);
    await expect(withdrawn).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Hiển thị 1–10 trên 20 bài đăng")).toBeVisible();

    await withdrawn.click();
    await (
      await hydrated(page.getByRole("searchbox", { name: "Tìm tên món hoặc cửa hàng" }))
    ).fill("phap");
    await expect(page).toHaveURL(/q=phap/);
    const table = page.getByRole("table", { name: "Bài đăng" });
    await expect(table.getByRole("row")).toHaveCount(5);
    await expect(table.getByText("Cơm nhà Hạnh")).toHaveCount(0);
  });

  test("a post opens in a panel that leads to its store", async ({ page }) => {
    await page.goto("/vi/admin/offers");

    await (
      await hydrated(
        page.getByRole("button", { name: "Xem bài Túi bánh mì và croissant, 4 chiếc" }).first(),
      )
    ).click();
    const panel = page.getByRole("dialog", { name: "Chi tiết bài đăng" });
    await expect(panel.getByText("Còn 3/3 suất")).toBeVisible();
    await expect(panel.getByRole("link", { name: "Xem trang cửa hàng" })).toHaveAttribute(
      "href",
      /\/vi\/admin\/sellers\/se-admin-\d+$/,
    );
    await expectNoSeriousA11yViolations(page);
  });

  test("says when nothing matches, and clears the filters", async ({ page }) => {
    await page.goto("/vi/admin/offers?q=khong-co-mon-nay");

    await expect(page.getByText("Không có bài đăng nào khớp bộ lọc")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await (await hydrated(page.getByRole("button", { name: "Xoá bộ lọc" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/offers$/);
    await expect(page.getByRole("table", { name: "Bài đăng" }).getByRole("row")).toHaveCount(11);
  });
});
