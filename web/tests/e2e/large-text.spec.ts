import { readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";

import { hydrated } from "./hydration";

test.use({ locale: "vi-VN", viewport: { width: 360, height: 760 } });

// Zalo's in-app browser grows web text with the phone's font size (Android WebView's textZoom): sizes and
// line heights grow, boxes do not. Chromium here has no such setting, so every text class is grown the
// same way. The sizes are the tokens Tailwind inlines into each class (.text-label{font-size:12px;…}), and
// an unlayered rule wins over Tailwind's layered utilities (SEC-107).
const SCALE = 1.5;
const tokens = readFileSync(join(__dirname, "../../src/styles/tokens.css"), "utf8");
const sizes = [...tokens.matchAll(/--text-([a-z]+(?:-[a-z]+)*): (\d+)px;/g)];
const leading = new Map(
  [...tokens.matchAll(/--text-([a-z-]+?)--line-height: (\d+)px;/g)].map(([, name, px]) => [
    name,
    +px,
  ]),
);
const largeText = sizes
  .map(([, name, px]) => {
    const height = (leading.get(name) ?? +px * 1.4) * SCALE;
    return `.text-${name}{font-size:${+px * SCALE}px;line-height:var(--tw-leading,${height}px)}`;
  })
  .join("\n");

test.beforeEach(async ({ page }) => {
  await page.addInitScript((css) => {
    const add = () =>
      document.head.append(Object.assign(document.createElement("style"), { textContent: css }));
    if (document.head) add();
    else document.addEventListener("DOMContentLoaded", add);
  }, largeText);
});

async function expectNoSidewaysScroll(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBe(clientWidth);
}

test.describe("a phone's large text, as Zalo shows it", () => {
  test("the dish's sheet fits the screen and its button stays whole", async ({ page }) => {
    await page.goto("/vi/sellers/se-la-paris");
    await (
      await hydrated(page.getByRole("button", { name: "Bánh Croissant Truyền Thống", exact: true }))
    ).click();
    const sheet = page.getByRole("dialog", { name: "Bánh Croissant Truyền Thống" });
    const add = sheet.getByRole("button", { name: /^Thêm vào giỏ/ });
    await expect(add).toBeVisible();
    await expect(sheet.locator("p.text-body-sm").first()).toHaveCSS("font-size", `${14 * SCALE}px`);

    await expectNoSidewaysScroll(page);
    const box = await add.boundingBox();
    expect(box && box.x + box.width).toBeLessThanOrEqual(360);
    await add.click();
    await expect(sheet).toBeHidden();
  });

  test("the home fits the screen, the bar's labels stay in it and the grid's prices are whole", async ({
    page,
  }) => {
    await page.goto("/vi");
    const nav = page.getByRole("navigation", { name: "Điều hướng chính" });
    await expect(nav).toBeVisible();
    await expectNoSidewaysScroll(page);

    // A tab's label inside the bar, not running out under it.
    const outside = await nav.evaluate((bar) => {
      const { bottom } = bar.getBoundingClientRect();
      return [...bar.querySelectorAll("li span:not(.sr-only)")]
        .filter((label) => label.getBoundingClientRect().bottom > bottom)
        .map((label) => label.textContent);
    });
    expect(outside).toEqual([]);

    // Every price inside its card, none cut by the card's edge.
    const cut = await page.evaluate(
      () =>
        [...document.querySelectorAll("article .text-price-lg")].filter((price) => {
          const card = price.closest("article")!.getBoundingClientRect();
          return price.getBoundingClientRect().right > card.right + 0.5;
        }).length,
    );
    expect(cut).toBe(0);
  });

  test("the cart's order button stays whole, and the order page keeps its number on one line", async ({
    page,
  }) => {
    await page.goto("/vi/sellers/se-la-paris");
    await (
      await hydrated(
        page.getByRole("button", { name: "Thêm một phần Bánh Croissant Truyền Thống" }),
      )
    ).click();
    await page.goto("/vi/cart");
    const order = await hydrated(page.getByRole("button", { name: "Đặt món" }));
    await expectNoSidewaysScroll(page);
    const box = await order.boundingBox();
    expect(box && box.x + box.width).toBeLessThanOrEqual(360);

    await order.click();
    const sheet = page.getByRole("dialog", { name: "Người đến nhận" });
    await sheet.getByLabel("Tên").fill("Lan");
    await sheet.getByLabel("Số điện thoại").fill("0900000000");
    await sheet.getByRole("button", { name: "Tiếp tục" }).click();
    await page
      .getByRole("alertdialog", { name: "Xác nhận đặt đơn với số điện thoại" })
      .getByRole("button", { name: "Đúng, đặt món" })
      .click();
    await expect(page).toHaveURL(/\/vi\/orders\/[0-9a-f-]{36}$/);

    const number = page.getByText(/^#SB-\d+$/);
    await expect(number).toBeVisible();
    await expectNoSidewaysScroll(page);
    // One line: no taller than its own line height.
    const { height, lineHeight } = await number.evaluate((element) => ({
      height: element.getBoundingClientRect().height,
      lineHeight: parseFloat(getComputedStyle(element).lineHeight),
    }));
    expect(height).toBeLessThanOrEqual(lineHeight + 1);
  });
});
