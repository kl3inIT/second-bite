import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

/** A username that no earlier test, retry or project of this run has made. */
function newUsername(prefix: string) {
  return `${prefix}.${Date.now().toString(36)}`;
}

// SEC-29 › Verification plan › On the web. The stub backend takes 123456 as the right code. Since SEC-193 the
// sign-in screen opens on a username and a password; the emailed code is on a screen of its own.
test.describe("signing in with the emailed code on the web", () => {
  test("from the sign-in screen's email link, back to the page that asked, then out again", async ({
    page,
  }, testInfo) => {
    const email = `an.${testInfo.project.name}@example.com`;
    await page.goto("/vi?kind=bakery");
    await (await hydrated(page.getByRole("link", { name: "Đăng nhập" }))).click();

    await expect(page).toHaveURL(/\/vi\/sign-in\?returnTo=/);
    await expect(page.getByRole("heading", { level: 1, name: "Đăng nhập" })).toBeVisible();
    await (await hydrated(page.getByRole("link", { name: "Đăng nhập bằng email" }))).click();

    await expect(page).toHaveURL(/\/vi\/sign-in\/email\?returnTo=/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Đăng nhập bằng email" }),
    ).toBeVisible();
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
    await page.goto("/vi/sign-in/email");
    const field = await hydrated(page.getByLabel("Email"));
    await field.fill("an@");
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await expect(page.getByText("Nhập một địa chỉ email, ví dụ ten@gmail.com.")).toBeVisible();
    await expect(field).toBeFocused();
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(
      page.getByRole("heading", { level: 1, name: "Đăng nhập bằng email" }),
    ).toBeVisible();
  });

  test("says what is wrong with an address", async ({ page }) => {
    await page.goto("/vi/sign-in/email");
    await (await hydrated(page.getByLabel("Email"))).fill("limit@example.com");
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await expect(
      page.getByText("Bạn đã xin quá nhiều mã cho email này. Đợi một lúc rồi thử lại."),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: "Đăng nhập bằng email" }),
    ).toBeVisible();
  });

  // SEC-28: the words are the server's, in the page's language, whatever the browser's own.
  test("says it in English on the English page", async ({ page }) => {
    await page.goto("/en/sign-in/email");
    await (await hydrated(page.getByLabel("Email"))).fill("limit@example.com");
    await page.getByRole("button", { name: "Send code" }).click();
    await expect(
      page.getByText("Too many codes were asked for this address. Wait before asking again."),
    ).toBeVisible();
  });

  test("goes home instead of to another site", async ({ page }, testInfo) => {
    await page.goto("/vi/sign-in/email?returnTo=//evil.example/");
    await (
      await hydrated(page.getByLabel("Email"))
    ).fill(`binh.${testInfo.project.name}@example.com`);
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
    await expect(page).toHaveURL(/\/vi$/);
  });

  test("leads back to the username and password screen", async ({ page }) => {
    await page.goto("/vi/sign-in/email?returnTo=%2Fcart");
    await (
      await hydrated(page.getByRole("link", { name: "Đăng nhập bằng tên đăng nhập" }))
    ).click();
    await expect(page).toHaveURL(/\/vi\/sign-in\?returnTo=%2Fcart$/);
    await expect(page.getByRole("heading", { level: 1, name: "Đăng nhập" })).toBeVisible();
  });

  // SEC-188: six 56 px boxes do not fit a 390 px iPhone's form; on a narrow phone they share its width.
  test("fits the code's six boxes on a narrow phone", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/vi/sign-in/email");
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

// SEC-193 › Verification plan › Web. The stub backend has the account lan.anh with the password "correct horse";
// "limit.user" has used its tries, and a username already made is taken.
test.describe("signing in with a username and a password on the web", () => {
  test("back to the page that asked, then out again", async ({ page }) => {
    await page.goto("/vi/sign-in?returnTo=%2F%3Fkind%3Dbakery");

    await expect(page.getByRole("heading", { level: 1, name: "Đăng nhập" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Đăng nhập bằng email" })).toHaveAttribute(
      "href",
      "/vi/sign-in/email?returnTo=%2F%3Fkind%3Dbakery",
    );
    await expect(page.getByRole("link", { name: "Đăng ký" })).toHaveAttribute(
      "href",
      "/vi/register?returnTo=%2F%3Fkind%3Dbakery",
    );
    // Google is not configured in the stub, so its button is not shown.
    await expect(page.getByText("Tiếp tục với Google")).toHaveCount(0);
    // The screen fills the phone under its own top bar: the bottom bar of the shop is not there.
    await expect(page.getByRole("link", { name: "Đơn của tôi" })).toHaveCount(0);
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });

    await (await hydrated(page.getByLabel("Tên đăng nhập"))).fill("lan.anh");
    await page.getByLabel("Mật khẩu").fill("correct horse");
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();

    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
    const account = page.getByRole("button", { name: "Tài khoản lan.anh" });
    await expect(account).toBeVisible();

    await account.click();
    await page.getByRole("menuitem", { name: "Đăng xuất" }).click();
    await expect(page.getByRole("link", { name: "Đăng nhập" })).toBeVisible();
  });

  test("says a wrong password in one sentence, and does not keep it", async ({ page }) => {
    await page.goto("/vi/sign-in");
    await (await hydrated(page.getByLabel("Tên đăng nhập"))).fill("lan.anh");
    await page.getByLabel("Mật khẩu").fill("wrong password");
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();

    await expect(page.getByText("Tên đăng nhập hoặc mật khẩu chưa đúng.")).toBeVisible();
    await expect(page.getByLabel("Mật khẩu")).toHaveValue("");
    await expect(page.getByRole("heading", { level: 1, name: "Đăng nhập" })).toBeVisible();
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });

    // A name nobody has gets the same sentence, so it does not say which was wrong.
    await page.getByLabel("Tên đăng nhập").fill("nobody.here");
    await page.getByLabel("Mật khẩu").fill("wrong password");
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
    await expect(page.getByText("Tên đăng nhập hoặc mật khẩu chưa đúng.")).toBeVisible();
  });

  // A username is matched exactly: the account is lan.anh, not Lan.Anh.
  test("does not take a name in other capitals for the account", async ({ page }) => {
    await page.goto("/vi/sign-in");
    await (await hydrated(page.getByLabel("Tên đăng nhập"))).fill("Lan.Anh");
    await page.getByLabel("Mật khẩu").fill("correct horse");
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
    await expect(page.getByText("Tên đăng nhập hoặc mật khẩu chưa đúng.")).toBeVisible();
  });

  test("says when the tries are used up", async ({ page }) => {
    await page.goto("/vi/sign-in");
    await (await hydrated(page.getByLabel("Tên đăng nhập"))).fill("limit.user");
    await page.getByLabel("Mật khẩu").fill("whatever it is");
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
    await expect(
      page.getByText("Bạn đã nhập sai quá nhiều lần. Đợi một lúc rồi thử lại."),
    ).toBeVisible();
  });

  test("asks for both fields before sending, under the field", async ({ page }) => {
    await page.goto("/vi/sign-in");
    const username = await hydrated(page.getByLabel("Tên đăng nhập"));
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
    await expect(page.getByText("Nhập tên đăng nhập.")).toBeVisible();
    await expect(page.getByText("Nhập mật khẩu.")).toBeVisible();
    await expect(username).toBeFocused();
    await expect(username).toHaveAttribute("aria-invalid", "true");
  });

  // SEC-28: the words are the server's, in the page's language.
  test("says it in English on the English page", async ({ page }) => {
    await page.goto("/en/sign-in");
    await (await hydrated(page.getByLabel("Username"))).fill("lan.anh");
    await page.getByLabel("Password").fill("wrong password");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page.getByText("The username or the password is not right.")).toBeVisible();
  });

  test("goes home instead of to another site", async ({ page }) => {
    await page.goto("/vi/sign-in?returnTo=//evil.example/");
    await (await hydrated(page.getByLabel("Tên đăng nhập"))).fill("lan.anh");
    await page.getByLabel("Mật khẩu").fill("correct horse");
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
    await expect(page).toHaveURL(/\/vi$/);
  });
});

