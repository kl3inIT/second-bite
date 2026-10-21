import { expect, type Page, test } from "@playwright/test";

import { signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN", timezoneId: "Asia/Ho_Chi_Minh" });
test.setTimeout(90_000);

// The stub's summary (stub-backend.mjs › adminSummaryRoutes): 1 to 5 posts a day, from the day of the month.
function today() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
}

function postsOver(days: number) {
  let sum = 0;
  for (let back = 0; back < days; back += 1) {
    const at = new Date(`${today()}T00:00:00Z`);
    at.setUTCDate(at.getUTCDate() - back);
    sum += (at.getUTCDate() % 5) + 1;
  }
  return sum;
}

/** A figure's card, found by its name. */
function figure(page: Page, name: string) {
  return page
    .getByRole("region", { name: "Số liệu" })
    .locator("[data-slot=card]")
    .filter({ has: page.getByText(name, { exact: true }) });
}

test("the dashboard shows the summary's figures and leaves the orders' empty", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/overview", testInfo, { who: "tongquan" });
  await expect(page.getByRole("heading", { level: 1, name: "Tổng quan" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  // Today is chosen; the figures the summary gives are measured, the ones that need orders are not.
  await expect(page.getByRole("button", { name: "Hôm nay" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(figure(page, "Cửa hàng đang hoạt động")).toContainText("11/ 14 cửa hàng");
  await expect(figure(page, "Bài đăng")).toContainText(`${postsOver(1)}bài`);
  await expect(figure(page, "Đang bán")).toContainText("12bài");
  for (const name of ["Đơn giữ hàng", "Phần ăn được cứu", "Khách đến lấy"]) {
    await expect(figure(page, name)).toContainText("—Chưa có dữ liệu");
  }

  // What waits: only the stores the backend counts, each with its list.
  const todo = page.getByRole("region", { name: "Cần xử lý" });
  await expect(todo.getByRole("listitem")).toHaveCount(2);
  await expect(todo.getByRole("listitem").filter({ hasText: "Cửa hàng bị chặn" })).toContainText(
    "1",
  );
  await expect(todo.getByRole("link", { name: "Xem Cửa hàng bị chặn" })).toHaveAttribute(
    "href",
    /\/vi\/admin\/sellers\?status=blocked$/,
  );
  await expect(todo).not.toContainText("Báo lỗi");

  // The stores that posted most, ranked by posts, and the newest stores and posts.
  const top = page.getByRole("table", { name: "Cửa hàng nổi bật" });
  await expect(top.getByRole("columnheader", { name: "Bài đăng" })).toBeVisible();
  await expect(top.getByRole("row").nth(1)).toContainText("Tiệm bánh Pháp");
  const activity = page.getByRole("region", { name: "Hoạt động gần đây" });
  await expect(activity.getByRole("listitem").first()).toContainText(
    "Cơm nhà Hạnh đăng Cơm trưa văn phòng",
  );
  await expect(activity).toContainText("Rau củ sạch Việt Hưng mở cửa hàng trên Second Bite");

  // The chart draws a week even for today; its days are in a table for the screen reader.
  await expect(
    page.getByRole("table", { name: "Bài đăng và tài khoản mới theo ngày" }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("table", { name: "Bài đăng và tài khoản mới theo ngày" }).getByRole("row"),
  ).toHaveCount(8);
  await expectNoSeriousA11yViolations(page);
});

test("the span is in the address and changes every figure", async ({ page }, testInfo) => {
  await signInTo(page, "/admin/overview", testInfo, { who: "tongquan-khoang" });
  await (await hydrated(page.getByRole("button", { name: "7 ngày" }))).click();
  await expect(page).toHaveURL(/\/vi\/admin\/overview\?range=7d$/);
  await expect(figure(page, "Bài đăng")).toContainText(`${postsOver(7)}bài`);

  await page.goto("/vi/admin/overview?range=30d");
  await expect(page.getByRole("button", { name: "30 ngày" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(figure(page, "Bài đăng")).toContainText(`${postsOver(30)}bài`);
  await expect(
    page.getByRole("table", { name: "Bài đăng và tài khoản mới theo ngày" }).getByRole("row"),
  ).toHaveCount(31);
  await expectNoSeriousA11yViolations(page);
});

test("the chart names a day under the pointer", async ({ page, isMobile }, testInfo) => {
  test.skip(isMobile, "A phone has no pointer to hover with.");
  await signInTo(page, "/admin/overview?range=7d", testInfo, { who: "tongquan-bieudo" });
  const chart = page.locator("[data-slot=chart]");
  await hydrated(chart);
  const box = await chart.boundingBox();
  if (!box) throw new Error("The chart has no box");
  // The right edge is today, whose posts the stub knows.
  await page.mouse.move(box.x + box.width - 14, box.y + box.height / 2);
  const tooltip = page.locator(".recharts-tooltip-wrapper");
  await expect(tooltip).toContainText(`${postsOver(1)} bài đăng`);
  await expect(tooltip).toContainText("tài khoản mới");
  await expectNoSeriousA11yViolations(page);
});
