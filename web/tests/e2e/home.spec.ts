import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

test.describe("the customer home", () => {
  test("shows tonight's offers: the deal card, what closes first, then every offer", async ({
    page,
  }) => {
    await page.goto("/vi");

    await expect(
      page.getByRole("heading", { level: 1, name: "Tối nay ở Tasco Mall" }),
    ).toBeVisible();

    const deals = page.getByRole("region", { name: "Túi ngon tối nay ở Tasco Mall" });
    await expect(deals.getByText("58%", { exact: true })).toBeVisible();
    await expect(deals.getByRole("listitem")).toHaveCount(2);
    const firstTicket = deals.getByRole("listitem").first();
    await expect(firstTicket.getByText("Giảm 58%")).toBeAttached();
    await expect(firstTicket.getByText("Tiệm bánh Pháp")).toBeVisible();
    await expect(firstTicket.getByText("Lấy 21:00")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "8 túi đang mở · túi cuối lúc 21:45" }),
    ).toHaveAttribute("href", "#all-offers");

    const closing = page.getByRole("region", { name: "Sắp hết giờ lấy" });
    await expect(closing.getByRole("heading", { level: 3 })).toHaveText([
      "Túi bánh mì và croissant, 4 chiếc",
      "Xôi thập cẩm, 1 hộp",
    ]);

    const all = page.getByRole("region", { name: "Quanh bạn ở Tasco Mall" });
    await expect(all.getByRole("heading", { level: 3 })).toHaveText([
      "Túi bánh mì và croissant, 4 chiếc",
      "Xôi thập cẩm, 1 hộp",
      "Cơm sườn nướng, 1 suất",
    ]);
    const bread = all.getByRole("listitem").first();
    await expect(bread.getByText("Còn 3")).toBeVisible();
    await expect(bread.getByText("39.000đ")).toBeVisible();
    await expect(bread.getByText("Giá gốc 95.000đ")).toBeAttached();
    await expect(bread.getByText("Giảm 58%")).toBeAttached();
    await expect(all.getByRole("listitem").last().getByText("Đã hết")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("filters by kind, back to every offer from the chosen kind or when nothing matches", async ({
    page,
  }) => {
    await page.goto("/vi");
    await (await hydrated(page.getByRole("link", { name: "Bánh", exact: true }))).click();

    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
    await expect(page.getByRole("link", { name: "Bánh", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const results = page.getByRole("region", { name: "Kết quả" });
    await expect(results.getByRole("heading", { level: 3 })).toHaveText([
      "Túi bánh mì và croissant, 4 chiếc",
    ]);
    await expect(page.getByRole("region", { name: "Sắp hết giờ lấy" })).toBeHidden();
    await expect(page.getByRole("region", { name: "Túi ngon tối nay ở Tasco Mall" })).toBeHidden();

    await (await hydrated(page.getByRole("link", { name: "Bánh", exact: true }))).click();
    await expect(page).toHaveURL(/\/vi$/);

    await (await hydrated(page.getByRole("link", { name: "Đồ uống" }))).click();
    await expect(page.getByText("Không có món nào khớp bộ lọc này.")).toBeVisible();
    await (await hydrated(page.getByRole("link", { name: "Xem tất cả món" }))).click();
    await expect(page).toHaveURL(/\/vi$/);
  });

  test("searches by words without accents", async ({ page }) => {
    await page.goto("/vi");
    await (await hydrated(page.getByRole("searchbox", { name: "Tìm món hoặc quán" }))).fill("xoi");
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/vi\?q=xoi$/);
    await expect(page.getByRole("searchbox", { name: "Tìm món hoặc quán" })).toHaveValue("xoi");
    await expect(
      page.getByRole("region", { name: "Kết quả" }).getByRole("heading", { level: 3 }),
    ).toHaveText(["Xôi thập cẩm, 1 hộp"]);
  });

  test("introduces Second Bite on a first visit until it is closed", async ({ page, isMobile }) => {
    await page.goto("/vi");
    if (!isMobile) {
      // A wide screen keeps one line and the three steps in view, with nothing to close.
      const line = "Món ngon cuối ngày của các quán ở Tasco Mall, giá thấp hơn.";
      await expect(page.getByRole("heading", { name: line })).toBeVisible();
      await expect(page.getByText("Đến quầy trong giờ lấy")).toBeVisible();
      await expect(page.getByRole("button", { name: "Đóng giới thiệu" })).toBeHidden();
      return;
    }
    await expect(page.getByRole("heading", { name: "Second Bite là gì?" })).toBeVisible();

    await (await hydrated(page.getByRole("button", { name: "Đóng giới thiệu" }))).click();
    await expect(page.getByRole("heading", { name: "Second Bite là gì?" })).toBeHidden();

    await page.reload();
    await expect(
      page.getByRole("heading", { level: 1, name: "Tối nay ở Tasco Mall" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Second Bite là gì?" })).toBeHidden();
  });

  test("keeps the search and the account in reach once the header scrolls away on a wide screen", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "A phone has the bottom bar instead.");
    await page.goto("/vi");
    const search = page.getByRole("searchbox", { name: "Tìm món hoặc quán" });
    await expect(search).toHaveCount(1);
    // Scroll only once the page has hydrated, so the header is watching; then scroll again until it shows,
    // as a scroll made while the list is still streaming in can leave the row on screen.
    await hydrated(search);
    await expect(async () => {
      await page.getByRole("heading", { name: "Quanh bạn ở Tasco Mall" }).scrollIntoViewIfNeeded();
      await page.mouse.wheel(0, 400);
      await expect(search).toHaveCount(2, { timeout: 1000 });
    }).toPass();
    await expect(search.last()).toBeInViewport();
    await expect(
      page.getByRole("link", { name: "Second Bite, về trang chủ" }).last(),
    ).toBeInViewport();
  });

  test("says the list could not be loaded, with a reference and a retry", async ({ page }) => {
    await page.goto("/vi?q=loi-may-chu");

    await expect(page.getByRole("heading", { name: "Đã có lỗi xảy ra" })).toBeVisible();
    await expect(page.getByText(/^Mã tham chiếu: \S+$/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Thử lại" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
});
