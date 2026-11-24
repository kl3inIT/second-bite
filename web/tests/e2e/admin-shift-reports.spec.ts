import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

async function signInAsAdmin(page: Page, name: string) {
  const response = await page.request.post("/api/auth/sessions", {
    data: {
      challengeId: `ch-${encodeURIComponent(`admin.${name}@example.com`)}`,
      code: "123456",
      session: "cookie",
    },
  });
  expect(response.status()).toBe(201);
}

// SEC-209 › the report by shift, on the stub's three orders a day: 07:00 and 14:00 and 14:30 in Vietnam, so the
// morning holds one, the afternoon two and the evening none.
test.describe("the admin's report by shift", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await signInAsAdmin(page, `shifts.${testInfo.project.name}.${testInfo.title.length}`);
  });

  test("the menu opens it: a tab per day, the day's summary, a table per shift with its buyers", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/vi/admin/sellers");
    if (isMobile)
      await (await hydrated(page.getByRole("button", { name: "Menu quản trị" }))).click();
    const menu = isMobile ? page.getByRole("dialog", { name: "Menu quản trị" }) : page;
    await (await hydrated(menu.getByRole("link", { name: "Báo cáo theo ca" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/shift-reports$/);
    if (isMobile) await page.keyboard.press("Escape");

    await expect(page.getByRole("heading", { level: 1, name: "Báo cáo theo ca" })).toBeVisible();
    // The last three days, one tab each, the latest open.
    await expect(page.getByRole("tab")).toHaveCount(3);
    await expect(page.getByRole("tab").last()).toHaveAttribute("aria-selected", "true");

    const summary = page.getByRole("table", { name: "Tổng hợp cả ngày" });
    await expect(summary.getByRole("row")).toHaveCount(5);
    await expect(summary.getByRole("row", { name: /Cả ngày/ })).toContainText("22");

    const morning = page.getByRole("table", { name: "Đơn của Ca sáng" });
    await expect(morning.getByRole("row")).toHaveCount(2);
    await expect(morning).toContainText("SB-20001");
    await expect(morning).toContainText("Nguyễn Văn An");
    await expect(morning).toContainText("0912345678");
    await expect(morning).toContainText("Bánh mì ×2");
    await expect(morning).toContainText("07:00");
    await expect(morning).toContainText("Đã nhận");

    const afternoon = page.getByRole("table", { name: "Đơn của Ca chiều" });
    await expect(afternoon.getByRole("row")).toHaveCount(3);
    await expect(afternoon).toContainText("Trần Thị Bình");
    await expect(afternoon).toContainText("Hết hạn");
    await expect(page.getByText("Không có đơn nào trong ca này")).toBeVisible();

    await (await hydrated(page.getByRole("tab").first())).click();
    await expect(page.getByRole("tab").first()).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("table", { name: "Đơn của Ca chiều" })).toBeVisible();

    await expectNoSeriousA11yViolations(page);
  });

  test("the export is the server's workbook of the same days and shifts", async ({ page }) => {
    await page.goto("/vi/admin/shift-reports?from=2026-11-22&to=2026-11-24");
    await expect(page.getByRole("tab")).toHaveCount(3);
    const link = page.getByRole("link", { name: "Xuất Excel" });
    await expect(link).toHaveAttribute(
      "href",
      "/api/admin/shift-reports/export?since=2026-11-22&until=2026-11-24",
    );

    const download = page.waitForEvent("download");
    await link.click();
    expect((await download).suggestedFilename()).toBe(
      "bao-cao-theo-ca-2026-11-22-den-2026-11-24.xlsx",
    );
  });

  test("the shifts can be renamed and their hours changed; what is wrong is told before it applies", async ({
    page,
  }) => {
    await page.goto("/vi/admin/shift-reports?from=2026-11-22&to=2026-11-22");
    await (await hydrated(page.getByRole("button", { name: "Cài đặt ca" }).first())).click();

    const dialog = page.getByRole("dialog", { name: "Cài đặt ca" });
    await expect(dialog.getByLabel("Tên ca")).toHaveCount(3);
    await dialog.getByLabel("Đến").first().fill("13:00");
    await dialog.getByRole("button", { name: "Áp dụng" }).click();
    await expect(dialog.getByText("Ca này bắt đầu trước khi ca trước kết thúc")).toBeVisible();

    await dialog.getByLabel("Tên ca").first().fill("Ca sớm");
    await dialog.getByLabel("Từ").nth(1).fill("13:00");
    await dialog.getByRole("button", { name: "Áp dụng" }).click();

    await expect(page).toHaveURL(/shift=/);
    await expect(page.getByText("Ca sớm (06:00–13:00)")).toBeVisible();
    await expect(page.getByRole("table", { name: "Đơn của Ca sớm" })).toContainText("SB-20001");
    // 14:00 and 14:30 are in the second shift, which now starts at 13:00.
    await expect(page.getByRole("table", { name: "Đơn của Ca chiều" })).toContainText("SB-20002");

    await page.reload();
    await expect(page.getByText("Ca sớm (06:00–13:00)")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
});
