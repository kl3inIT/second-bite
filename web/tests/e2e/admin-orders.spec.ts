import { expect, test } from "@playwright/test";

import { signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

// SEC-62 › Orders (Figma AD-DH1 to AD-DH5). SEC-15 has not built the orders yet, so the pages show their empty
// and not-found states; the screens with sample orders are checked by the unit tests in features/admin/orders.
test.describe("the admin's orders", () => {
  test("the list is empty until SEC-15, with its cards, filters and table", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/admin/orders", testInfo, { who: "don" });

    await expect(page.getByRole("heading", { level: 1, name: "Đơn hàng" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const crumbs = page.getByRole("navigation", { name: "Đường dẫn" });
    await expect(crumbs).toContainText("Vận hành");
    await expect(crumbs).toContainText("Đơn hàng");

    const cards = page.getByRole("navigation", { name: "Đơn theo trạng thái" });
    await expect(cards.getByRole("link", { name: /Đã nhận hôm nay\s*—/ })).toBeVisible();
    await expect(cards.getByRole("link", { name: /Khách không đến\s*—/ })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Tìm đơn" })).toBeVisible();
    await expect(page.getByRole("table", { name: "Danh sách đơn hàng" })).toBeVisible();
    await expect(page.getByText("Chưa có đơn nào")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("a card filters the list by its state through the address", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/orders", testInfo, { who: "the" });

    const cards = page.getByRole("navigation", { name: "Đơn theo trạng thái" });
    await (await hydrated(cards.getByRole("link", { name: /Khách không đến/ }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/orders\?status=expired$/);
    await expect(cards.getByRole("link", { name: /Khách không đến/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect(page.getByText("Trạng thái:")).toBeVisible();
    await expect(page.getByText("Hết hạn", { exact: true })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("the search reads and writes ?q=, as an account's page links here with its email", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/admin/orders?q=khach%40example.com", testInfo, { who: "tim" });

    const search = await hydrated(page.getByRole("searchbox", { name: "Tìm đơn" }));
    await expect(search).toHaveValue("khach@example.com");
    await search.fill("SB-24817");
    await expect(page).toHaveURL(/\/vi\/admin\/orders\?q=SB-24817$/);
    await search.fill("");
    await expect(page).toHaveURL(/\/vi\/admin\/orders$/);
  });

  test("an order that does not exist gets the admin's not-found page", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/admin/orders/SB-24817", testInfo, { who: "ma" });

    await expect(
      page.getByRole("heading", { level: 1, name: "Không tìm thấy trang này" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Về Tổng quan", exact: true })).toBeVisible();
    // The not-found page carries the layout's robots line and its own; both say noindex.
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
    await expectNoSeriousA11yViolations(page);
  });
});
