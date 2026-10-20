import { expect, type Page, test } from "@playwright/test";

import { signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

const password = (page: Page) => page.getByRole("textbox", { name: "Mật khẩu" });
const kept = "Đã lưu · để trống để giữ nguyên";
const passwordLost = "Đổi máy chủ sẽ xoá mật khẩu đã lưu. Nhập lại mật khẩu để giữ kết nối.";

// SEC-62 › Cài đặt email (Figma AD-CS4 to AD-CS7; docs: admin-web-flow › Sửa cài đặt email).
test.describe("the email settings", () => {
  test("show the saved SMTP server without its password, and lock the sign-in without encryption", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/admin/settings/email", testInfo, { who: "thu" });

    await expect(page.getByRole("heading", { level: 2, name: "Email" })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Mục cài đặt" }).getByRole("link", { name: "Email" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(page.getByText("Đang dùng SMTP")).toBeVisible();
    await expect(page.getByRole("radio", { name: "SMTP" })).toBeChecked();
    await expect(page.getByLabel("Địa chỉ gửi")).toHaveValue("noreply@example.com");
    await expect(page.getByLabel("Tên người gửi")).toHaveValue("Second Bite");
    await expect(page.getByLabel("Host")).toHaveValue("smtp.example.com");
    await expect(page.getByLabel("Port")).toHaveValue("587");
    await expect(page.getByRole("radio", { name: "STARTTLS" })).toBeChecked();
    await expect(page.getByLabel("User")).toHaveValue("mailer@example.com");
    await expect(password(page)).toHaveValue("");
    await expect(password(page)).toHaveAttribute("placeholder", kept);
    await expect(page.getByText("Cập nhật lần cuối lúc 14:20, 19/10/2026")).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByText("Không mã hoá", { exact: true }))).click();
    await expect(page.getByLabel("User")).toBeDisabled();
    await expect(password(page)).toBeDisabled();
    await expect(page.getByText("Bạn có thay đổi chưa lưu")).toBeVisible();
    await page.getByText("STARTTLS", { exact: true }).click();
    await expect(password(page)).toBeEnabled();
  });

  test("Brevo shows whether its key is saved, never the key", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/settings/email", testInfo, { who: "brevo" });

    await (await hydrated(page.getByText("Brevo", { exact: true }))).click();
    await expect(page.getByRole("heading", { level: 3, name: "Brevo" })).toBeVisible();
    await expect(page.getByText("Chưa có API key")).toBeVisible();
    await expect(page.getByLabel("Host")).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);

    await page.getByLabel("API key").fill("xkeysib-stub");
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByText("Đã lưu cài đặt email.")).toBeVisible();
    await expect(page.getByText("Đang dùng Brevo")).toBeVisible();
    await expect(page.getByText("API key đã lưu")).toBeVisible();
    await expect(page.getByLabel("API key")).toHaveValue("");
    await expect(page.getByLabel("API key")).toHaveAttribute("placeholder", kept);
  });

  test("a new server without a new password warns before saving (AD-CS7)", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/admin/settings/email", testInfo, { who: "maychu" });

    await (await hydrated(page.getByLabel("Host"))).fill("smtp2.example.com");
    await expect(page.getByText(passwordLost)).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    // Lưu does not send it: the password would go and the user could not sign in to the server.
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(password(page)).toBeFocused();
    await expect(page.getByText("Đã lưu cài đặt email.")).toHaveCount(0);

    await password(page).fill("mat-khau-moi");
    // The warning goes by itself, once the pointer leaves it; until then it sits over the foot of the form.
    await page.mouse.move(0, 0);
    await expect(page.getByText(passwordLost)).toHaveCount(0, { timeout: 15_000 });
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByText("Đã lưu cài đặt email.")).toBeVisible();
    await expect(password(page)).toHaveValue("");

    await page.reload();
    await expect(page.getByLabel("Host")).toHaveValue("smtp2.example.com");
    await expect(password(page)).toHaveAttribute("placeholder", kept);
  });

  test("with no provider saved, a toast says no one can sign in by code (AD-CS6)", async ({
    page,
  }, testInfo) => {
    // The stub has no email settings for an admin whose address starts with "admin.trong.".
    await signInTo(page, "/admin/settings/email", testInfo, { who: "trong" });

    await expect(
      page.getByText("Chưa có nhà cung cấp email nên chưa ai đăng nhập được bằng mã."),
    ).toBeVisible();
    await expect(page.getByText("Chưa cấu hình")).toBeVisible();
    await expect(page.getByText("Chưa lưu lần nào")).toBeVisible();
    await expect(page.getByLabel("Địa chỉ gửi")).toHaveValue("");
    await expect(page.getByLabel("Port")).toHaveValue("");
    await expect(password(page)).not.toHaveAttribute("placeholder", kept);
    await expectNoSeriousA11yViolations(page);
  });

  test("a value the backend refuses is marked at its field", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/settings/email", testInfo, { who: "sai" });

    // The stub refuses the sender name "Từ chối" at its field.
    await (await hydrated(page.getByLabel("Tên người gửi"))).fill("Từ chối");
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByLabel("Tên người gửi")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Giá trị này chưa được chấp nhận.")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
});
