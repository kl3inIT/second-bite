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
    // SEC-200: the support programme's figures, returning customers and each store's days and portions.
    await expect(page.getByRole("definition").filter({ hasText: "40%" })).toBeVisible();
    await expect(page.getByText("4/10 khách đã lấy đơn quay lại")).toBeVisible();
    await expect(table.getByRole("columnheader", { name: "Ngày đủ 7 phần" })).toBeVisible();
    await expect(table.getByRole("columnheader", { name: "Phần đã lấy" })).toBeVisible();
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
    expect(text).toContain("- Sản phẩm: 28 phần đăng, 13 phần đã lấy (46%), dư 15");
    expect(text).toContain("- Tác động: 1,6 kg thực phẩm được cứu, khách tiết kiệm 354.000đ");
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

  // report-products-export: the portions posted, ordered, collected and left over, on the stub's 28 posted
  // (15, 8 and 5), 16 ordered and 13 collected (11 and 2).
  test("shows what became of the portions, by day and by store", async ({ page }) => {
    await page.goto("/vi/admin/reports");
    const products = page.getByRole("region", { name: "Sản phẩm" });
    await expect(products.getByText("6 món đăng")).toBeVisible();
    await expect(products.getByText("trong 13 đơn")).toBeVisible();
    await expect(products.getByText("10 đơn đã lấy")).toBeVisible();
    await expect(products.getByText("không đến tay khách")).toBeVisible();
    await expect(products.getByText("46%")).toBeVisible();
    await expect(products.getByText("13/28 phần đến tay khách")).toBeVisible();
    await expect(products.getByRole("progressbar", { name: "Tỉ lệ bán hết" })).toBeVisible();

    await (await hydrated(page.getByRole("tab", { name: "Sản phẩm" }))).click();
    await expect(
      page.getByRole("figure", { name: "Phần đã lấy và phần dư theo ngày" }),
    ).toBeVisible();

    const table = page.getByRole("table", { name: "Số liệu theo cửa hàng" });
    for (const column of ["Phần đăng", "Phần dư", "Tỉ lệ bán hết"])
      await expect(table.getByRole("columnheader", { name: column })).toBeVisible();
    // La Paris posted 15 and had 11 collected: 4 left over, 73% sold.
    await expect(table.getByRole("row").nth(1)).toContainText("73%");
    await expectNoSeriousA11yViolations(page);
  });

  // The stub's two stores collected 13 portions worth 668.000đ, 8 of them weighing 1,6 kg, for 334.000đ at the
  // counter less 20.000đ of discounts: customers saved 354.000đ.
  test("shows the impact of the portions collected", async ({ page }) => {
    await page.goto("/vi/admin/reports");
    const impact = page.getByRole("region", { name: "Tác động" });
    await expect(impact.getByText("1,6 kg")).toBeVisible();
    await expect(impact.getByText("8/13 phần có ghi cân nặng")).toBeVisible();
    await expect(impact.getByText("668.000đ")).toBeVisible();
    await expect(impact.getByText("354.000đ")).toBeVisible();
    await expect(impact.getByText("53% so với giá gốc")).toBeVisible();
    await expect(impact.getByText("2 đơn dùng mã giảm giá")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("analyses the products, the time and the quality", async ({ page }) => {
    await page.goto("/vi/admin/reports");
    for (const group of ["Khách hàng", "Sản phẩm và giá", "Thời gian", "Chất lượng"])
      await expect(page.getByRole("heading", { level: 3, name: group })).toBeVisible();

    const visits = page.getByRole("region", { name: "Khách theo số lần nhận đơn · 10 khách" });
    await expect(visits.getByText("6 khách · 60%")).toBeVisible();
    await expect(page.getByRole("region", { name: /^Nguồn truy cập/ })).toContainText(
      "QR tại quầy",
    );

    const kinds = page.getByRole("region", { name: "Theo loại món" });
    await expect(kinds.getByRole("progressbar", { name: "Bánh" })).toBeVisible();
    await expect(kinds.getByText("11/15 phần · 73%")).toBeVisible();

    const dishes = page.getByRole("region", { name: "Món" });
    await expect(dishes.getByText("Bánh mì bơ tỏi")).toBeVisible();
    await (await hydrated(dishes.getByRole("tab", { name: "Dư nhiều" }))).click();
    await expect(dishes.getByText("dư 6/8 suất")).toBeVisible();

    const slots = page.getByRole("region", { name: "Đơn giữ theo thứ và giờ nhận" });
    await expect(slots.getByRole("row", { name: /^T6/ })).toContainText("6");
    await expect(
      page.getByText("Trung vị 40 phút từ lúc đăng tới phần cuối được đặt."),
    ).toBeVisible();

    const failures = page.getByRole("region", { name: "Đơn không thành · 3 đơn" });
    await expect(
      failures.getByRole("progressbar", { name: "Hết giờ, khách không đến" }),
    ).toBeVisible();
    await expect(page.getByRole("region", { name: "Khách khen gì" })).toContainText(
      "Chất lượng tốt",
    );
    await expectNoSeriousA11yViolations(page);
  });

  test("analyses the visitors, the orders and the ratings", async ({ page }) => {
    await page.goto("/vi/admin/reports");
    const analysis = page.getByRole("region", { name: "Phân tích" });
    // 13 orders held for 33 visitors, 10 of them collected, for 334.000đ and 13 portions.
    await expect(analysis.getByText("39 đơn / 100 người")).toBeVisible();
    await expect(analysis.getByText("77% đơn giữ")).toBeVisible();
    await expect(analysis.getByText("33.400đ")).toBeVisible();
    await expect(analysis.getByText("1,3")).toBeVisible();
    // The stub's six reviews, one hidden: the five shown average 3.8 stars.
    const ratings = analysis.getByRole("region", { name: "Đánh giá · 6 lượt" });
    await expect(ratings.getByText("3,8")).toBeVisible();
    await expect(ratings.getByRole("progressbar", { name: "5 sao" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("Xuất báo cáo downloads the CSV from the server", async ({ page }) => {
    await page.goto("/vi/admin/reports");
    await (await hydrated(page.getByRole("button", { name: "Xuất báo cáo" }))).click();
    const dialog = page.getByRole("dialog", { name: "Xuất báo cáo" });
    await dialog.getByRole("radio", { name: /^CSV/ }).click();
    await expect(dialog.getByRole("checkbox", { name: "Sản phẩm" })).toBeHidden();
    const link = dialog.getByRole("link", { name: "Xuất" });
    await expect(link).toHaveAttribute("href", /^\/api\/admin\/reports\/export\?/);

    const download = page.waitForEvent("download");
    await link.click();
    expect((await download).suggestedFilename()).toMatch(
      /^bao-cao-\d{4}-\d{2}-\d{2}-den-\d{4}-\d{2}-\d{2}\.csv$/,
    );
  });

  test("Xuất báo cáo downloads the Excel workbook from the server", async ({ page }) => {
    await page.goto("/vi/admin/reports");
    await (await hydrated(page.getByRole("button", { name: "Xuất báo cáo" }))).click();
    const dialog = page.getByRole("dialog", { name: "Xuất báo cáo" });
    await dialog.getByRole("radio", { name: /^Excel/ }).click();
    const link = dialog.getByRole("link", { name: "Xuất" });
    await expect(link).toHaveAttribute("href", /^\/api\/admin\/reports\/workbook\?/);

    const download = page.waitForEvent("download");
    await link.click();
    expect((await download).suggestedFilename()).toMatch(
      /^bao-cao-\d{4}-\d{2}-\d{2}-den-\d{4}-\d{2}-\d{2}\.xlsx$/,
    );
  });

  test("Xuất báo cáo opens the print page with the parts ticked", async ({ page }) => {
    await page.goto("/vi/admin/reports");
    await (await hydrated(page.getByRole("button", { name: "Xuất báo cáo" }))).click();
    const dialog = page.getByRole("dialog", { name: "Xuất báo cáo" });
    await expect(dialog.getByRole("radio", { name: /^PDF/ })).toBeChecked();
    await expectNoSeriousA11yViolations(page);
    await dialog.getByRole("checkbox", { name: "Góp ý của quán" }).click();
    await dialog.getByRole("link", { name: "Xuất" }).click();

    await expect(page).toHaveURL(/\/vi\/admin\/reports\/print\?parts=/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Báo cáo Second Bite" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Lưu PDF" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Sản phẩm" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Tác động" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Theo loại món" })).toBeVisible();
    await expect(
      page.getByRole("figure", { name: "Đơn giữ và đơn đã lấy theo ngày" }),
    ).toBeVisible();
    await expect(
      page.getByRole("figure", { name: "Phần đã lấy và phần dư theo ngày" }),
    ).toBeVisible();
    await expect(page.getByRole("table", { name: "Số liệu theo cửa hàng" })).toContainText(
      "La Paris",
    );
    await expect(page.getByRole("region", { name: /^Góp ý của quán/ })).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("link", { name: "Quay lại báo cáo" }).click();
    await expect(page).toHaveURL(/\/vi\/admin\/reports$/);
  });
});
