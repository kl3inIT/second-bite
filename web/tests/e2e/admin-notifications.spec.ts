import { expect, test } from "@playwright/test";

import { isReleased, signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);
// The page shows "Sắp ra mắt" until its backend exists (pages.ts); these run again once it is released.
test.skip(!isReleased("notifications"), "not released yet");

// SEC-62 › Marketing › Thông báo (Figma AD-MK5, AD-MK6). Nothing sends to groups yet: the history is empty and
// the composer cannot send. Campaigns with data are checked with sample rows in notifications-view.test.ts.
test.describe("the notifications to groups", () => {
  test("the history is empty, with its filters and table", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/notifications", testInfo, { who: "thongbao" });

    await expect(page.getByRole("heading", { level: 1, name: "Thông báo" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("table", { name: "Thông báo" })).toBeVisible();
    await expect(page.getByText("Chưa gửi thông báo nào")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("the composer previews the notification and cannot send yet", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/notifications", testInfo, { who: "soan" });

    await (await hydrated(page.getByRole("link", { name: "Soạn thông báo" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/notifications\/new$/);
    await expect(page.getByRole("heading", { level: 1, name: "Soạn thông báo" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Đường dẫn" })).toContainText(
      /Marketing.*Thông báo.*Soạn thông báo/,
    );

    const preview = page.getByRole("region", { name: "Xem trước thông báo" });
    await (
      await hydrated(page.getByLabel("Tiêu đề", { exact: true }))
    ).fill("Bánh ngọt giảm 50% tối nay");
    await expect(preview.getByText("Bánh ngọt giảm 50% tối nay")).toBeVisible();

    await page.getByLabel("Giờ gửi (giờ Việt Nam)").fill("23:30");
    await expect(page.getByLabel("Giờ gửi (giờ Việt Nam)")).toHaveValue("21:59");

    await page.getByText("Email", { exact: true }).filter({ visible: true }).click();
    await expect(preview.getByText("Second Bite · Email")).toBeVisible();

    await expect(page.getByRole("button", { name: "Lên lịch" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Gửi thử" })).toBeDisabled();
    await expectNoSeriousA11yViolations(page);
  });
});
