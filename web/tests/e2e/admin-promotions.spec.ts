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

// The buyer-discount increment's admin pages, on the stub's one promotion running since 26/10 with two rules, and
// its payouts owed to the first two active stores each week.
test.describe("the admin's discounts", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await signInAsAdmin(page, `promotions.${testInfo.project.name}.${testInfo.title.length}`);
  });

  test("the list shows the running programme with its budget, and opens it", async ({ page }) => {
    await page.goto("/vi/admin/promotions");
    await expect(page.getByRole("heading", { level: 1, name: "Giảm giá" })).toBeVisible();
    const cards = page.getByRole("group", { name: "Lọc theo trạng thái" });
    await expect(cards.getByRole("button", { name: /^Đang chạy/ })).toContainText("1");
    const table = page.getByRole("table", { name: "Giảm giá" });
    await expect(table.getByRole("row")).toHaveCount(2);
    await expect(table.getByText("Mọi cửa hàng")).toBeVisible();
    await expect(table.getByText("2 ưu đãi")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (
      await hydrated(table.getByRole("link", { name: "Chương trình hỗ trợ Second Bite" }))
    ).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "Chương trình hỗ trợ Second Bite" }),
    ).toBeVisible();
    await expect(page.getByText("Khách mới giảm 20.000đ")).toBeVisible();
    await expect(page.getByText("4.360.000đ")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("creates a programme with one offer for new customers", async ({ page }) => {
    await page.goto("/vi/admin/promotions/new");
    const form = page.getByRole("form", { name: "Tạo chương trình giảm giá" });
    await hydrated(form.getByRole("button", { name: "Thêm ưu đãi" }));

    await form.getByRole("button", { name: "Tạo chương trình" }).click();
    await expect(form.getByText("Nhập tên chương trình, tối đa 80 ký tự")).toBeVisible();
    await expect(form.getByText("Thêm ít nhất một ưu đãi, tối đa 10")).toBeVisible();

    await form.getByLabel("Tên chương trình").fill("Tuần lễ khai trương");
    await form.getByLabel("Ngân sách (đ)").fill("2.000.000");
    await form.getByRole("button", { name: "Thêm ưu đãi" }).click();

    const dialog = page.getByRole("dialog", { name: "Thêm ưu đãi" });
    await expect(dialog.getByLabel("Điều kiện 1: giá trị")).toHaveValue("new");
    await dialog.getByRole("button", { name: "Lưu ưu đãi" }).click();
    await expect(dialog.getByText("Nhập tên ưu đãi, tối đa 60 ký tự")).toBeVisible();
    await dialog.getByLabel("Tên ưu đãi").fill("Khách mới giảm 15.000đ");
    await dialog.getByLabel("Giảm (đ)").fill("15.000");
    await expectNoSeriousA11yViolations(page);
    await dialog.getByRole("button", { name: "Lưu ưu đãi" }).click();
    await expect(dialog).toBeHidden();

    await expect(form.getByText("Khách mới giảm 15.000đ")).toBeVisible();
    await expect(form.getByText("Khách mới", { exact: true })).toBeVisible();
    await form.getByRole("button", { name: "Tạo chương trình" }).click();
    await expect(page).toHaveURL(/\/vi\/admin\/promotions\/pr-2$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Tuần lễ khai trương" }),
    ).toBeVisible();
  });

  test("marks a store's week paid", async ({ page }) => {
    await page.goto("/vi/admin/promotions/payouts?week=2026-11-04");
    await expect(page.getByRole("heading", { level: 1, name: "Trả tiền cho quán" })).toBeVisible();
    await expect(page.getByText(/^Tuần 02.11 – 08.11$/)).toBeVisible();
    const table = page.getByRole("table", { name: "Trả tiền cho quán" });
    await expect(table.getByRole("row")).toHaveCount(3);
    await expect(table.getByText("Chưa trả")).toHaveCount(2);
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(table.getByRole("button", { name: "Đánh dấu đã trả" }).first())).click();
    const dialog = page.getByRole("alertdialog", { name: /^Đã chuyển 100\.000đ cho/ });
    await dialog.getByRole("button", { name: "Đã chuyển" }).click();
    await expect(table.getByText("Chưa trả")).toHaveCount(1);
    await expect(table.getByText(/^Đã trả/)).toBeVisible();
  });
});
