import { expect, test } from "@playwright/test";

import { isReleased, signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);
// The page shows "Sắp ra mắt" until its backend exists (pages.ts); these run again once it is released.
test.skip(!isReleased("payments"), "not released yet");

// SEC-62 › Payments and refunds (Figma AD-HT1 to AD-HT7). SEC-18 has not built payments yet, so both tabs
// show their empty state; the tables, sheets and dialogs with sample data are checked by the unit tests in
// features/admin/payments.
test.describe("the admin's payments and refunds", () => {
  test("the transactions tab is empty until SEC-18", async ({ page }, testInfo) => {
    await signInTo(page, "/admin/payments", testInfo, { who: "tien" });

    await expect(
      page.getByRole("heading", { level: 1, name: "Thanh toán & Hoàn tiền" }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
    const tabs = page.getByRole("navigation", { name: "Thanh toán và hoàn tiền" });
    await expect(tabs.getByRole("link", { name: "Giao dịch" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const cards = page.getByRole("navigation", { name: "Giao dịch theo trạng thái" });
    await expect(cards.getByRole("link", { name: /Không khớp\s*—/ })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Tìm giao dịch" })).toBeVisible();
    await expect(page.getByRole("table", { name: "Danh sách giao dịch" })).toBeVisible();
    await expect(page.getByText("Chưa có giao dịch nào")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("the refunds tab opens from its tab and is empty until SEC-18", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/admin/payments", testInfo, { who: "hoan" });

    const tabs = page.getByRole("navigation", { name: "Thanh toán và hoàn tiền" });
    await (await hydrated(tabs.getByRole("link", { name: "Hoàn tiền" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/payments\?tab=refunds$/);
    await expect(tabs.getByRole("link", { name: "Hoàn tiền" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const cards = page.getByRole("navigation", { name: "Yêu cầu theo trạng thái" });
    await expect(cards.getByRole("link", { name: /Chờ duyệt\s*—/ })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Tìm yêu cầu" })).toBeVisible();
    await expect(page.getByText("Chưa có yêu cầu hoàn tiền nào")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(cards.getByRole("link", { name: /Chờ duyệt/ }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/payments\?tab=refunds&status=pending$/);
    await expect(cards.getByRole("link", { name: /Chờ duyệt/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  test("an address naming a transaction that does not exist opens no sheet", async ({
    page,
  }, testInfo) => {
    await signInTo(page, "/admin/payments?transaction=GD-1045", testInfo, { who: "gd" });

    await expect(page.getByText("Chưa có giao dịch nào")).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
