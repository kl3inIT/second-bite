import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

test.describe("the customer home", () => {
  test("lists tonight's offers: what can be ordered, then what is expected, then what has sold out", async ({
    page,
  }) => {
    await page.goto("/vi");

    await expect(
      page.getByRole("heading", { level: 2, name: "Tối nay ở Tasco Mall" }),
    ).toBeVisible();
    const names = page.getByRole("listitem").getByRole("heading", { level: 3 });
    await expect(names).toHaveText([
      "Túi bánh mì và croissant, 4 chiếc",
      "Xôi thập cẩm, 1 hộp",
      "Bánh mì gà xé",
      "Cơm sườn nướng, 1 suất",
    ]);
    await expect(page.getByText("Lấy 21:00–21:45 · còn 3")).toBeVisible();
    await expect(page.getByText("Dự kiến khoảng 21:00 · chưa đặt được")).toBeVisible();
    await expect(page.getByText("Đã hết · lấy 21:00–21:30")).toBeVisible();
    await expect(page.getByText("39.000đ")).toBeVisible();
    await expect(page.getByText("Giá gốc 95.000đ")).toBeAttached();
    await expectNoSeriousA11yViolations(page);
  });

  test("filters by kind and offers the whole list back when nothing matches", async ({ page }) => {
    await page.goto("/vi");
    await (await hydrated(page.getByRole("link", { name: "Bánh", exact: true }))).click();

    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
    await expect(page.getByRole("link", { name: "Bánh", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(page.getByRole("listitem").getByRole("heading", { level: 3 })).toHaveText([
      "Túi bánh mì và croissant, 4 chiếc",
      "Bánh mì gà xé",
    ]);

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
    await expect(page.getByRole("listitem").getByRole("heading", { level: 3 })).toHaveText([
      "Xôi thập cẩm, 1 hộp",
    ]);
  });

  test("introduces Second Bite on a first visit until it is closed", async ({ page }) => {
    await page.goto("/vi");
    await expect(page.getByRole("heading", { name: "Second Bite là gì?" })).toBeVisible();

    await (await hydrated(page.getByRole("button", { name: "Đóng giới thiệu" }))).click();
    await expect(page.getByRole("heading", { name: "Second Bite là gì?" })).toBeHidden();

    await page.reload();
    await expect(
      page.getByRole("heading", { level: 2, name: "Tối nay ở Tasco Mall" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Second Bite là gì?" })).toBeHidden();
  });

  test("says the list could not be loaded, with a reference and a retry", async ({ page }) => {
    await page.goto("/vi?q=loi-may-chu");

    await expect(page.getByRole("heading", { name: "Đã có lỗi xảy ra" })).toBeVisible();
    await expect(page.getByText(/^Mã tham chiếu: \S+$/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Thử lại" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
});
