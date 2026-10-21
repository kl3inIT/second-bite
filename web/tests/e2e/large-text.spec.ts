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
  test("the dish page fits the screen and its button stays whole", async ({ page }) => {
    await page.goto("/vi/offers/of-croissant");
    const add = await hydrated(page.getByRole("button", { name: "Thêm vào giỏ" }));
    await expect(page.locator("main p").first()).toHaveCSS("font-size", `${15 * SCALE}px`);

    await expectNoSidewaysScroll(page);
    const box = await add.boundingBox();
    expect(box && box.x + box.width).toBeLessThanOrEqual(360);
    await add.click();
    await expect(page.getByRole("link", { name: "Xem giỏ hàng" })).toBeVisible();
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
});
