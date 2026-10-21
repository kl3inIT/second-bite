import { expect, test } from "@playwright/test";

import { adminSidebar, isReleased, openAdminMenu, signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);
// The page shows "Sắp ra mắt" until its backend exists (pages.ts); these run again once it is released.
test.skip(!isReleased("offers"), "not released yet");

// SEC-62 › Every post (Figma AD-BD1 to AD-BD4). The offer module has no admin list across stores yet, so the list
// is empty and the cards have no figure; the list and the panel with sample posts are checked in
// offers-render.test.ts.
test("every post is empty until the offer module lists them for an admin", async ({
  page,
  isMobile,
}, testInfo) => {
  await signInTo(page, "/admin/offers", testInfo, { who: "baidang" });

  await expect(page.getByRole("heading", { level: 1, name: "Bài đăng" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("navigation", { name: "Vị trí trang" })).toContainText("Vận hành");
  const cards = page.getByRole("navigation", { name: "Bài đăng theo trạng thái" });
  for (const name of ["Đang bán", "Hết hàng", "Đã đóng", "Đã gỡ", "Gỡ do vi phạm"]) {
    await expect(cards.getByRole("link", { name: new RegExp(`^${name}`) })).toBeVisible();
  }
  await expect(page.getByRole("searchbox", { name: "Tìm bài đăng" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: /Danh mục/ })).toBeVisible();
  await expect(page.getByText("Chưa có bài đăng nào")).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  await (await hydrated(cards.getByRole("link", { name: /^Gỡ do vi phạm/ }))).click();
  await expect(page).toHaveURL(/\/vi\/admin\/offers\?status=removed$/);
  await expect(cards.getByRole("link", { name: /^Gỡ do vi phạm/ })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(page.getByText("Chưa có bài đăng nào")).toBeVisible();

  if (isMobile) await openAdminMenu(page);
  await expect(adminSidebar(page).getByRole("link", { name: "Bài đăng" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});
