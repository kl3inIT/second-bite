import { expect, type Page, type TestInfo } from "@playwright/test";

import { hydrated } from "./hydration";

/**
 * Whether an admin page is released (src/features/admin/pages.ts). A page that is not shows "Sắp ra mắt", so its
 * own tests skip themselves with `test.skip(!isReleased("orders"), …)` and run again once its flag is on.
 */
export { isReleased } from "../../src/features/admin/pages";

/**
 * Signs in with the stub's right code as `who`, then lands on `path` (an admin address without the language,
 * "/admin/sellers"). An address starting with "admin." is an admin in the stub (stub-backend.mjs); pass
 * `admin: false` for a customer. Each test gets its own address, so tests running side by side keep their own
 * sessions.
 */
export async function signInTo(
  page: Page,
  path: string,
  testInfo: TestInfo,
  { who = "quantri", admin = true }: { who?: string; admin?: boolean } = {},
) {
  const email = `${admin ? "admin." : ""}${who}.${testInfo.project.name}@example.com`;
  await page.goto(`/vi/sign-in?returnTo=${encodeURIComponent(path)}`);
  await (await hydrated(page.getByLabel("Email"))).fill(email);
  await page.getByRole("button", { name: "Gửi mã" }).click();
  await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
  await page.waitForURL((url) => !url.pathname.includes("/sign-in"));
  await expect(page).toHaveURL(new RegExp(`/vi${path.replace(/[?]/g, "\\?")}`));
  return email;
}

/** The admin's sidebar on a wide screen; on a phone open it first with `openAdminMenu`. */
export function adminSidebar(page: Page) {
  return page.locator('[data-sidebar="sidebar"]').filter({ visible: true });
}

/** Opens the sidebar's drawer on a phone. */
export async function openAdminMenu(page: Page) {
  await (await hydrated(page.getByRole("button", { name: "Menu quản trị" }))).click();
  await expect(page.getByRole("dialog", { name: "Menu quản trị" })).toBeVisible();
}
