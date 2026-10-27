import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

/** From 768px the cart is a sidebar beside the menu (Figma WK3) and the bottom bar is a phone's. */
function wide(page: Page) {
  return (page.viewportSize()?.width ?? 0) >= 768;
}

test.describe("a dish, its seller and the cart", () => {
  test("opens a dish on its seller's page from the search, and its sheet", async ({ page }) => {
    // The grid's card leads to the seller's page; the list, the search's first view, opens the dish's sheet.
    await page.addInitScript(() =>
      localStorage.setItem("secondbite.search-view", JSON.stringify("grid")),
    );
    await page.goto("/vi/search?q=croissant");
    await (await hydrated(page.getByRole("link", { name: "Bánh Croissant Truyền Thống" }))).click();

    // Figma K4: the seller's page, scrolled to the dish's tinted row.
    await expect(page).toHaveURL(/\/vi\/sellers\/se-la-paris\?at=of-croissant#dish-of-croissant$/);
    await expect(page.getByRole("heading", { level: 1, name: "La Paris" })).toBeVisible();
    // From 768px the line under the name is the floor, then tonight's hours alone at its end.
    if (wide(page)) {
      await expect(
        page.getByRole("paragraph").filter({ hasText: /^Tầng 1 · \d{1,2}:\d{2}–\d{1,2}:\d{2}$/ }),
      ).toBeVisible();
    }
    // A phone scrolls to the dish's row, a wider screen to its card in the menu's sections.
    await expect(
      page.locator(wide(page) ? "#wide-dish-of-croissant" : "#dish-of-croissant"),
    ).toBeInViewport();
    await expect(page.getByRole("navigation", { name: "Điều hướng chính" })).toBeHidden();
    await expectNoSeriousA11yViolations(page);

    // Figma K4a: the dish's sheet adds two portions at once.
    await (
      await hydrated(
        page.getByRole("button", { name: "Bánh Croissant Truyền Thống", exact: true }).first(),
      )
    ).click();
    const sheet = page.getByRole("dialog", { name: "Bánh Croissant Truyền Thống" });
    await expect(
      sheet.getByText(/^Croissant bơ Pháp nướng sáng nay.* Khoảng 80 g\.$/),
    ).toBeVisible();
    await expect(sheet.getByText("Hỏi quán về thành phần và dị ứng.")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await sheet.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }).click();
    await sheet.getByRole("button", { name: "Thêm vào giỏ · 44.000đ" }).click();
    await expect(sheet).toBeHidden();
    await expect(
      page.getByLabel("2 phần Bánh Croissant Truyền Thống trong giỏ").first(),
    ).toHaveText("2");

    // Figma K4b searches the menu on a phone; WK3 has no such search.
    const menuSearch = page.getByRole("searchbox", { name: "Tìm trong thực đơn La Paris" });
    if (wide(page)) {
      await expect(menuSearch).toBeHidden();
    } else {
      await menuSearch.fill("eclair");
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/q=eclair/);
      await expect(
        page.getByRole("button", { name: "Bánh Croissant Truyền Thống", exact: true }),
      ).toBeHidden();
    }

    // A dish's old address leads to the same place.
    await page.goto("/vi/offers/of-croissant");
    await expect(page).toHaveURL(/\/vi\/sellers\/se-la-paris\?at=of-croissant#dish-of-croissant$/);
  });

  test("fills a cart from two sellers up to the portions left, and changes it on the confirmation", async ({
    page,
  }) => {
    await page.goto("/vi/sellers/se-la-paris");
    // The sidebar lists the dish with its own + once it is in the cart; the menu's comes first.
    const add = await hydrated(
      page.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }).first(),
    );
    await add.click();
    await add.click();
    await add.click();

    await expect(
      page.getByLabel("3 phần Bánh Croissant Truyền Thống trong giỏ").first(),
    ).toHaveText("3");
    await expect(add).toBeDisabled();
    await expect(
      page
        .getByText(wide(page) ? "Đã chọn đủ 3" : "đã chọn đủ 3 phần", { exact: true })
        .filter({ visible: true })
        .first(),
    ).toBeVisible();
    // A phone's bar at the foot, a wider screen's sidebar at the side.
    await expect(
      wide(page)
        ? page.getByText("Tiền món (3 phần)").filter({ visible: true })
        : page.getByText("3 phần · tiết kiệm 84.000đ"),
    ).toBeVisible();

    // Another seller's dish joins the same cart, in its own basket.
    await page.goto("/vi/sellers/se-panda-chef");
    await (
      await hydrated(page.getByRole("button", { name: "Thêm một phần Há cảo tôm" }).first())
    ).click();
    await page.getByRole("link", { name: wide(page) ? /^Đặt 2 đơn/ : "Xem giỏ hàng" }).click();

    await expect(page.getByRole("heading", { level: 1, name: "Xác nhận đơn" })).toBeVisible();
    // The seller page just left stays in the document, hidden, with its own sidebar.
    await expect(
      page.getByLabel("3 phần Bánh Croissant Truyền Thống trong giỏ").filter({ visible: true }),
    ).toHaveText("3");
    await expect(
      page
        .getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" })
        .filter({ visible: true }),
    ).toBeDisabled();
    await expect(page.getByText("Tiền món (4 phần)").filter({ visible: true })).toBeVisible();
    // Figma K5: one card per seller's order, and one order button for both.
    await expect(page.getByRole("heading", { level: 2, name: "La Paris" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Panda Chef" })).toBeVisible();
    await expect(page.getByText("Thanh toán tại quầy", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tổng cộng · 2 đơn" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Đặt 2 đơn" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    // Figma K5: at one portion, − takes the dish out at once.
    await page.getByRole("button", { name: "Bớt một phần Há cảo tôm" }).click();
    await expect(
      page.getByText("Há cảo tôm", { exact: true }).filter({ visible: true }),
    ).toHaveCount(0);
    await expect(page.getByText("Tiền món (3 phần)").filter({ visible: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Đặt món" })).toBeVisible();
  });

  // Figma WK3: from 1024px the menu at the left and the cart's sidebar at the right, in view as the page scrolls;
  // from 768px up to it the sidebar sits under the menu. A phone has the bar at the foot instead.
  for (const width of [768, 1024, 1440]) {
    test(`shows the cart beside the menu at ${width} px`, async ({ page, isMobile }) => {
      test.skip(isMobile, "a phone has the bar at the foot");
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/vi/sellers/se-la-paris");
      const sidebar = page.getByRole("complementary", { name: "Giỏ của bạn" });
      await expect(sidebar).toBeVisible();
      await expect(sidebar.getByText("Chọn món để thêm vào giỏ.")).toBeVisible();
      // Figma "01 · Trang quán & giỏ nhiều quán": the customer header, "Theo dõi" beside the seller and the menu's
      // sections as a row of pills.
      await expect(page.getByRole("searchbox", { name: "Tìm món hoặc quán" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Theo dõi La Paris" })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Loại món" })).toBeVisible();

      await (
        await hydrated(
          page.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }).first(),
        )
      ).click();
      await expect(sidebar.getByRole("heading", { name: "La Paris" })).toBeVisible();
      await expect(sidebar.getByText("Tiền món (1 phần)")).toBeVisible();
      await expect(sidebar.getByRole("link", { name: /^Đặt món · / })).toBeVisible();
      await expect(page.getByText("1 phần · tiết kiệm")).toBeHidden();

      const menu = await page.locator("#dishes").boundingBox();
      const cart = await sidebar.boundingBox();
      if (width >= 1024) expect(cart!.x).toBeGreaterThan(menu!.x + menu!.width - 1);
      else expect(cart!.y).toBeGreaterThan(menu!.y + menu!.height - 1);
      await expectNoSeriousA11yViolations(page);
    });
  }

  test("the seller's page and the confirmation fit a 360 px phone", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 760 });
    await page.goto("/vi/sellers/se-la-paris");
    await (
      await hydrated(
        page.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }),
      )
    ).click();
    const noSideways = () =>
      page.evaluate(
        () => document.documentElement.scrollWidth === document.documentElement.clientWidth,
      );
    expect(await noSideways()).toBe(true);

    await page.goto("/vi/cart");
    await expect(page.getByRole("button", { name: "Đặt món" })).toBeVisible();
    // The layout's template adds the name once.
    await expect(page).toHaveTitle("Xác nhận đơn · Second Bite");
    expect(await noSideways()).toBe(true);
  });

  // SEC-137: the counter on the store's pin, and the way there to that pin, not to the address Google looks up.
  // The web's page has no map (the owner's review, 27 October 2026), only the pin beside the seller's window.
  test("shows the seller on a map, the way there leading to its pin", async ({ page }) => {
    await page.goto("/vi/sellers/se-la-paris");
    const map = page.getByRole("figure", { name: /^Vị trí .+ trên bản đồ$/ });
    await (wide(page) ? expect(map).toBeHidden() : expect(map).toBeVisible());
    // A phone's "Chỉ đường"; a wider screen's pin beside the seller's window.
    await expect(
      page
        .getByRole("link", { name: wide(page) ? "Mở đường đến quán" : "Chỉ đường" })
        .filter({ visible: true })
        .first(),
    ).toHaveAttribute(
      "href",
      /^https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=-?\d+\.\d+%2C-?\d+\.\d+$/,
    );
    await expectNoSeriousA11yViolations(page);
  });

  test("says when a seller has nothing tonight", async ({ page }) => {
    await page.goto("/vi/sellers/se-unknown");

    await expect(page.getByRole("main").getByText("Quán chưa có món tối nay")).toBeVisible();
  });
});
