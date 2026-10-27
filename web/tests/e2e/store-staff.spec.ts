import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";
import { pinHere, TASCO_MALL } from "./pin";

test.use({ locale: "vi-VN", permissions: ["geolocation"], geolocation: TASCO_MALL });
// Each test signs in and opens a store first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

/** Signs in with the stub's right code and opens a store of that name; answers its identifier. */
async function openStore(page: Page, email: string, name: string) {
  await page.goto(`/vi/sign-in?returnTo=${encodeURIComponent("/open-store")}`);
  await (await hydrated(page.getByLabel("Email"))).fill(email);
  await page.getByRole("button", { name: "Gửi mã" }).click();
  await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
  await (await hydrated(page.getByLabel("Tên quán"))).fill(name);
  await page.getByLabel("Số điện thoại").fill("0912345678");
  await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall");
  await pinHere(page);
  await page.getByRole("button", { name: "Tạo quán" }).click();
  await expect(page).toHaveURL(/\/vi\/stores\/se-1-/, { timeout: 20_000 });
  return page.url().split("/").pop() ?? "";
}

// SEC-162 › the store's people (Figma N1, N2, N1m): the owner adds staff by email and removes them.
test("the owner adds staff from the store menu and removes them", async ({ page }, testInfo) => {
  const owner = `chu.nv.${testInfo.project.name}@example.com`;
  const staff = `hoa.le.${testInfo.project.name}@example.com`;
  await openStore(page, owner, "Tiệm Bánh Hoa");

  await (await hydrated(page.getByRole("button", { name: "Tiệm Bánh Hoa", exact: true }))).click();
  await page.getByRole("menuitem", { name: "Nhân viên", exact: true }).click();
  await expect(page).toHaveURL(/\/vi\/stores\/se-1-[\w-]+\/staff$/);
  await expect(page.getByRole("heading", { level: 1, name: "Nhân viên của quán" })).toBeVisible();
  const people = page.getByRole("region", { name: /^Người trong quán/ });
  await expect(people.getByRole("heading", { name: "Người trong quán · 1" })).toBeVisible();
  await expect(people.getByText(`${owner} (bạn)`)).toBeVisible();
  await expect(people.getByText("Chủ quán")).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  // An address is checked before it is sent.
  const add = await hydrated(page.getByRole("button", { name: "Thêm nhân viên" }));
  await page.getByLabel("Email nhân viên").fill("không phải email");
  await add.click();
  await expect(page.getByText("Nhập một địa chỉ email, ví dụ ten@example.com.")).toBeVisible();

  await page.getByLabel("Email nhân viên").fill(staff);
  await add.click();
  await expect(page.getByText(`Đã thêm ${staff} vào quán.`)).toBeVisible();
  await expect(people.getByRole("heading", { name: "Người trong quán · 2" })).toBeVisible();
  await expect(people.getByRole("listitem").filter({ hasText: staff })).toHaveCount(1);
  await expect(page.getByLabel("Email nhân viên")).toHaveValue("");

  // Removing asks first (N2).
  await people.getByRole("button", { name: `Xoá ${staff}` }).click();
  const dialog = page.getByRole("alertdialog", { name: `Xoá ${staff} khỏi quán?` });
  await expect(dialog).toBeVisible();
  await expectNoSeriousA11yViolations(page);
  await dialog.getByRole("button", { name: "Xoá khỏi quán" }).click();
  await expect(page.getByText(`Đã xoá ${staff} khỏi quán.`)).toBeVisible();
  await expect(people.getByRole("heading", { name: "Người trong quán · 1" })).toBeVisible();
});

// SEC-162 › the page as staff see it (Figma N3): the list without the form, and leaving the store.
test("staff see who works at the store and leave it", async ({ page, browser }, testInfo) => {
  const owner = `chu.roi.${testInfo.project.name}@example.com`;
  const staff = `tuan.pham.${testInfo.project.name}@example.com`;
  const storeId = await openStore(page, owner, "Tiệm có người rời");
  const added = await page.request.post(`/api/sellers/${storeId}/members`, {
    data: { email: staff },
  });
  expect(added.status()).toBe(201);

  const context = await browser.newContext({ ...testInfo.project.use, locale: "vi-VN" });
  const other = await context.newPage();
  await other.goto(`/vi/sign-in?returnTo=${encodeURIComponent(`/stores/${storeId}/staff`)}`);
  await (await hydrated(other.getByLabel("Email"))).fill(staff);
  await other.getByRole("button", { name: "Gửi mã" }).click();
  await other.getByLabel("Mã đăng nhập 6 số").fill("123456");
  await expect(other).toHaveURL(new RegExp(`/vi/stores/${storeId}/staff$`), { timeout: 20_000 });

  const people = other.getByRole("region", { name: /^Người trong quán/ });
  await expect(people.getByText(owner)).toBeVisible();
  await expect(people.getByText(`${staff} (bạn)`)).toBeVisible();
  // On a phone the pushed bar names the page and goes back to the store's home.
  if (testInfo.project.name === "mobile")
    await expect(other.getByRole("link", { name: "Quay lại" })).toHaveAttribute(
      "href",
      `/vi/stores/${storeId}`,
    );
  await expect(other.getByRole("button", { name: "Thêm nhân viên" })).toHaveCount(0);
  await expectNoSeriousA11yViolations(other);

  await (await hydrated(people.getByRole("button", { name: "Rời quán" }))).click();
  const dialog = other.getByRole("alertdialog", { name: "Rời Tiệm có người rời?" });
  await dialog.getByRole("button", { name: "Rời quán" }).click();
  await expect(other).toHaveURL(/\/vi\/stores$/);
  await expect(other.getByText("Bạn đã rời Tiệm có người rời.")).toBeVisible();
  await context.close();
});
