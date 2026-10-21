import { expect, test } from "@playwright/test";

import { signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

// SEC-62 › Cài đặt bài đăng (Figma AD-CS1 to AD-CS3; docs: admin-web-flow › Sửa cài đặt bài đăng).
test.describe("the offer settings", () => {
  test("/admin/settings opens them, with the settings menu and the saved values", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/admin/settings/offers", testInfo, { who: "caidat" });
    await page.goto("/vi/admin/settings");
    await expect(page).toHaveURL(/\/vi\/admin\/settings\/offers$/);

    await expect(page.getByRole("heading", { level: 1, name: "Cài đặt" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Bài đăng" })).toBeVisible();
    const menu = page.getByRole("navigation", { name: "Mục cài đặt" });
    await expect(menu.getByRole("link")).toHaveCount(7);
    await expect(menu.getByRole("link", { name: "Bài đăng" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    for (const card of ["Giá", "Khung nhận", "Tìm kiếm"]) {
      await expect(page.getByRole("heading", { level: 3, name: card })).toBeVisible();
    }
    await expect(page.getByLabel("Giảm tối thiểu")).toHaveValue("20");
    await expect(page.getByLabel("Ngắn nhất")).toHaveValue("30");
    await expect(page.getByLabel("Dài nhất")).toHaveValue("360");
    await expect(page.getByLabel("Bắt đầu trong vòng")).toHaveValue("24");
    await expect(page.getByLabel("Bán kính mặc định")).toHaveValue("5");
    await expect(page.getByLabel("Bán kính tối đa")).toHaveValue("30");
    await expect(page.getByText("phút", { exact: true })).toHaveCount(2);
    await expect(page.getByText("Cập nhật lần cuối lúc 09:15, 18/10/2026")).toBeVisible();
    await expect(page.getByRole("button", { name: "Lưu thay đổi" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Huỷ" })).toBeDisabled();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expectNoSeriousA11yViolations(page);
  });

  test("a number never leaves its bounds, and Huỷ puts the saved values back", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/admin/settings/offers", testInfo, { who: "kep" });

    const discount = await hydrated(page.getByLabel("Giảm tối thiểu"));
    await discount.fill("95");
    await expect(discount).toHaveValue("90");

    // The shortest window goes no further than the longest, and the longest no lower than the shortest.
    await page.getByLabel("Ngắn nhất").fill("400");
    await expect(page.getByLabel("Ngắn nhất")).toHaveValue("360");
    await page.getByLabel("Ngắn nhất").fill("60");
    await page.getByLabel("Dài nhất").fill("20");
    await page.getByLabel("Dài nhất").blur();
    await expect(page.getByLabel("Dài nhất")).toHaveValue("60");

    // The default radius goes no further than the largest.
    await page.getByLabel("Bán kính mặc định").fill("50");
    await expect(page.getByLabel("Bán kính mặc định")).toHaveValue("30");

    await expect(page.getByText("Bạn có thay đổi chưa lưu")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await page.getByRole("button", { name: "Huỷ" }).click();
    await expect(discount).toHaveValue("20");
    await expect(page.getByLabel("Dài nhất")).toHaveValue("360");
    await expect(page.getByRole("button", { name: "Lưu thay đổi" })).toBeDisabled();
  });

  test("saving says the values apply to new posts and keeps them", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/settings/offers", testInfo, { who: "luu" });

    await (await hydrated(page.getByLabel("Giảm tối thiểu"))).fill("30");
    await page.getByLabel("Bán kính tối đa").fill("40");
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();

    await expect(page.getByText("Đã lưu. Áp dụng cho bài đăng mới.")).toBeVisible();
    await expect(page.getByText(/^Cập nhật lần cuối lúc/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Lưu thay đổi" })).toBeDisabled();
    await expectNoSeriousA11yViolations(page);

    await page.reload();
    await expect(page.getByLabel("Giảm tối thiểu")).toHaveValue("30");
    await expect(page.getByLabel("Bán kính tối đa")).toHaveValue("40");
  });

  test("saving over someone else's save is refused with a toast (SEC-75)", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/admin/settings/offers", testInfo, { who: "chongcheo" });
    const discount = await hydrated(page.getByLabel("Giảm tối thiểu"));

    // Another admin saves after the page read the settings: the page's version is no longer the current one.
    const read = await page.request.get("/api/admin/offer-settings");
    const { updatedAt: _at, updatedBy: _by, ...settings } = await read.json();
    const other = await page.request.put("/api/admin/offer-settings", {
      headers: { "If-Match": read.headers().etag },
      data: { ...settings, maxRadiusKm: 50 },
    });
    expect(other.status()).toBe(200);

    await discount.fill("35");
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByText("Cài đặt vừa được người khác sửa, tải lại để xem.")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.reload();
    await expect(page.getByLabel("Giảm tối thiểu")).toHaveValue("20");
    await expect(page.getByLabel("Bán kính tối đa")).toHaveValue("50");
  });

  test("a value the backend refuses is marked at its field", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/settings/offers", testInfo, { who: "tuchoi" });

    // The stub refuses a minimum discount of 77 at its field.
    await (await hydrated(page.getByLabel("Giảm tối thiểu"))).fill("77");
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();

    await expect(page.getByLabel("Giảm tối thiểu")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Giá trị này chưa được chấp nhận.")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByLabel("Giảm tối thiểu").fill("25");
    await expect(page.getByText("Giá trị này chưa được chấp nhận.")).toHaveCount(0);
  });
});
