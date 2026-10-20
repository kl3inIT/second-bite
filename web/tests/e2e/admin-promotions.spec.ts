import { expect, test } from "@playwright/test";

import { isReleased, signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);
// The page shows "Sắp ra mắt" until its backend exists (pages.ts); these run again once it is released.
test.skip(!isReleased("promotions"), "not released yet");

// SEC-62 › Marketing › Mã giảm giá (Figma AD-MK1, AD-MK2). No backend keeps codes yet: the list is empty and
// the sheet cannot save. The list with codes is checked with sample rows in promotions-view.test.ts.
test.describe("the promotion codes", () => {
  test("the list is empty, with its cards, filters and table", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/promotions", testInfo, { who: "ma" });

    await expect(page.getByRole("heading", { level: 1, name: "Mã giảm giá" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("link", { name: "Đang chạy —" })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Tìm mã giảm giá" })).toBeVisible();
    await expect(page.getByRole("table", { name: "Mã giảm giá" })).toBeVisible();
    await expect(page.getByText("Chưa có mã giảm giá nào")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("a card filters the list through its address", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/promotions", testInfo, { who: "loc" });

    await (await hydrated(page.getByRole("link", { name: "Lên lịch —" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/promotions\?status=scheduled$/);
    await expect(page.getByRole("link", { name: "Lên lịch —" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect(page.getByText("Không có mã nào khớp bộ lọc")).toBeVisible();
  });

  test("the sheet makes up a code, holds its numbers and cannot save yet", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/admin/promotions", testInfo, { who: "tao" });

    await (await hydrated(page.getByRole("button", { name: "Tạo mã" }))).click();
    const sheet = page.getByRole("dialog", { name: "Tạo mã giảm giá" });
    await expect(sheet).toBeVisible();
    const code = sheet.getByLabel("Mã (tự sinh, có thể sửa)");
    await expect(code).toHaveValue(/^TASCO-[A-Z0-9]{4}$/);

    await sheet.getByLabel("Giá trị").fill("150");
    await expect(sheet.getByLabel("Giá trị")).toHaveValue("100");

    await sheet.getByLabel("Tổng số lượt").fill("3");
    await sheet.getByLabel("Mỗi người dùng").fill("9");
    await expect(sheet.getByLabel("Mỗi người dùng")).toHaveValue("3");

    await code.fill("ab");
    await code.blur();
    await expect(sheet.getByText("Mã cần ít nhất 4 ký tự")).toBeVisible();

    await expect(sheet.getByRole("button", { name: "Tạo mã" })).toBeDisabled();
    await expect(sheet.getByText("Sắp có")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await sheet.getByRole("button", { name: "Huỷ" }).click();
    await expect(sheet).toBeHidden();
  });
});
