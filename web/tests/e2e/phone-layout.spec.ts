import { expect, test } from "@playwright/test";

test.use({ locale: "vi-VN" });

// The phone's layout must not change when the desktop's is built (SEC-101): below 768px a page shows its phone top
// bar and the bottom navigation, never the desktop header, and nothing scrolls sideways.
const PHONE_WIDTHS = [360, 412];
const pages = [
  { path: "/vi", top: { role: "heading", name: "Tối nay ở Tasco Mall" }, bar: true },
  // The search is a screen of its own, left by its back arrow, so it has no bottom bar.
  { path: "/vi/search", top: { role: "searchbox", name: "Tìm món hoặc quán" }, bar: false },
  { path: "/vi/favourites", top: { role: "heading", name: "Yêu thích" }, bar: true },
  { path: "/vi/account", top: { role: "heading", name: "Tài khoản" }, bar: true },
] as const;

for (const width of PHONE_WIDTHS) {
  test.describe(`a phone ${width}px wide`, () => {
    for (const { path, top, bar } of pages) {
      test(`${path} keeps the phone's top bar and bottom bar and does not scroll sideways`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(path);

        await expect(
          page.getByRole(top.role, {
            name: top.name,
            level: top.role === "heading" ? 1 : undefined,
          }),
        ).toBeVisible();
        await expect(page.getByRole("navigation", { name: "Điều hướng chính" })).toHaveCount(
          bar ? 1 : 0,
        );
        // The desktop header's search field and footer stay out.
        await expect(page.getByRole("contentinfo")).toBeHidden();
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }

    test("the search's field keeps 16px words, so Safari does not zoom the page into it", async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/vi/search");

      await expect(page.getByRole("searchbox", { name: "Tìm món hoặc quán" })).toHaveCSS(
        "font-size",
        "16px",
      );
    });

    test("the search shows its back arrow, not the header's wordmark", async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/vi/search");

      await expect(page.getByRole("link", { name: "Về trang chủ", exact: true })).toBeVisible();
      await expect(page.getByRole("link", { name: "Second Bite, về trang chủ" })).toHaveCount(0);
      await expect(page.getByRole("searchbox", { name: "Tìm món hoặc quán" })).toHaveCount(1);
    });
  });
}
