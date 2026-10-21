import { expect, test } from "@playwright/test";

import { adminSidebar, openAdminMenu, signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

// SEC-62 › Access (docs: admin-web-flow › Quyền truy cập).
test.describe("who may open the admin", () => {
  test("someone not signed in signs in and comes back to the admin page", async ({
    page,
  }, testInfo) => {
    const response = await page.goto("/vi/admin/khong-co?tab=1");
    // The blank page on the way to sign in is not indexed either.
    expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    await expect(page).toHaveURL(/\/vi\/sign-in\?returnTo=%2Fadmin%2Fkhong-co%3Ftab%3D1$/);

    await (
      await hydrated(page.getByLabel("Email"))
    ).fill(`admin.lan.${testInfo.project.name}@example.com`);
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
    await expect(page).toHaveURL(/\/vi\/admin\/khong-co\?tab=1$/);
    await expect(page.getByRole("heading", { name: "Không tìm thấy trang này" })).toBeVisible();
  });

  test("someone who is not an admin gets the customer's not-found page", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/account", testInfo, { who: "khach", admin: false });
    const response = await page.goto("/vi/admin/overview");

    expect(response?.status()).toBe(404);
    await expect(page).toHaveURL(/\/vi\/admin\/overview$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Không tìm thấy trang này" }),
    ).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: "Về trang chủ" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Điều hướng quản trị" })).toHaveCount(0);
    await expect(page.getByText("Quản trị")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
    await expectNoSeriousA11yViolations(page);

    // Every admin address answers them the same, /admin itself included.
    expect((await page.goto("/vi/admin"))?.status()).toBe(404);
    expect((await page.goto("/en/admin/sellers?status=pending"))?.status()).toBe(404);
  });

  test("an admin opens /admin on the overview", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/khong-co", testInfo, { who: "mo" });
    await page.goto("/vi/admin");
    await expect(page).toHaveURL(/\/vi\/admin\/overview$/);
  });
});

// SEC-62 › The shell (Figma AD-Q1, AD-Q2, AD-TT5).
test.describe("the admin shell", () => {
  test("an admin address that answers nothing keeps the shell (AD-TT5)", async ({
    page,
    isMobile,
  }, testInfo) => {
    await signInTo(page, "/admin/khong-co", testInfo, { who: "lac" });
    const response = await page.reload();
    expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");

    const crumbs = page.getByRole("navigation", { name: "Đường dẫn" });
    await expect(crumbs).toContainText("Quản trị");
    await expect(crumbs.getByText("Không tìm thấy", { exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(
      page.getByRole("heading", { level: 1, name: "Không tìm thấy trang này" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Về Tổng quan", exact: true })).toHaveAttribute(
      "href",
      "/vi/admin/overview",
    );
    // One robots tag: the page's own, none added by the layout or by Next.js.
    await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    // The customer site's footer and bottom bar stay out of the admin.
    await expect(page.getByRole("contentinfo")).toBeHidden();
    await expect(page.getByRole("navigation", { name: "Điều hướng chính" })).toHaveCount(0);
    if (isMobile) await openAdminMenu(page);
    await expect(adminSidebar(page).getByRole("link", { name: "Cửa hàng" })).toBeVisible();
    await expect(adminSidebar(page).getByRole("link")).toHaveCount(14);
    await expectNoSeriousA11yViolations(page);
  });

  test("on a wide screen the sidebar collapses to its rail and remembers it", async ({
    page,
    isMobile,
  }, testInfo) => {
    test.skip(isMobile, "A phone has the drawer instead.");
    await signInTo(page, "/admin/khong-co", testInfo, { who: "thu" });

    await expect(adminSidebar(page).getByText("Thanh toán & Hoàn tiền")).toBeVisible();
    await (await hydrated(page.getByRole("button", { name: "Thu gọn thanh bên" }))).click();
    const expand = page.getByRole("button", { name: "Mở rộng thanh bên" });
    await expect(expand).toBeVisible();
    // The rail shows the icons; each item keeps its full name for the screen reader and in its tooltip.
    await expect(adminSidebar(page).getByText("Thanh toán & Hoàn tiền")).toBeHidden();
    await expect(
      adminSidebar(page).getByRole("link", { name: /^Thanh toán & Hoàn tiền/ }),
    ).toBeVisible();
    await expect(adminSidebar(page).getByRole("link")).toHaveCount(14);
    await expectNoSeriousA11yViolations(page);

    await page.reload();
    await expect(page.getByRole("button", { name: "Mở rộng thanh bên" })).toBeVisible();
    await (await hydrated(page.getByRole("button", { name: "Mở rộng thanh bên" }))).click();
    await expect(page.getByRole("button", { name: "Thu gọn thanh bên" })).toBeVisible();
  });

  test("on a phone the sidebar is a drawer that closes on a choice", async ({
    page,
    isMobile,
  }, testInfo) => {
    test.skip(!isMobile, "A wide screen keeps the sidebar open beside the page.");
    await signInTo(page, "/admin/khong-co", testInfo, { who: "dien" });

    await expect(adminSidebar(page)).toBeHidden();
    await openAdminMenu(page);
    await expectNoSeriousA11yViolations(page);
    await adminSidebar(page).getByRole("link", { name: "Cài đặt" }).click();
    await expect(page).toHaveURL(/\/vi\/admin\/settings/);
    await expect(adminSidebar(page)).toBeHidden();
  });

  test("the language and sign-out sit at the sidebar's foot", async ({
    page,
    isMobile,
  }, testInfo) => {
    const email = await signInTo(page, "/admin/khong-co", testInfo, { who: "ngu" });
    if (isMobile) await openAdminMenu(page);

    await expect(page.getByText(email, { exact: true }).filter({ visible: true })).toBeVisible();
    await page.getByRole("link", { name: /^Tiếng Việt/ }).click();
    await expect(page).toHaveURL(/\/en\/admin\/khong-co$/);
    await expect(page.getByRole("heading", { name: "This page was not found" })).toBeVisible();

    // On a phone the drawer may have stayed open across the change of language.
    const account = page.getByRole("button", { name: new RegExp(email) });
    if (isMobile && !(await account.isVisible())) {
      await (await hydrated(page.getByRole("button", { name: "Open the admin menu" }))).click();
    }
    // Sign-out sits in the account's menu at the sidebar's foot.
    await (await hydrated(account)).click();
    await page.getByRole("menuitem", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/en\/sign-in\?returnTo=%2Fadmin%2Fkhong-co$/);
  });
});
