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

// SEC-80 › the admin's report, on the stub's numbers: three stores' on the last day of the week, 74 of their
// pages opened and 30 of the home, 13 orders held, 10 collected for 13 units, 2 not come for.
test.describe("the admin's report", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await signInAsAdmin(page, `reports.${testInfo.project.name}.${testInfo.title.length}`);
  });

  test("the menu opens the report: its cards, its bars and a row per store", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/vi/admin/sellers");
    if (isMobile)
      await (await hydrated(page.getByRole("button", { name: "Menu quản trị" }))).click();
    const menu = isMobile ? page.getByRole("dialog", { name: "Menu quản trị" }) : page;
    await (await hydrated(menu.getByRole("link", { name: "Báo cáo" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/reports$/);
    if (isMobile) await page.keyboard.press("Escape");

    await expect(page.getByRole("heading", { level: 1, name: "Báo cáo" })).toBeVisible();
    // SEC-192: the three numbers first, each against the seven days before.
    const headline = page.getByRole("definition").filter({ hasText: "so với" });
    await expect(page.getByText("3 khách đặt món lần đầu · tổng 23 tài khoản")).toBeVisible();
    await expect(page.getByText("Bằng 7 ngày trước đó")).toBeVisible();
    await expect(page.getByText("+4 so với 7 ngày trước đó")).toBeVisible();
    await expect(page.getByText("10 đơn đã lấy · 16 phần")).toBeVisible();
    await expect(headline.filter({ hasText: "33" })).toBeVisible();
    await expect(page.getByText("+12 so với 7 ngày trước đó")).toBeVisible();
    await expect(page.getByText("104 lượt mở trang · 8 từ QR")).toBeVisible();
    await expect(page.getByRole("definition").filter({ hasText: "77%" })).toBeVisible();
    await expect(page.getByText("10/13 đơn")).toBeVisible();
    await expect(
      page.getByRole("figure", { name: "Đơn giữ và đơn đã lấy theo ngày" }),
    ).toBeVisible();
    await (await hydrated(page.getByRole("tab", { name: "Người dùng mới" }))).click();
    await expect(page.getByRole("figure", { name: "Người dùng mới theo ngày" })).toBeVisible();

    const table = page.getByRole("table", { name: "Số liệu theo cửa hàng" });
    await expect(table.getByRole("row")).toHaveCount(4);
    const first = table.getByRole("row").nth(1);
    await expect(first).toContainText("La Paris");
    await expect(first).toContainText("89%");
    await expect(first.getByRole("link", { name: "La Paris" })).toBeVisible();
    await expect(first).toContainText("264.000");
    await expectNoSeriousA11yViolations(page);
  });

  // SEC-192: the admin's home opens yesterday's report; a tap chooses the days, and the address keeps them.
  test("opens on yesterday, and a tap chooses the days", async ({ page }) => {
    await page.goto("/vi/admin");
    await expect(page).toHaveURL(
      /\/vi\/admin\/reports\?from=\d{4}-\d{2}-\d{2}&to=\d{4}-\d{2}-\d{2}$/,
    );
    const presets = page.getByRole("group", { name: "Chọn nhanh" });
    await expect(presets.getByRole("button", { name: "Hôm qua" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // The stub's days before today hold the same numbers, so each is the same as the day before.
    await expect(page.getByText("Bằng hôm trước")).toHaveCount(3);

    await (await hydrated(presets.getByRole("button", { name: "7 ngày" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/reports$/);
    await expect(presets.getByRole("button", { name: "7 ngày" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await presets.getByRole("button", { name: "30 ngày" }).click();
    await expect(page).toHaveURL(/from=.+&to=/);
    await expect(page.getByText(/so với 30 ngày trước đó/).first()).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("Sao chép báo cáo copies the three numbers as a message", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/vi/admin/reports");
    await (await hydrated(page.getByRole("button", { name: "Sao chép báo cáo" }))).click();
    await expect(page.getByText("Đã sao chép báo cáo, dán vào tin nhắn để gửi.")).toBeVisible();
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain(
      "- Người dùng mới: 2 tài khoản (0), 3 khách đặt món lần đầu; tổng 23 tài khoản",
    );
    expect(text).toContain("- Giao dịch: 13 đơn (+4), 10 đơn đã lấy");
    expect(text).toContain("- Người truy cập: 33 (+12), 104 lượt mở trang");
    expect(text).toContain("so với 7 ngày trước đó");
  });

  // Figma AD-BC4 (SEC-82): under the stores, what they told the team in the same days.
  test("shows the stores' feedback under the table", async ({ page }) => {
    await page.goto("/vi/admin/reports");
    const feedback = page.getByRole("region", { name: /^Góp ý của quán/ });
    await expect(feedback).toBeVisible();
    await expect(feedback.getByText("Tiệm bánh Pháp")).toBeVisible();
    await expect(
      feedback.getByText("Khách hay hỏi giờ lấy, nên hiện giờ ngay trên mã QR."),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("a store and a sort are kept in the address", async ({ page }) => {
    await page.goto("/vi/admin/reports");
    const table = page.getByRole("table", { name: "Số liệu theo cửa hàng" });

    await (await hydrated(table.getByRole("button", { name: "Lượt mở" }))).click();
    await expect(page).toHaveURL(/sort=views&dir=ascending/);
    await expect(table.getByRole("row").nth(1)).toContainText("Nét Huế");
    await expect(table.getByRole("columnheader", { name: "Lượt mở" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );

    await page.getByRole("combobox", { name: "Cửa hàng" }).click();
    await page.getByRole("option", { name: "Panda Chef" }).click();
    await expect(page).toHaveURL(/store=/);
    await expect(table.getByRole("row")).toHaveCount(2);
    await expect(table.getByRole("row").nth(1)).toContainText("Panda Chef");
  });

  test("Xuất CSV downloads the report from the server", async ({ page }) => {
    await page.goto("/vi/admin/reports");
    const link = page.getByRole("link", { name: "Xuất CSV" });
    await expect(link).toHaveAttribute("href", /^\/api\/admin\/reports\/export\?/);

    const download = page.waitForEvent("download");
    await link.click();
    expect((await download).suggestedFilename()).toMatch(
      /^bao-cao-\d{4}-\d{2}-\d{2}-den-\d{4}-\d{2}-\d{2}\.csv$/,
    );
  });
});
