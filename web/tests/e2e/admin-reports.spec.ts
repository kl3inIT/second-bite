import { expect, type Page, test } from "@playwright/test";

import { signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN", timezoneId: "Asia/Ho_Chi_Minh" });
test.setTimeout(90_000);

// The stub's summary (stub-backend.mjs › adminSummaryRoutes): new accounts are the day of the month modulo 3.
function day(back: number) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(
    new Date(),
  );
  const at = new Date(`${today}T00:00:00Z`);
  at.setUTCDate(at.getUTCDate() - back);
  return at;
}

function accountsOver(days: number) {
  let sum = 0;
  for (let back = 0; back < days; back += 1) sum += day(back).getUTCDate() % 3;
  return sum;
}

/** Monday-first weeks that the last `days` days touch. */
function weeksOver(days: number) {
  let weeks = 1;
  for (let back = 0; back < days - 1; back += 1) if (day(back).getUTCDay() === 1) weeks += 1;
  return weeks;
}

function figure(page: Page, name: string) {
  return page
    .getByRole("region", { name: "Số liệu" })
    .locator("div")
    .filter({ has: page.getByText(name, { exact: true }) });
}

const weekTable = (page: Page) => page.getByRole("table", { name: "Bài đăng theo tuần" });

test("the reports show what the summary gives and leave the orders empty", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/reports", testInfo, { who: "baocao" });
  await expect(page.getByRole("heading", { level: 1, name: "Báo cáo" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  // The reports sit on their own in the sidebar, under the admin rather than Vận hành.
  await expect(page.getByRole("navigation", { name: "Đường dẫn" })).toHaveText(
    /^Quản trị\s*\/\s*Báo cáo$/,
  );

  // The 30 days that end today, every store: "21/09 – 20/10/2026", the start without its year when it is the same.
  const [start, end] = [day(29), day(0)];
  const dayMonth = (at: Date) =>
    `${String(at.getUTCDate()).padStart(2, "0")}/${String(at.getUTCMonth() + 1).padStart(2, "0")}`;
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  await expect(page.getByRole("button", { name: /Khoảng ngày/ })).toContainText(
    `${dayMonth(start)}${sameYear ? "" : `/${start.getUTCFullYear()}`} – ${dayMonth(end)}/${end.getUTCFullYear()}`,
  );
  await expect(page.getByRole("combobox", { name: "Cửa hàng" })).toContainText(
    "Tất cả 14 cửa hàng",
  );

  for (const name of [
    "Đơn giữ hàng",
    "Phần ăn được cứu",
    "Kg thực phẩm cứu được",
    "Tỉ lệ khách không đến",
  ]) {
    await expect(figure(page, name)).toContainText("—Chưa có dữ liệu");
  }
  await expect(figure(page, "Người dùng mới")).toContainText(`${accountsOver(30)}người`);

  // Posts by week, Monday first, the week under way named in words.
  await expect(weekTable(page).getByRole("row")).toHaveCount(weeksOver(30) + 1);
  if (day(0).getUTCDay() !== 0) {
    await expect(weekTable(page).getByRole("row").last()).toContainText("đang diễn ra");
  }

  // The stores' lines need orders: the table is empty, its headings as Figma.
  const table = page.getByRole("table", { name: "Báo cáo theo cửa hàng" });
  await expect(
    table.getByRole("columnheader", { name: "Doanh thu tại quầy (ước tính)" }),
  ).toBeVisible();
  await expect(page.getByText("Chưa có đơn nào trong khoảng này")).toBeVisible();
  await expectNoSeriousA11yViolations(page);
});

test("the range and the store are in the address", async ({ page }, testInfo) => {
  const from = day(6).toISOString().slice(0, 10);
  const to = day(0).toISOString().slice(0, 10);
  await signInTo(page, `/admin/reports?from=${from}&to=${to}`, testInfo, { who: "baocao-khoang" });
  await expect(figure(page, "Người dùng mới")).toContainText(`${accountsOver(7)}người`);
  await expect(weekTable(page).getByRole("row")).toHaveCount(weeksOver(7) + 1);

  // One store: the summary cannot be cut by store, so its figures and chart stay empty.
  await page.goto(`/vi/admin/reports?from=${from}&to=${to}&seller=sl-banh-phap`);
  await expect(figure(page, "Người dùng mới")).toContainText("—Chưa có dữ liệu");
  await expect(weekTable(page)).toHaveCount(0);
  await expectNoSeriousA11yViolations(page);
});

test("the export is drawn but cannot download before its backend", async ({ page }, testInfo) => {
  await signInTo(page, "/admin/reports", testInfo, { who: "baocao-xuat" });
  await (await hydrated(page.getByRole("button", { name: "Xuất báo cáo" }))).click();
  const dialog = page.getByRole("alertdialog", { name: "Xuất báo cáo" });
  await expect(dialog).toBeVisible();

  await expect(dialog.getByRole("radio", { name: "Đơn giữ hàng" })).toBeChecked();
  await dialog.getByText("Cửa hàng", { exact: true }).click();
  await expect(dialog.getByRole("radio", { name: "Cửa hàng" })).toBeChecked();
  await dialog.getByText("CSV (.csv)").click();
  await expect(dialog.getByRole("radio", { name: "CSV (.csv)" })).toBeChecked();
  await expect(dialog.getByRole("button", { name: /Từ – đến/ })).toBeVisible();

  const download = dialog.getByRole("button", { name: "Tải về" });
  await expect(download).toBeDisabled();
  await expect(download).toHaveAttribute("title", "Sắp có");
  await expect(dialog.getByText("Sắp có", { exact: true })).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  await dialog.getByRole("button", { name: "Huỷ" }).click();
  await expect(dialog).toBeHidden();
});
