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

// SEC-62 › the stores (Figma AD-Q1), on the stub's 27 stores: 23 active, one pending, one rejected, two
// blocked. Each test signs in as an admin of its own, whose stores the stub keeps apart.
test.describe("the admin's stores", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await signInAsAdmin(page, `stores.${testInfo.project.name}.${testInfo.title.length}`);
  });

  test("the admin's home opens the stores, with a card per status", async ({ page }) => {
    await page.goto("/vi/admin");
    await expect(page).toHaveURL(/\/vi\/admin\/sellers$/);

    await expect(page.getByRole("heading", { level: 1, name: "Cửa hàng" })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Khu vực" })).toContainText("Tất cả");
    const cards = page.getByRole("group", { name: "Lọc theo trạng thái" });
    await expect(cards.getByRole("button", { name: /^Đang hoạt động/ })).toContainText("23");
    await expect(cards.getByRole("button", { name: /^Chờ duyệt/ })).toContainText("1");
    await expect(cards.getByRole("button", { name: /^Bị chặn/ })).toContainText("2");

    const table = page.getByRole("table", { name: "Cửa hàng" });
    await expect(table.getByRole("row")).toHaveCount(11);
    await expect(page.getByText("Hiển thị 1–10 trên 27 cửa hàng")).toBeVisible();
    // The pending store leads, as the server's queue has it.
    await expect(table.getByRole("row").nth(1)).toContainText("Chờ duyệt");
    await expectNoSeriousA11yViolations(page);
  });

  test("a card filters by its status, and pressed again shows every store", async ({ page }) => {
    await page.goto("/vi/admin/sellers");

    const blocked = await hydrated(page.getByRole("button", { name: /^Bị chặn/ }));
    await blocked.click();
    await expect(page).toHaveURL(/status=blocked/);
    await expect(blocked).toHaveAttribute("aria-pressed", "true");
    const table = page.getByRole("table", { name: "Cửa hàng" });
    await expect(table.getByRole("row")).toHaveCount(3);

    await blocked.click();
    await expect(page).toHaveURL(/\/vi\/admin\/sellers$/);
    await expect(table.getByRole("row")).toHaveCount(11);
  });

  test("searches without marks, sorts by a head, and sets the page size", async ({ page }) => {
    await page.goto("/vi/admin/sellers");

    await (
      await hydrated(page.getByRole("searchbox", { name: "Tìm cửa hàng theo tên hoặc địa chỉ" }))
    ).fill("banh");
    await expect(page).toHaveURL(/q=banh/);
    const table = page.getByRole("table", { name: "Cửa hàng" });
    await expect(table.getByText("Tiệm bánh Pháp")).toBeVisible();
    await expect(table.getByText("Cơm nhà Hạnh")).toHaveCount(0);

    await table.getByRole("button", { name: "Cửa hàng" }).click();
    await expect(page).toHaveURL(/sort=name/);
    await expect(table.getByRole("columnheader", { name: "Cửa hàng" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );

    await page.getByRole("searchbox", { name: "Tìm cửa hàng theo tên hoặc địa chỉ" }).fill("");
    await (await hydrated(page.getByRole("combobox", { name: "Số dòng" }))).click();
    await page.getByRole("option", { name: "25" }).click();
    await expect(page).toHaveURL(/size=25/);
    await expect(table.getByRole("row")).toHaveCount(26);
    await expect(page.getByText("Hiển thị 1–25 trên 27 cửa hàng")).toBeVisible();
  });

  test("each card draws its last 14 days, and a range of days keeps the stores changed then", async ({
    page,
  }) => {
    await page.goto("/vi/admin/sellers");
    await expect(
      page.getByRole("group", { name: "Lọc theo trạng thái" }).locator(".recharts-surface"),
    ).toHaveCount(3);

    await page.goto("/vi/admin/sellers?from=2026-10-19&to=2026-10-19");
    await expect(page.getByRole("button", { name: /Sửa đổi:.*19\/10\/2026/ })).toBeVisible();
    const table = page.getByRole("table", { name: "Cửa hàng" });
    await expect(table.getByText("Phúc Long")).toBeVisible();
    await expect(table.getByText("Highlands Coffee")).toBeVisible();
    await expect(page.getByText("Hiển thị 1–2 trên 2 cửa hàng")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("says when nothing matches, and clears the filters", async ({ page }) => {
    await page.goto("/vi/admin/sellers?q=khong-co-quan-nay");

    await expect(page.getByText("Không tìm thấy cửa hàng nào")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await (await hydrated(page.getByRole("button", { name: "Xoá bộ lọc" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/sellers$/);
    await expect(page.getByRole("table", { name: "Cửa hàng" }).getByRole("row")).toHaveCount(11);
  });

  test("blocks a store with a reason, refusing a short one, then unblocks it", async ({ page }) => {
    await page.goto("/vi/admin/sellers?q=La%20Paris");
    const table = page.getByRole("table", { name: "Cửa hàng" });

    await (await hydrated(page.getByRole("button", { name: "Thao tác với La Paris" }))).click();
    await page.getByRole("menuitem", { name: "Chặn cửa hàng" }).click();
    const dialog = page.getByRole("dialog", { name: "Chặn cửa hàng La Paris?" });
    await expect(dialog.getByText("Từ 10 đến 500 ký tự")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await dialog.getByLabel("Lý do chặn").fill("Quá ngắn");
    await expect(dialog.getByText("8/500")).toBeVisible();
    await dialog.getByRole("button", { name: "Chặn cửa hàng" }).click();
    await expect(
      dialog.getByText("Ghi lý do cho chủ cửa hàng, từ 10 đến 500 ký tự."),
    ).toBeVisible();

    await dialog.getByLabel("Lý do chặn").fill("Bán bánh đã quá hạn sử dụng cho khách.");
    await dialog.getByRole("button", { name: "Chặn cửa hàng" }).click();
    await expect(page.getByText("Đã chặn La Paris")).toBeVisible();
    await expect(table.getByText("Bị chặn")).toBeVisible();

    await page.getByRole("button", { name: "Thao tác với La Paris" }).click();
    await page.getByRole("menuitem", { name: "Gỡ chặn" }).click();
    const confirm = page.getByRole("alertdialog", { name: "Gỡ chặn cửa hàng La Paris?" });
    await confirm.getByRole("button", { name: "Gỡ chặn" }).click();
    await expect(page.getByText("Đã gỡ chặn La Paris")).toBeVisible();
    await expect(table.getByText("Đang hoạt động")).toBeVisible();
  });

  test("a store's page shows its posts and members, and blocks it as Figma AD-Q3 to AD-Q4", async ({
    page,
  }) => {
    await page.goto("/vi/admin/sellers?q=Ti%E1%BB%87m%20b%C3%A1nh");
    await (
      await hydrated(page.getByRole("button", { name: "Thao tác với Tiệm bánh Pháp" }))
    ).click();
    await page.getByRole("menuitem", { name: "Xem chi tiết" }).click();
    await expect(page).toHaveURL(/\/vi\/admin\/sellers\/se-admin-07$/);

    await expect(page.getByRole("heading", { level: 1, name: "Tiệm bánh Pháp" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Thành viên · 2" })).toBeVisible();
    await expect(page.getByText("Túi bánh mì và croissant, 4 chiếc")).toBeVisible();
    await expect(page.getByText("Chủ cửa hàng", { exact: true })).toBeVisible();
    // Where the owner pinned it (SEC-66), a map that does not move.
    await expect(page.getByRole("figure", { name: "Vị trí quán trên bản đồ" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("button", { name: "Thao tác với Tiệm bánh Pháp" }).click();
    await expect(page.getByRole("menuitem", { name: "Xem chi tiết" })).toHaveCount(0);
    await page.getByRole("menuitem", { name: "Chặn cửa hàng" }).click();
    const dialog = page.getByRole("dialog", { name: "Chặn cửa hàng Tiệm bánh Pháp?" });
    await dialog.getByLabel("Lý do chặn").fill("Bán bánh đã quá hạn sử dụng cho khách.");
    await dialog.getByRole("button", { name: "Chặn cửa hàng" }).click();
    await expect(page.getByText("Đã chặn Tiệm bánh Pháp")).toBeVisible();
    await expect(page.locator('[data-slot="badge"]', { hasText: "Bị chặn" })).toBeVisible();

    await page.getByRole("link", { name: "Xem tất cả" }).click();
    await expect(page).toHaveURL(/tab=posts/);
    await expect(page.getByRole("tab", { name: /Bài đăng/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("a store's posts show by status, as boxes or a table, and open in a panel (AD-QD1 to AD-QD4)", async ({
    page,
  }) => {
    await page.goto("/vi/admin/sellers/se-admin-07?tab=posts");
    const statuses = page.getByRole("group", { name: "Trạng thái bài đăng" });
    await expect(statuses.getByRole("button", { name: "Đang bán · 1" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByText("Túi bánh mì và croissant, 4 chiếc")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(statuses.getByRole("button", { name: "Đã gỡ · 1" }))).click();
    await expect(page).toHaveURL(/posts=withdrawn/);
    await expect(page.getByText("Cơm sườn nướng, 1 suất")).toBeVisible();
    await expect(page.getByText(/^Đã gỡ \d\d\/\d\d · \d\d:\d\d$/)).toBeVisible();

    await statuses.getByRole("button", { name: "Đang bán · 1" }).click();
    await page.getByRole("button", { name: "Dạng bảng" }).click();
    const table = page.getByRole("table", { name: "Bài đăng của cửa hàng" });
    await expect(table.getByRole("row")).toHaveCount(2);
    await expect(page.getByText("Hiển thị 1–1 trên 1 bài đăng")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    // A row's "⋯" opens its menu, whose "Xem chi tiết" opens the post's panel.
    await table
      .getByRole("button", { name: "Thao tác với bài Túi bánh mì và croissant, 4 chiếc" })
      .click();
    await page.getByRole("menuitem", { name: "Xem chi tiết" }).click();
    const panel = page.getByRole("dialog", { name: "Chi tiết bài đăng" });
    await expect(panel.getByText("Bánh mì và croissant nướng trong ngày, còn mềm.")).toBeVisible();
    await expect(panel.getByText("400 g")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await page.keyboard.press("Escape");

    await page.getByRole("tab", { name: "Thành viên · 2" }).click();
    await expect(page.getByText("nhan.vien@example.com")).toBeVisible();
  });

  test("an unknown store is not found", async ({ page }) => {
    await page.goto("/vi/admin/sellers/se-admin-99");
    await expect(page.getByRole("heading", { name: "Không tìm thấy trang này" })).toBeVisible();
  });
  test("a store's orders tab lists its orders of the day, each opening its page", async ({
    page,
  }) => {
    await page.goto("/vi/admin/sellers?q=phap");
    await (await hydrated(page.getByRole("link", { name: "Tiệm bánh Pháp" }))).click();
    await (await hydrated(page.getByRole("tab", { name: /^Đơn hàng/ }))).click();
    await expect(page).toHaveURL(/tab=orders/);
    const table = page.getByRole("table", { name: "Đơn hàng của cửa hàng" });
    await expect(table.getByRole("row").nth(1)).toBeVisible();
    await expect(page.getByRole("link", { name: "Ngày trước" })).toHaveAttribute(
      "href",
      /tab=orders/,
    );
    const first = table.getByRole("row").nth(1);
    await (await hydrated(first.getByRole("button", { name: /^Thao tác với đơn/ }))).click();
    await expect(page.getByRole("menuitem", { name: "Xem chi tiết" })).toHaveAttribute(
      "href",
      /\/vi\/admin\/orders\/.+\?from=store$/,
    );
    await expectNoSeriousA11yViolations(page);
  });
});
