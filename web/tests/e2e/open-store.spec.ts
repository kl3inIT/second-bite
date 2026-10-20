import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

/** Signs in with the stub's right code and lands on `returnTo`. */
async function signIn(page: Page, email: string, returnTo: string) {
  await page.goto(`/vi/sign-in?returnTo=${encodeURIComponent(returnTo)}`);
  await (await hydrated(page.getByLabel("Email"))).fill(email);
  await page.getByRole("button", { name: "Gửi mã" }).click();
  await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
}

// SEC-57 › Open a store (Figma O1, O1b, S0).
test.describe("opening a store on the web", () => {
  test("someone not signed in signs in first and comes back to the form", async ({
    page,
  }, testInfo) => {
    await page.goto("/vi/open-store");
    await expect(page).toHaveURL(/\/vi\/sign-in\?returnTo=%2Fopen-store$/);

    await (
      await hydrated(page.getByLabel("Email"))
    ).fill(`lan.${testInfo.project.name}@example.com`);
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
    await expect(page).toHaveURL(/\/vi\/open-store$/);
    await expect(page.getByRole("heading", { level: 1, name: "Mở quán của bạn" })).toBeVisible();
  });

  test("opens a store and lists it", async ({ page }, testInfo) => {
    await signIn(page, `mai.${testInfo.project.name}@example.com`, "/stores");
    await expect(page.getByRole("heading", { level: 1, name: "Bạn chưa có quán" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("link", { name: "Tạo quán mới" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Mở quán của bạn" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByLabel("Tên quán"))).fill("Tiệm bánh Pháp");
    await page.getByLabel("Số điện thoại").fill("123");
    await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall, Long Biên");
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(
      page.getByText("Nhập số điện thoại 9 đến 15 chữ số, ví dụ 0912 345 678."),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByLabel("Số điện thoại").fill("0912 345 678");
    await page.getByRole("button", { name: "Tạo quán" }).click();

    await expect(page).toHaveURL(/\/vi\/stores$/);
    await expect(page.getByRole("heading", { level: 1, name: "Quán của tôi" })).toBeVisible();
    await expect(page.getByText("Tiệm bánh Pháp")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("stops at five stores", async ({ page }, testInfo) => {
    await signIn(page, `huy.${testInfo.project.name}@example.com`, "/open-store");
    for (let n = 1; n <= 5; n++) {
      await (await hydrated(page.getByLabel("Tên quán"))).fill(`Quán ${n}`);
      await page.getByLabel("Số điện thoại").fill("0912345678");
      await page.getByLabel("Địa chỉ quán").fill("Tasco Mall");
      await page.getByRole("button", { name: "Tạo quán" }).click();
      await expect(page).toHaveURL(/\/vi\/stores$/);
      if (n < 5) await page.goto("/vi/open-store");
    }
    await expect(page.getByRole("link", { name: "Tạo quán mới" })).toHaveCount(0);

    await page.goto("/vi/open-store");
    await (await hydrated(page.getByLabel("Tên quán"))).fill("Quán 6");
    await page.getByLabel("Số điện thoại").fill("0912345678");
    await page.getByLabel("Địa chỉ quán").fill("Tasco Mall");
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(page.getByText("Bạn đã có đủ 5 quán. Hãy dùng một trong số đó.")).toBeVisible();
  });
});
