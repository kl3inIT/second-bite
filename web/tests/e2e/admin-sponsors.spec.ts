import { expect, test } from "@playwright/test";

import { isReleased, signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);
// The page shows "Sắp ra mắt" until its backend exists (pages.ts); these run again once it is released.
test.skip(!isReleased("sponsors"), "not released yet");

// SEC-62 › Marketing › Tài trợ (Figma AD-MK7). Nothing sells places yet: the list is empty and "Thêm tài trợ"
// is disabled. Places with data are checked with sample rows in sponsors-view.test.ts.
test.describe("the sponsored places", () => {
  test("the list is empty, with its cards, filters and table", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/sponsors", testInfo, { who: "taitro" });

    await expect(page.getByRole("heading", { level: 1, name: "Tài trợ" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("button", { name: "Thêm tài trợ" })).toBeDisabled();
    await expect(page.getByRole("table", { name: "Tài trợ" })).toBeVisible();
    await expect(page.getByText("Chưa có vị trí tài trợ nào")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByRole("link", { name: "Hết hạn · Tạm dừng —" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/sponsors\?status=inactive$/);
    await expect(page.getByText("Không có vị trí nào khớp bộ lọc")).toBeVisible();
  });
});
