import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";
import { pinHere, TASCO_MALL } from "./pin";

// SEC-157: the site's Permissions-Policy once refused the camera to its own pages, so a phone with a camera and the
// person's leave still read "Chưa mở được camera". Chromium's fake camera, allowed without its prompt, stands in for
// the phone's; the launch flags need a file of their own, since they start a browser of their own.
test.use({
  locale: "vi-VN",
  permissions: ["geolocation", "camera"],
  geolocation: TASCO_MALL,
  launchOptions: {
    args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
  },
});
// The test signs in and opens a store first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

/** `HTMLMediaElement.HAVE_CURRENT_DATA`: the video has a frame to show. */
const HAVE_CURRENT_DATA = 2;

/** Signs in with the stub's right code and opens a store of that name. */
async function openStore(page: Page, who: string, project: string, name: string) {
  await page.goto(`/vi/sign-in?returnTo=${encodeURIComponent("/open-store")}`);
  await (await hydrated(page.getByLabel("Email"))).fill(`${who}.${project}@example.com`);
  await page.getByRole("button", { name: "Gửi mã" }).click();
  await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
  await (await hydrated(page.getByLabel("Tên quán"))).fill(name);
  await page.getByLabel("Số điện thoại").fill("0912345678");
  await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall");
  await pinHere(page);
  await page.getByRole("button", { name: "Tạo quán" }).click();
  await expect(page).toHaveURL(/\/vi\/stores\/se-1-/, { timeout: 20_000 });
}

test("the order tab's scanner opens the camera the person allows", async ({ page }, testInfo) => {
  await openStore(page, "khanh", testInfo.project.name, "Tiệm có camera");
  await page.getByRole("link", { name: "Đơn", exact: true }).click();

  await page.getByRole("button", { name: "Quét mã đơn" }).click();
  const dialog = page.getByRole("dialog", { name: "Quét mã đơn" });
  await expect
    .poll(() => dialog.locator("video").evaluate((video: HTMLVideoElement) => video.readyState))
    .toBeGreaterThanOrEqual(HAVE_CURRENT_DATA);
  await expect(dialog.getByText(/Chưa mở được camera/)).toHaveCount(0);
  await expectNoSeriousA11yViolations(page);
});
