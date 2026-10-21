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

// SEC-75 › the admins' log (Figma AD-CD5), on the stub's made-up week of actions.
test.describe("the admins' log", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await signInAsAdmin(page, `log.${testInfo.project.name}.${testInfo.title.length}`);
  });

  test("the admin's home opens the log, the latest first, with what each action changed", async ({
    page,
  }) => {
    await page.goto("/vi/admin");
    await expect(page).toHaveURL(/\/vi\/admin\/audit$/);

    await expect(page.getByRole("heading", { level: 1, name: "Nhật ký thao tác" })).toBeVisible();

    const table = page.getByRole("table", { name: "Nhật ký thao tác" });
    await expect(table.getByRole("row")).toHaveCount(26);
    await expect(page.getByText("Hiển thị 1–25 trên 30 thao tác")).toBeVisible();
    await expect(table.getByText("Giảm tối thiểu: 20% → 30%")).toBeVisible();
    await expect(table.getByText("Mật khẩu SMTP: đã đổi")).toBeVisible();
    await expect(table.getByRole("cell", { name: "Dòng lệnh", exact: true })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("filters by action and by words, and says when nothing matches", async ({ page }) => {
    await page.goto("/vi/admin/audit");

    await (await hydrated(page.getByRole("combobox", { name: "Hành động" }))).click();
    await page.getByRole("option", { name: "Chặn cửa hàng" }).click();
    await expect(page).toHaveURL(/action=seller\.block/);

    const table = page.getByRole("table", { name: "Nhật ký thao tác" });
    await expect(table.getByText("Gỡ chặn")).toHaveCount(0);
    await expect(
      table.getByText("Lý do: Bán đồ quá hạn nhiều lần, khách đã báo").first(),
    ).toBeVisible();

    await page.getByRole("searchbox", { name: "Tìm cửa hàng, email" }).fill("không có quán này");
    await expect(page.getByText("Không tìm thấy thao tác")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("button", { name: "Xoá bộ lọc" }).click();
    await expect(page).toHaveURL(/\/vi\/admin\/audit$/);
    await expect(table.getByRole("row")).toHaveCount(26);
  });

  test("pages through the log", async ({ page }) => {
    await page.goto("/vi/admin/audit");

    await (
      await hydrated(
        page.getByRole("navigation", { name: "Trang" }).getByRole("link", { name: "2" }),
      )
    ).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByText("Hiển thị 26–30 trên 30 thao tác")).toBeVisible();
    await expect(
      page.getByRole("table", { name: "Nhật ký thao tác" }).getByRole("row"),
    ).toHaveCount(6);
  });
});
