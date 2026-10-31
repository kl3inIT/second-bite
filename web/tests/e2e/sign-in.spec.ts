import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

// SEC-29 › Verification plan › On the web. The stub backend takes 123456 as the right code.
test.describe("signing in on the web", () => {
  test("with the emailed code, back to the page that asked, then out again", async ({
    page,
  }, testInfo) => {
    const email = `an.${testInfo.project.name}@example.com`;
    await page.goto("/vi?kind=bakery");
    await (await hydrated(page.getByRole("link", { name: "Đăng nhập" }))).click();

    await expect(page).toHaveURL(/\/vi\/sign-in\?returnTo=/);
    await expect(page.getByRole("heading", { level: 1, name: "Đăng nhập" })).toBeVisible();
    // Google is not configured in the stub, so its button and the divider are not shown.
    await expect(page.getByText("hoặc dùng email")).toHaveCount(0);
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });

    await (await hydrated(page.getByLabel("Email"))).fill(email);
    await page.getByRole("button", { name: "Gửi mã" }).click();

    await expect(page.getByRole("heading", { level: 1, name: "Nhập mã" })).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();
    await expect(page.getByText("Gửi lại mã sau 1:00")).toBeVisible();
    await expect(page.getByText("Chưa thấy email? Xem trong thư rác (Spam).")).toBeVisible();
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });

    await page.getByLabel("Mã đăng nhập 6 số").fill("111111");
    await expect(
      page.getByText("Mã chưa đúng. Xem lại email mới nhất rồi nhập lại."),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });

    // A code copied from the email with spaces and a line break still goes in.
    await page.getByLabel("Mã đăng nhập 6 số").focus();
    await page.evaluate(() => {
      const data = new DataTransfer();
      data.setData("text/plain", " 123 456\n");
      document.activeElement?.dispatchEvent(
        new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }),
      );
    });
    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
    const account = page.getByRole("button", { name: `Tài khoản ${email}` });
    await expect(account).toBeVisible();

    await account.click();
    await page.getByRole("menuitem", { name: "Đăng xuất" }).click();
    await expect(page.getByRole("link", { name: "Đăng nhập" })).toBeVisible();
    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
  });

  test("says an address is not one before sending it, under the field", async ({ page }) => {
    await page.goto("/vi/sign-in");
    const field = await hydrated(page.getByLabel("Email"));
    await field.fill("an@");
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await expect(page.getByText("Nhập một địa chỉ email, ví dụ ten@gmail.com.")).toBeVisible();
    await expect(field).toBeFocused();
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByRole("heading", { level: 1, name: "Đăng nhập" })).toBeVisible();
  });

  test("says what is wrong with an address", async ({ page }) => {
    await page.goto("/vi/sign-in");
    await (await hydrated(page.getByLabel("Email"))).fill("limit@example.com");
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await expect(
      page.getByText("Bạn đã xin quá nhiều mã cho email này. Đợi một lúc rồi thử lại."),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Đăng nhập" })).toBeVisible();
  });

  // SEC-28: the words are the server's, in the page's language, whatever the browser's own.
  test("says it in English on the English page", async ({ page }) => {
    await page.goto("/en/sign-in");
    await (await hydrated(page.getByLabel("Email"))).fill("limit@example.com");
    await page.getByRole("button", { name: "Send code" }).click();
    await expect(
      page.getByText("Too many codes were asked for this address. Wait before asking again."),
    ).toBeVisible();
  });

  test("goes home instead of to another site", async ({ page }, testInfo) => {
    await page.goto("/vi/sign-in?returnTo=//evil.example/");
    await (
      await hydrated(page.getByLabel("Email"))
    ).fill(`binh.${testInfo.project.name}@example.com`);
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
    await expect(page).toHaveURL(/\/vi$/);
  });

  // SEC-188: six 56 px boxes do not fit a 390 px iPhone's form; on a narrow phone they share its width.
  test("fits the code's six boxes on a narrow phone", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/vi/sign-in");
    await (
      await hydrated(page.getByLabel("Email"))
    ).fill(`chi.${testInfo.project.name}@example.com`);
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Nhập mã" })).toBeVisible();

    const slots = page.locator('[data-slot="input-otp-slot"]');
    await expect(slots).toHaveCount(6);
    const last = await slots.last().boundingBox();
    expect((last?.x ?? 0) + (last?.width ?? 0)).toBeLessThanOrEqual(360 - 16);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
