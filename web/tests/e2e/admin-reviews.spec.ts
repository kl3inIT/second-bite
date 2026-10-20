import { expect, test } from "@playwright/test";

import { adminSidebar, openAdminMenu, signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

// SEC-62 › Reviews (Figma AD-DG1 to AD-DG3). No module keeps reviews yet, so the list is empty; the list with
// sample reviews is checked in reviews-render.test.ts.
test("the reviews are empty on each tab until a module keeps them", async ({
  page,
  isMobile,
}, testInfo) => {
  await signInTo(page, "/admin/reviews", testInfo, { who: "danhgia" });

  await expect(page.getByRole("heading", { level: 1, name: "Đánh giá" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("navigation", { name: "Đường dẫn" })).toContainText("Vận hành");
  const tabs = page.getByRole("navigation", { name: "Đánh giá theo trạng thái" });
  await expect(tabs.getByRole("link", { name: "Tất cả" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("searchbox", { name: "Tìm đánh giá" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: /Số sao/ })).toBeVisible();
  await expect(page.getByRole("combobox", { name: /Cửa hàng/ })).toBeVisible();
  await expect(page.getByText("Chưa có đánh giá nào")).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  await (await hydrated(tabs.getByRole("link", { name: "Bị báo cáo" }))).click();
  await expect(page).toHaveURL(/\/vi\/admin\/reviews\?tab=reported$/);
  await expect(page.getByText("Không có đánh giá bị báo cáo")).toBeVisible();

  if (isMobile) await openAdminMenu(page);
  await expect(adminSidebar(page).getByRole("link", { name: "Đánh giá" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});
