import { expect, test, type Page, type TestInfo } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

/** Signs in as an admin of its own, so each test has its own settings in the stub; "unset" starts with none. */
async function signInAsAdmin(page: Page, testInfo: TestInfo, kind = "set") {
  const email = `admin.email.${kind}.${testInfo.project.name}.${testInfo.title.length}@example.com`;
  const response = await page.request.post("/api/auth/sessions", {
    data: { challengeId: `ch-${encodeURIComponent(email)}`, code: "123456", session: "cookie" },
  });
  expect(response.status()).toBe(201);
  return email;
}

// SEC-75 › the email settings (Figma AD-E1…E4), on the stub's settings.
test.describe("the email settings", () => {
  test("the settings open on email, saved SMTP shown, a change saved", async ({
    page,
  }, testInfo) => {
    await signInAsAdmin(page, testInfo);
    await page.goto("/vi/admin/settings");
    await expect(page).toHaveURL(/\/vi\/admin\/settings\/email$/);

    await expect(page.getByRole("heading", { level: 1, name: "Cài đặt" })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Mục cài đặt" }).getByRole("link", { name: "Email" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(page.getByText("Đang dùng SMTP")).toBeVisible();
    await expect(page.getByLabel("Host")).toHaveValue("smtp.example.com");
    await expect(page.getByLabel("Mật khẩu")).toHaveAttribute(
      "placeholder",
      "Đã lưu · để trống để giữ nguyên",
    );
    await expect(page.getByText("Cập nhật lần cuối lúc 14:20, 19/10/2026")).toBeVisible();
    const save = page.getByRole("button", { name: "Lưu thay đổi" });
    await expect(save).toBeDisabled();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByLabel("Tên người gửi"))).fill("Second Bite Tasco");
    await expect(page.getByText("Bạn có thay đổi chưa lưu")).toBeVisible();
    await save.click();

    await expect(page.getByText("Đã lưu cấu hình email")).toBeVisible();
    await expect(page.getByLabel("Tên người gửi")).toHaveValue("Second Bite Tasco");
    await expect(save).toBeDisabled();
  });

  test("a change of server asks for the password again", async ({ page }, testInfo) => {
    await signInAsAdmin(page, testInfo);
    await page.goto("/vi/admin/settings/email");

    await (await hydrated(page.getByLabel("Host"))).fill("smtp2.example.com");
    const dropped = "Đã đổi máy chủ nên mật khẩu đã lưu sẽ bị xoá. Nhập mật khẩu cho máy chủ mới.";
    await expect(page.getByText(dropped)).toBeVisible();
    await expect(page.getByLabel("Mật khẩu")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByRole("button", { name: "Gửi email thử" })).toBeDisabled();
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByLabel("Mật khẩu")).toBeFocused();
    await expect(page.getByText("Đã lưu cấu hình email")).toHaveCount(0);

    await page.getByLabel("Mật khẩu").fill("the new password");
    await expect(page.getByText(dropped)).toHaveCount(0);
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByText("Đã lưu cấu hình email")).toBeVisible();
  });

  test("a test email goes to oneself or to another mailbox, and says why it failed", async ({
    page,
  }, testInfo) => {
    const email = await signInAsAdmin(page, testInfo);
    await page.goto("/vi/admin/settings/email");

    const to = page.getByLabel("Gửi tới");
    await expect(to).toHaveValue(email);
    await (await hydrated(page.getByRole("button", { name: "Gửi email thử" }))).click();
    await expect(page.getByText(`Đã gửi email thử tới ${email}`)).toBeVisible();

    await to.fill("bep.refused@example.com");
    await page.getByRole("button", { name: "Gửi email thử" }).click();
    await expect(page.getByText("Không gửi được tới bep.refused@example.com")).toBeVisible();
    await expect(page.getByText(/Nhà cung cấp email từ chối gửi/)).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("a save over someone else's says so and keeps the change", async ({ page }, testInfo) => {
    await signInAsAdmin(page, testInfo);
    await page.goto("/vi/admin/settings/email");
    await (await hydrated(page.getByLabel("Tên người gửi"))).fill("Mine");

    // Another admin saves in between, at the version the page read.
    const read = await page.request.get("/api/admin/email-settings");
    const theirs = await page.request.put("/api/admin/email-settings", {
      headers: { "If-Match": read.headers().etag },
      data: { ...(await read.json()), senderName: "Theirs" },
    });
    expect(theirs.status()).toBe(204);

    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByText("Người khác vừa lưu cấu hình email")).toBeVisible();
    await expect(page.getByLabel("Tên người gửi")).toHaveValue("Mine");

    await page.getByRole("button", { name: "Tải lại" }).click();
    await expect(page.getByLabel("Tên người gửi")).toHaveValue("Theirs");
  });

  test("the first settings are saved from an empty form", async ({ page }, testInfo) => {
    await signInAsAdmin(page, testInfo, "unset");
    await page.goto("/vi/admin/settings/email");

    await expect(page.getByText("Chưa cấu hình")).toBeVisible();
    await expect(page.getByText("Chưa lưu lần nào")).toBeVisible();
    await expect(page.getByRole("button", { name: "Gửi email thử" })).toBeDisabled();

    await (await hydrated(page.getByRole("button", { name: "Lưu cấu hình" }))).click();
    await expect(page.getByText("Nhập một địa chỉ email hợp lệ.")).toBeVisible();
    await expect(page.getByLabel("Địa chỉ gửi")).toBeFocused();
    await expectNoSeriousA11yViolations(page);

    await page.getByLabel("Địa chỉ gửi").fill("noreply@example.com");
    await page.getByLabel("Tên người gửi").fill("Second Bite");
    await page.getByLabel("Host").fill("smtp.example.com");
    await page.getByRole("button", { name: "Lưu cấu hình" }).click();

    await expect(page.getByText("Đã lưu cấu hình email")).toBeVisible();
    await expect(page.getByText("Đang dùng SMTP")).toBeVisible();
  });
});
