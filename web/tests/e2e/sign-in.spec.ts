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
    await expect(
      page.getByRole("heading", { level: 1, name: "Đăng nhập để đặt món" }),
    ).toBeVisible();
    // Google is not configured in the stub, so its button and the divider are not shown.
    await expect(page.getByText("hoặc dùng email")).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByLabel("Email"))).fill(email);
    await page.getByRole("button", { name: "Gửi mã" }).click();

    await expect(
      page.getByRole("heading", { level: 1, name: "Kiểm tra email của bạn" }),
    ).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();
    await expect(page.getByText(/Gửi lại mã sau 0:\d\d/)).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByLabel("Mã 6 số trong email").fill("111111");
    await expect(
      page.getByText("Mã chưa đúng. Xem lại email mới nhất rồi nhập lại."),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByLabel("Mã 6 số trong email").fill("123456");
    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
    const account = page.getByRole("button", { name: `Tài khoản ${email}` });
    await expect(account).toBeVisible();

    await account.click();
    await page.getByRole("menuitem", { name: "Đăng xuất" }).click();
    await expect(page.getByRole("link", { name: "Đăng nhập" })).toBeVisible();
    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
  });

  test("says what is wrong with an address", async ({ page }) => {
    await page.goto("/vi/sign-in");
    await (await hydrated(page.getByLabel("Email"))).fill("limit@example.com");
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await expect(
      page.getByText("Bạn đã xin quá nhiều mã cho email này. Đợi một lúc rồi thử lại."),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: "Đăng nhập để đặt món" }),
    ).toBeVisible();
  });

  test("goes home instead of to another site", async ({ page }, testInfo) => {
    await page.goto("/vi/sign-in?returnTo=//evil.example/");
    await (
      await hydrated(page.getByLabel("Email"))
    ).fill(`binh.${testInfo.project.name}@example.com`);
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await page.getByLabel("Mã 6 số trong email").fill("123456");
    await expect(page).toHaveURL(/\/vi$/);
  });
});
