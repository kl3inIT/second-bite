import { expect, test } from "@playwright/test";

import { signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

// SEC-62 › Marketing › Banner & nội dung (Figma AD-MK3, AD-MK4). No backend keeps banners yet: the page is empty
// and the editor cannot save. Banners with data are checked with sample rows in content-view.test.ts.
test.describe("the banners and collections", () => {
  test("the page is empty and moves between places through its address", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/admin/content", testInfo, { who: "banner" });

    await expect(page.getByRole("heading", { level: 1, name: "Banner & nội dung" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByText("Chưa có banner nào ở trang chủ")).toBeVisible();
    await expect(page.getByText("Chưa có bộ sưu tập nào")).toBeVisible();
    await expect(page.getByRole("button", { name: "Thêm bộ sưu tập" })).toBeDisabled();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByText("Tìm kiếm · 0"))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/content\?placement=search$/);
    await expect(page.getByRole("heading", { name: "Banner tìm kiếm" })).toBeVisible();
  });

  test("a new banner is written with its preview, and cannot be saved yet", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/admin/content", testInfo, { who: "taobanner" });

    await (await hydrated(page.getByRole("link", { name: "Thêm banner" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/content\/banners\/new$/);
    await expect(page.getByRole("heading", { level: 1, name: "Thêm banner" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Đường dẫn" })).toContainText(
      /Marketing.*Banner & nội dung.*Banner mới/,
    );

    const title = await hydrated(page.getByLabel("Tiêu đề", { exact: true }));
    await title.fill("Ưu đãi cuối ngày");
    await expect(
      page.getByRole("region", { name: "Xem trước trên app" }).getByText("Ưu đãi cuối ngày"),
    ).toBeVisible();

    const start = page.getByLabel("Bắt đầu hiển thị");
    const end = page.getByLabel("Kết thúc");
    await start.fill("2026-12-01T06:00");
    await expect(end).toHaveValue("2026-12-01T06:00");

    await expect(page.getByRole("button", { name: "Lưu banner" })).toBeDisabled();
    // The banners page behind stays in the router's cache, hidden, with its own "Sắp có".
    await expect(page.getByText("Sắp có").filter({ visible: true })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("a banner that is not kept is not found, inside the admin", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/content/banners/khong-co", testInfo, { who: "khongbanner" });
    await expect(page.getByRole("heading", { name: "Không tìm thấy trang này" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Đường dẫn" })).toContainText(
      "Không tìm thấy",
    );
  });
});