// SEC-193 › Verification plan › Web: the register screen, Figma L10.
test.describe("making an account on the web", () => {
  test("a username and a password twice, signed in at once and back to the page that asked", async ({
    page,
  }) => {
    // Capitals are kept as typed: the account is named by them.
    const username = newUsername("Moi");
    await page.goto("/vi/register?returnTo=%2F%3Fkind%3Dbakery");

    await expect(page.getByRole("heading", { level: 1, name: "Tạo tài khoản" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Đăng nhập", exact: true })).toHaveAttribute(
      "href",
      "/vi/sign-in?returnTo=%2F%3Fkind%3Dbakery",
    );
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });

    await (await hydrated(page.getByLabel("Tên đăng nhập"))).fill(username);
    await page.getByLabel("Mật khẩu", { exact: true }).fill("a long password");
    await page.getByLabel("Nhập lại mật khẩu").fill("a long password");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();

    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
    await expect(page.getByRole("button", { name: `Tài khoản ${username}` })).toBeVisible();
  });

  test("says what is wrong before sending, under the field", async ({ page }) => {
    await page.goto("/vi/register");
    const username = await hydrated(page.getByLabel("Tên đăng nhập"));

    await username.fill("ab");
    await page.getByLabel("Mật khẩu", { exact: true }).fill("short");
    await page.getByLabel("Nhập lại mật khẩu").fill("short");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();
    await expect(
      page.getByText(
        "Tên đăng nhập gồm 3 đến 30 ký tự: chữ không dấu, số, dấu chấm, gạch dưới hoặc gạch ngang.",
      ),
    ).toBeVisible();
    await expect(page.getByText("Mật khẩu gồm 8 đến 128 ký tự.")).toBeVisible();
    await expect(username).toBeFocused();
    await expect(username).toHaveAttribute("aria-invalid", "true");
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });

    await username.fill(newUsername("khop"));
    await page.getByLabel("Mật khẩu", { exact: true }).fill("a long password");
    await page.getByLabel("Nhập lại mật khẩu").fill("another long password");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();
    await expect(page.getByText("Mật khẩu nhập lại chưa khớp.")).toBeVisible();
    await expect(page.getByLabel("Nhập lại mật khẩu")).toBeFocused();
  });

  test("says a username is taken, under the username, in the server's words", async ({ page }) => {
    await page.goto("/vi/register");
    const username = await hydrated(page.getByLabel("Tên đăng nhập"));
    await username.fill("lan.anh");
    await page.getByLabel("Mật khẩu", { exact: true }).fill("a long password");
    await page.getByLabel("Nhập lại mật khẩu").fill("a long password");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();

    await expect(
      page.getByText("Tên đăng nhập này đã có người dùng. Chọn một tên khác."),
    ).toBeVisible();
    await expect(username).toBeFocused();
    await expect(username).toHaveAttribute("aria-invalid", "true");
  });

  test("says it in English on the English page", async ({ page }) => {
    await page.goto("/en/register");
    await (await hydrated(page.getByLabel("Username"))).fill("lan.anh");
    await page.getByLabel("Password", { exact: true }).fill("a long password");
    await page.getByLabel("Confirm the password").fill("a long password");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("This username is taken. Choose another.")).toBeVisible();
  });
});
