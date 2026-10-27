import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";
import { pinHere, TASCO_MALL } from "./pin";

test.use({ locale: "vi-VN", permissions: ["geolocation"], geolocation: TASCO_MALL });
// Each test signs in and opens a store first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

/** Signs in with the stub's right code, opens a store of that name and lands on its home. */
async function storeNamed(
  page: Page,
  who: string,
  testInfo: { project: { name: string } },
  name: string,
) {
  await page.goto(`/vi/sign-in?returnTo=${encodeURIComponent("/open-store")}`);
  await (
    await hydrated(page.getByLabel("Email"))
  ).fill(`${who}.${testInfo.project.name}@example.com`);
  await page.getByRole("button", { name: "Gửi mã" }).click();
  await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
  await (await hydrated(page.getByLabel("Tên quán"))).fill(name);
  await page.getByLabel("Số điện thoại").fill("0912345678");
  await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall");
  await pinHere(page);
  await page.getByRole("button", { name: "Tạo quán" }).click();
  await expect(page).toHaveURL(/\/vi\/stores\/se-1-/, { timeout: 20_000 });
  return page.url().split("/").pop() ?? "";
}

const figure = (page: Page, label: string) => page.getByRole("listitem").filter({ hasText: label });

// The store's home (Figma Q1b): a day's overview, what to do now, and the day's orders, posts and catalog.
test.describe("the home of a store", () => {
  test("sums the day and lists what is held, posted and in the catalog", async ({
    page,
  }, testInfo) => {
    const store = await storeNamed(page, "nga", testInfo, "Tiệm có đơn");

    await expect(page.getByRole("heading", { level: 1, name: "Tiệm có đơn" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Chọn ngày: Hôm nay/ })).toBeVisible();

    // Three orders being prepared and one ready; one handed over for 57.000đ; one post of which 2 of 3 sold.
    await expect(figure(page, "Đơn đang giữ")).toContainText("4");
    await expect(figure(page, "Đơn đang giữ")).toContainText("1 đã sẵn sàng");
    await expect(figure(page, "Tiền đã thu")).toContainText("57.000đ");
    await expect(figure(page, "Suất đã bán")).toContainText("2/3");
    await expect(figure(page, "Khách không đến")).toContainText("Trên 6 đơn");

    // What to do now stands on a computer; a phone opens straight on the orders (Figma Q1b-1).
    const todo = page.getByRole("region", { name: "Việc cần làm" });
    if (testInfo.project.name === "mobile") {
      await expect(todo).toHaveCount(0);
    } else {
      await expect(todo).toContainText("3 đơn chờ báo sẵn sàng");
      await expect(todo.getByRole("link", { name: "Xem đơn" })).toHaveAttribute(
        "href",
        `/vi/stores/${store}/orders`,
      );
    }

    const orders = page.getByRole("region", { name: "Đơn hôm nay" });
    await expect(orders.getByRole("link", { name: "Chuẩn bị · 3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(orders.getByRole("button", { name: "Báo sẵn sàng" })).toHaveCount(3);

    // A chip filters the home's own list: the page stays the home, with the ready order and its hand-over.
    await orders.getByRole("link", { name: "Sẵn sàng · 1" }).click();
    await expect(page).toHaveURL(new RegExp(`/vi/stores/${store}\\?tab=ready$`));
    await expect(orders.getByRole("link", { name: "Sẵn sàng · 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(orders).toContainText("Đỗ Hương");
    await expect(orders.getByRole("button", { name: "Đã giao" })).toHaveCount(1);
    await expect(orders.getByRole("button", { name: "Báo sẵn sàng" })).toHaveCount(0);
    await orders.getByRole("link", { name: "Chuẩn bị · 3" }).click();
    await expect(page).toHaveURL(new RegExp(`/vi/stores/${store}$`));

    const posts = page.getByRole("region", { name: "Bài đăng hôm nay" });
    await expect(posts).toContainText("Bánh mì que, 3 chiếc");
    await expect(posts).toContainText("Còn 1");
    // A phone draws each post as a box that says the portions left (Figma Q1b-1).
    if (testInfo.project.name === "mobile") await expect(posts).toContainText("Còn 1 phần");
    await expect(page.getByRole("region", { name: "Danh mục · 0 món" })).toContainText(
      "Chưa có món nào trong danh mục.",
    );
    // A chip keeps the place on the page; checked from the top, as every page is, so a blue button scrolled
    // behind the translucent bottom bar does not stand in for its ground. A phone, which leaves "Việc cần làm"
    // out, has an order's buttons under the bar even at the top, so it is read on a screen taller than the page.
    await page.evaluate(() => window.scrollTo(0, 0));
    const screen = page.viewportSize();
    if (testInfo.project.name === "mobile" && screen) {
      await page.setViewportSize({ width: screen.width, height: 3000 });
    }
    await expectNoSeriousA11yViolations(page);
    if (screen) await page.setViewportSize(screen);

    // Another day has its own numbers and nothing left to do.
    await page.getByRole("link", { name: "Ngày trước" }).click();
    await expect(page).toHaveURL(new RegExp(`/vi/stores/${store}\\?day=`));
    await expect(page.getByRole("region", { name: "Việc cần làm" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^Đơn ngày / })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("offers a hidden dish to show and the others to post", async ({ page }, testInfo) => {
    const store = await storeNamed(page, "xuan", testInfo, "Tiệm danh mục");

    await expect(page.getByText("Bắt đầu bán")).toBeVisible();
    const catalog = page.getByRole("region", { name: "Danh mục · 3 món" });
    await expect(catalog.getByRole("button", { name: "Hiện món" })).toHaveCount(1);
    await expect(catalog.getByRole("link", { name: "Đăng ngay" }).first()).toHaveAttribute(
      "href",
      new RegExp(`/vi/stores/${store}/catalog/di-1-.+/post`),
    );
    await expectNoSeriousA11yViolations(page);

    // The smallest phone the web is drawn for (360 px, as phone-layout.spec) still holds every box and the
    // orders' chips without a sideways page.
    if (testInfo.project.name === "mobile") {
      await page.setViewportSize({ width: 360, height: 720 });
      await expect(catalog.getByRole("link", { name: "Đăng ngay" }).first()).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    }
  });
});
