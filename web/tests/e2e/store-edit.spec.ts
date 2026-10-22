import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";
import { pinHere, TASCO_MALL } from "./pin";

test.use({ locale: "vi-VN", permissions: ["geolocation"], geolocation: TASCO_MALL });
// Each test signs in and opens a store first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

const onePixel =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

/** Signs in with the stub's right code and lands on the form that opens a store. */
async function signIn(page: Page, email: string) {
  await page.goto(`/vi/sign-in?returnTo=${encodeURIComponent("/open-store")}`);
  await (await hydrated(page.getByLabel("Email"))).fill(email);
  await page.getByRole("button", { name: "Gửi mã" }).click();
  await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
  await page.waitForURL((url) => !url.pathname.includes("/sign-in"));
}

/** Fills the open-store form, pins the store where the person stands and opens it; lands on its home. */
async function openStore(page: Page, name: string) {
  await (await hydrated(page.getByLabel("Tên quán"))).fill(name);
  await page.getByLabel("Số điện thoại").fill("0912345678");
  await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall, Long Biên");
  await pinHere(page);
  await page.getByRole("button", { name: "Tạo quán" }).click();
  await expect(page).toHaveURL(/\/vi\/stores\/se-\d-/, { timeout: 20_000 });
}

// SEC-141 › The owner changes the store's name, phone number and photo.
test.describe("editing a store", () => {
  test("the owner reaches the page from the store menu and saves a new name and photo", async ({
    page,
  }, testInfo) => {
    await signIn(page, `sua.${testInfo.project.name}@example.com`);
    await openStore(page, "Quán Cũ");

    await page.getByRole("button", { name: "Quán Cũ", exact: true }).click();
    await page.getByRole("menuitem", { name: "Sửa quán" }).click();
    await expect(page).toHaveURL(/\/vi\/stores\/se-\d-[\w-]+\/edit$/);
    await expect(page.getByRole("heading", { level: 1, name: "Sửa quán" })).toBeVisible();
    // The form that opened the store stays in a hidden tree of the router; the roles read only what is shown.
    const name = page.getByRole("textbox", { name: "Tên quán" });
    const phone = page.getByRole("textbox", { name: "Số điện thoại" });
    await expect(name).toHaveValue("Quán Cũ");
    await expect(phone).toHaveValue("0912345678");
    // The address and the pin are fields of the same form, as when the store was opened.
    await expect(page.locator("form:visible").getByLabel("Địa chỉ quán")).not.toHaveValue("");
    await expectNoSeriousA11yViolations(page);

    // A phone number that is none is said under its field before anything is sent.
    await name.fill("Quán Mới");
    await phone.fill("abc");
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(
      page.getByText("Nhập số điện thoại 9 đến 15 chữ số, ví dụ 0912 345 678."),
    ).toBeVisible();

    await phone.fill("0987654321");
    await page
      .locator("form:visible")
      .getByLabel("Ảnh đại diện quán")
      .setInputFiles({
        name: "quan.png",
        mimeType: "image/png",
        buffer: Buffer.from(onePixel, "base64"),
      });
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page).toHaveURL(/\/vi\/stores\/se-\d-[\w-]+$/, { timeout: 20_000 });
    await expect(page.getByRole("button", { name: "Quán Mới", exact: true })).toBeVisible();
  });

  test("the stores' list has an edit button for a store of the owner", async ({
    page,
  }, testInfo) => {
    // With one store the list is skipped, so the owner has two.
    await signIn(page, `danh.${testInfo.project.name}@example.com`);
    await openStore(page, "Quán Một");
    await page.goto("/vi/open-store");
    await openStore(page, "Quán Hai");
    await page.goto("/vi/stores");
    await page.getByRole("link", { name: "Sửa quán Quán Một" }).click();
    await expect(page).toHaveURL(/\/vi\/stores\/se-\d-[\w-]+\/edit$/);
  });
});
