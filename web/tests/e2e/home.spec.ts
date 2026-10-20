import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

test.describe("the customer home", () => {
  test("shows tonight's offers: the deal card, what closes first, then every dish by its name", async ({
    page,
  }) => {
    await page.goto("/vi");

    await expect(
      page.getByRole("heading", { level: 1, name: "Tối nay ở Tasco Mall" }),
    ).toBeVisible();

    const deals = page.getByRole("region", { name: "Món ngon tối nay ở Tasco Mall" });
    await expect(deals.getByText("59%", { exact: true })).toBeVisible();
    await expect(deals.getByRole("listitem")).toHaveCount(2);
    const firstTicket = deals.getByRole("listitem").first();
    await expect(firstTicket.getByText("Giảm 59%")).toBeAttached();
    await expect(firstTicket.getByText("Panda Chef")).toBeVisible();

    const closing = page.getByRole("region", { name: "Sắp hết giờ nhận" });
    // A wide screen shows the first four.
    const closingFirst = [
      "Cơm Thịt Kho Nước Dừa",
      "Combo Nhóm 3 Tụ Tập",
      "Bánh Croissant Truyền Thống",
      "Bánh Eclair Socola",
    ];
    for (const [index, name] of closingFirst.entries()) {
      await expect(closing.getByRole("heading", { level: 3 }).nth(index)).toHaveText(name);
    }

    const all = page.getByRole("region", { name: "Tất cả món quanh đây" });
    await expect(all.getByRole("heading", { level: 3 })).toHaveText([
      "Bánh Croissant Truyền Thống",
      "Bánh Eclair Socola",
      "Há cảo tôm",
      "Bánh bao xá xíu",
      "Cơm Thịt Kho Nước Dừa",
      "Trà Sữa Phúc Long",
      "Bạc Xỉu Đá",
      "Combo Nhóm 3 Tụ Tập",
      "Pizza Thập Cẩm",
      "Bánh Mì Mềm Chà Bông",
    ]);
    const croissant = all.getByRole("listitem").first();
    await expect(croissant.getByText("Còn 3 phần")).toBeVisible();
    await expect(croissant.getByText("22.000đ")).toBeVisible();
    await expect(croissant.getByText("Giá gốc 50.000đ")).toBeAttached();
    await expect(croissant.getByText("Giảm 56%")).toBeVisible();
    await expect(croissant.getByText("La Paris")).toBeHidden();
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
      "Bánh Croissant Truyền Thống",
      "Bánh Eclair Socola",
      "Bánh Mì Mềm Chà Bông",
    ]);
    await expect(page.getByRole("region", { name: "Sắp hết giờ nhận" })).toBeHidden();
    await expect(page.getByRole("region", { name: "Món ngon tối nay ở Tasco Mall" })).toBeHidden();

    await (await hydrated(page.getByRole("link", { name: "Bánh", exact: true }))).click();
    await expect(page).toHaveURL(/\/vi$/);

    await (await hydrated(page.getByRole("link", { name: "Nguyên liệu" }))).click();
    await expect(page.getByText("Không có món nào khớp bộ lọc này.")).toBeVisible();
    await (await hydrated(page.getByRole("link", { name: "Xem tất cả món" }))).click();
    await expect(page).toHaveURL(/\/vi$/);
  });

  test("takes the words typed in the header to the search", async ({ page }) => {
    await page.goto("/vi");
    await (
      await hydrated(page.getByRole("searchbox", { name: "Tìm món hoặc quán" }))
    ).fill("banh bao");
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/vi\/search\?q=banh\+bao$/);
  });

  test("shows the dishes around the person's place, nearest first, and Tasco Mall's when there are none", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 21.0571, longitude: 105.8969 });
    await page.goto("/vi");
    await (await hydrated(page.getByRole("button", { name: "Chọn nơi xem món" }))).click();
    await expectNoSeriousA11yViolations(page);
    await page.getByText("Dùng vị trí của tôi").click();
    await page.getByRole("button", { name: "Xem món quanh đây" }).click();

    await expect(page).toHaveURL(/\/vi\?near=21\.057%2C105\.897$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Tối nay quanh Vị trí của tôi" }),
    ).toBeVisible();
    await expect(page.getByRole("region", { name: "Món ngon tối nay ở Tasco Mall" })).toBeHidden();
    const all = page.getByRole("region", { name: "Tất cả món quanh đây" });
    await expect(all.getByText(/^21:00–21:45 · \d+ m$/).first()).toBeVisible();

    await page.goto("/vi?near=10.762,106.660");
    await expect(page.getByText("Chưa có món nào quanh đây")).toBeVisible();
    const mall = page.getByRole("region", { name: "Đang bán ở Tasco Mall" });
    await expect(mall.getByRole("heading", { level: 3 }).first()).toHaveText(
      "Cơm Thịt Kho Nước Dừa",
    );
    await expect(mall.getByText("Bánh Mì Mềm Chà Bông")).toBeHidden();
    await expectNoSeriousA11yViolations(page);
  });

  test("says what Second Bite is on a wide screen, where a phone goes straight to the dishes", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "A phone follows Figma K1, without the line and the steps.");
    await page.goto("/vi");
    const line = "Món ngon cuối ngày của các quán ở Tasco Mall, giá thấp hơn.";
    await expect(page.getByRole("heading", { name: line })).toBeVisible();
    await expect(page.getByText("Đến quầy trong giờ lấy")).toBeVisible();
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
      await page.getByRole("heading", { name: "Tất cả món quanh đây" }).scrollIntoViewIfNeeded();
      await page.mouse.wheel(0, 400);
      await expect(search).toHaveCount(2, { timeout: 1000 });
    }).toPass();
    await expect(search.last()).toBeInViewport();
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Second Bite, về trang chủ" }).last(),
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
