import { expect, type Page, test } from "@playwright/test";

import { isReleased, signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

async function expectSettingsPage(page: Page, title: string) {
  await expect(page.getByRole("heading", { level: 1, name: "Cài đặt" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: title })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Mục cài đặt" }).getByRole("link", { name: title }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
}

// SEC-62 › The settings pages without a backend (Figma AD-CD1 to AD-CD7): built in full, empty until their backend
// exists, their actions off with "Sắp có". Their rows are checked with sample data in settings-lists.test.ts. Each
// shows "Sắp ra mắt" until it is released (pages.ts), and its test runs again once it is.
test.describe("the settings pages without a backend", () => {
  test("categories and areas are empty, and cannot be added to yet", async ({ page }, testInfo) => {
    test.skip(
      !isReleased("settingsCategories") || !isReleased("settingsAreas"),
      "not released yet",
    );
    await signInTo(page, "/admin/settings/categories", testInfo, { who: "danhmuc" });
    await expectSettingsPage(page, "Danh mục");
    await expect(page.getByText("Chưa có danh mục nào")).toBeVisible();
    await expect(page.getByRole("button", { name: "Thêm danh mục" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Thêm danh mục" })).toHaveAttribute(
      "title",
      "Sắp có",
    );
    await expectNoSeriousA11yViolations(page);

    await page.goto("/vi/admin/settings/areas");
    await expectSettingsPage(page, "Khu vực");
    await expect(page.getByText("Chưa có khu vực nào")).toBeVisible();
    await expect(page.getByRole("button", { name: "Thêm khu vực" })).toBeDisabled();
    await expectNoSeriousA11yViolations(page);
  });

  test("admins are empty, and adding one opens but cannot be sent yet (AD-AM2)", async ({
    page,
  }, testInfo) => {
    test.skip(!isReleased("settingsAdmins"), "not released yet");
    await signInTo(page, "/admin/settings/admins", testInfo, { who: "quantrivien" });
    await expectSettingsPage(page, "Quản trị viên");
    await expect(page.getByText("Chưa có quản trị viên nào")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByRole("button", { name: "Thêm quản trị viên" }))).click();
    const dialog = page.getByRole("alertdialog", { name: "Thêm quản trị viên" });
    await expect(dialog).toBeVisible();
    const email = dialog.getByLabel("Email");
    await email.fill("baotran");
    await email.blur();
    await expect(dialog.getByText("Email chưa đúng định dạng")).toBeVisible();
    await email.fill("baotran@example.com");
    await expect(dialog.getByText("Email chưa đúng định dạng")).toBeHidden();
    await expect(dialog.getByRole("button", { name: "Thêm quản trị viên" })).toBeDisabled();
    await expectNoSeriousA11yViolations(page);
    await dialog.getByRole("button", { name: "Huỷ" }).click();
    await expect(dialog).toBeHidden();
  });

  test("the audit log is empty, and its filters live in the address", async ({
    page,
  }, testInfo) => {
    test.skip(!isReleased("settingsAuditLog"), "not released yet");
    await signInTo(page, "/admin/settings/audit-log?action=sellerBlocked", testInfo, {
      who: "nhatky",
    });
    await expectSettingsPage(page, "Nhật ký thao tác");
    await expect(page.getByText("Chưa có thao tác nào")).toBeVisible();
    await expect(page.getByText("Hành động:")).toBeVisible();
    await expect(page.getByRole("combobox", { name: /Hành động/ })).toContainText("Chặn cửa hàng");
    await expect(page.getByRole("button", { name: "Tải CSV" })).toBeDisabled();
    await expectNoSeriousA11yViolations(page);

    await (
      await hydrated(page.getByRole("searchbox", { name: "Tìm trong nhật ký" }))
    ).fill("Bún chả");
    await expect(page).toHaveURL(
      /\/vi\/admin\/settings\/audit-log\?q=B%C3%BAn\+ch%E1%BA%A3&action=sellerBlocked$/,
    );
  });

  test("legal content is empty, and a new version cannot be made yet", async ({
    page,
  }, testInfo) => {
    test.skip(!isReleased("settingsLegal"), "not released yet");
    await signInTo(page, "/admin/settings/legal", testInfo, { who: "phaply" });
    await expectSettingsPage(page, "Nội dung pháp lý");
    await expect(page.getByText("Chưa có tài liệu pháp lý nào")).toBeVisible();
    await expect(page.getByRole("button", { name: "Tạo phiên bản mới" })).toBeDisabled();
    await expectNoSeriousA11yViolations(page);
  });

  test("integrations read email from its settings and lead there", async ({ page }, testInfo) => {
    test.skip(!isReleased("settingsIntegrations"), "not released yet");
    await signInTo(page, "/admin/settings/integrations", testInfo, { who: "tichhop" });
    await expectSettingsPage(page, "Tích hợp");

    const email = page.getByRole("region", { name: "Brevo / SMTP" });
    await expect(email.getByText("Đã kết nối")).toBeVisible();
    for (const name of ["SePay (VietQR)", "Mini app Tasco", "Webhook"]) {
      await expect(page.getByRole("region", { name }).getByText("Chưa kết nối")).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "Thêm webhook" })).toBeDisabled();
    await expectNoSeriousA11yViolations(page);

    await email.getByRole("link", { name: "Mở Cài đặt email" }).click();
    await expect(page).toHaveURL(/\/vi\/admin\/settings\/email$/);
  });

  test("integrations show email as not connected when it is not set up", async ({
    page,
  }, testInfo) => {
    // The stub has no email settings for an admin whose address starts with "admin.trong.".
    test.skip(!isReleased("settingsIntegrations"), "not released yet");
    await signInTo(page, "/admin/settings/integrations", testInfo, { who: "trong" });
    await expect(
      page.getByRole("region", { name: "Brevo / SMTP" }).getByText("Chưa kết nối"),
    ).toBeVisible();
  });
});
