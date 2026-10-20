import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in and opens a store first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

/** Signs in with the stub's right code and lands on `returnTo`. */
async function signIn(page: Page, email: string, returnTo: string) {
  await page.goto(`/vi/sign-in?returnTo=${encodeURIComponent(returnTo)}`);
  await (await hydrated(page.getByLabel("Email"))).fill(email);
  await page.getByRole("button", { name: "Gửi mã" }).click();
  await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
  await page.waitForURL((url) => !url.pathname.includes("/sign-in"));
}

// SEC-57 › Open a store (Figma O1, O1b, S0).
test.describe("opening a store on the web", () => {
  test("someone not signed in signs in first and comes back to the form", async ({
    page,
  }, testInfo) => {
    await page.goto("/vi/open-store");
    await expect(page).toHaveURL(/\/vi\/sign-in\?returnTo=%2Fopen-store$/);

    await (
      await hydrated(page.getByLabel("Email"))
    ).fill(`lan.${testInfo.project.name}@example.com`);
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
    await expect(page).toHaveURL(/\/vi\/open-store$/);
    await expect(page.getByRole("heading", { level: 1, name: "Mở quán của bạn" })).toBeVisible();
  });

  test("opens a store and lists it", async ({ page }, testInfo) => {
    await signIn(page, `mai.${testInfo.project.name}@example.com`, "/stores");
    await expect(page.getByRole("heading", { level: 1, name: "Bạn chưa có quán" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("link", { name: "Tạo quán mới" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Mở quán của bạn" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByLabel("Tên quán"))).fill("Quán Hoa Sữa");
    await page.getByLabel("Số điện thoại").fill("123");
    await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall, Long Biên");
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(
      page.getByText("Nhập số điện thoại 9 đến 15 chữ số, ví dụ 0912 345 678."),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByLabel("Số điện thoại").fill("0912 345 678");
    await page.getByRole("button", { name: "Tạo quán" }).click();

    // The new store's home, where it invites the first post (Figma Q1).
    await expect(page).toHaveURL(/\/vi\/stores\/se-1-/);
    await expect(page.getByRole("heading", { level: 1, name: "Quán Hoa Sữa" })).toBeVisible();
    await expect(page.getByText("Bắt đầu bán")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.goto("/vi/stores");
    await expect(page.getByRole("heading", { level: 1, name: "Quán của tôi" })).toBeVisible();
    await expect(page.getByText("Quán Hoa Sữa")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("a store's posts are in three tabs", async ({ page }, testInfo) => {
    await signIn(page, `lien.${testInfo.project.name}@example.com`, "/open-store");
    await (await hydrated(page.getByLabel("Tên quán"))).fill("Tiệm bánh Pháp");
    await page.getByLabel("Số điện thoại").fill("0912345678");
    await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall");
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(page).toHaveURL(/\/vi\/stores\/se-1-/);

    await expect(page.getByText("Túi bánh mì và croissant, 4 chiếc")).toBeVisible();
    await page.getByRole("link", { name: "Bài đăng" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Bài đăng" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Đang bán · 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const row = (text: RegExp) => page.getByRole("listitem").filter({ hasText: text });
    await expect(row(/Còn 3\/3 suất · 57\.000đ/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Sửa" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("link", { name: "Đã hết · 1" }).click();
    await expect(row(/Xôi thập cẩm, 1 hộp/)).toBeVisible();
    await expect(row(/Hết 4\/4 suất/)).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("link", { name: "Đã đóng · 2" }).click();
    await expect(row(/Bánh su kem, 6 cái/)).toBeVisible();
    await expect(row(/Hết giờ lấy · bán 2\/3 suất/)).toBeVisible();
    await expect(row(/Đã rút · 57\.000đ/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Đăng lại" })).toHaveCount(2);
    await expectNoSeriousA11yViolations(page);
  });

  test("a store that is not yours is not found", async ({ page }, testInfo) => {
    await signIn(page, `nam.${testInfo.project.name}@example.com`, "/stores");
    await page.goto("/vi/stores/se-9-nothere");
    await expect(
      page.getByRole("heading", { level: 1, name: "Không tìm thấy trang này" }),
    ).toBeVisible();
  });

  test("stops at five stores", async ({ page }, testInfo) => {
    await signIn(page, `huy.${testInfo.project.name}@example.com`, "/open-store");
    for (let n = 1; n <= 5; n++) {
      await (await hydrated(page.getByLabel("Tên quán"))).fill(`Quán ${n}`);
      await page.getByLabel("Số điện thoại").fill("0912345678");
      await page.getByLabel("Địa chỉ quán").fill("Tasco Mall");
      await page.getByRole("button", { name: "Tạo quán" }).click();
      await expect(page).toHaveURL(/\/vi\/stores\/se-/);
      if (n < 5) await page.goto("/vi/open-store");
    }
    await page.goto("/vi/stores");
    await expect(page.getByRole("link", { name: "Tạo quán mới" })).toHaveCount(0);

    await page.goto("/vi/open-store");
    await (await hydrated(page.getByLabel("Tên quán"))).fill("Quán 6");
    await page.getByLabel("Số điện thoại").fill("0912345678");
    await page.getByLabel("Địa chỉ quán").fill("Tasco Mall");
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(page.getByText("Bạn đã có đủ 5 quán. Hãy dùng một trong số đó.")).toBeVisible();
  });
});

// SEC-57 › Posting (Figma P1 to P3, P2b, P3e, P5, R1).
test.describe("posting a dish on the web", () => {
  /** A store named like the Figma sample, which the stub gives four earlier posts. */
  async function sampleStore(
    page: Page,
    who: string,
    testInfo: { project: { name: string } },
    name = "Tiệm bánh Pháp",
  ) {
    await signIn(page, `${who}.${testInfo.project.name}@example.com`, "/open-store");
    await (await hydrated(page.getByLabel("Tên quán"))).fill(name);
    await page.getByLabel("Số điện thoại").fill("0912345678");
    await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall");
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(page).toHaveURL(/\/vi\/stores\/se-1-/);
    return page.url().split("/").pop() ?? "";
  }

  test("posts an earlier dish, with the price refused first", async ({ page }, testInfo) => {
    const store = await sampleStore(page, "thao", testInfo);
    await page.goto(`/vi/stores/${store}/offers`);
    await page.getByRole("link", { name: "Đăng món" }).click();

    const drawer = page.getByRole("dialog");
    await expect(drawer.getByText("Bước 1 / 3")).toBeVisible();
    await expect(drawer.getByText("Báo trước dự kiến dư")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await drawer.getByRole("button", { name: "Tiếp tục" }).click();

    await expect(drawer.getByText("Bước 2 / 3")).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Tiếp tục" })).toBeDisabled();
    await drawer
      .getByRole("listitem")
      .filter({ hasText: "Túi bánh mì và croissant, 4 chiếc" })
      .getByRole("button", { name: "Chọn" })
      .click();
    await expectNoSeriousA11yViolations(page);
    await drawer.getByRole("button", { name: "Tiếp tục" }).click();

    await expect(drawer.getByText("Bán thế nào?")).toBeVisible();
    await expect(drawer.getByLabel("Giá bán (đồng)")).toHaveValue("57.000");
    await drawer.getByRole("button", { name: "Ngay bây giờ" }).click();
    await drawer.getByLabel("Giá bán (đồng)").fill("80000");
    await drawer.getByRole("button", { name: "Đăng", exact: true }).click();
    await expect(
      drawer.getByText("Giá bán phải thấp hơn giá gốc ít nhất 20%, tức tối đa 76.000đ."),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await drawer.getByLabel("Giá bán (đồng)").fill("70000");
    await drawer.getByRole("button", { name: "Đăng", exact: true }).click();
    await expect(page.getByText("Đã đăng 3 suất. Khách đặt được ngay.")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("link", { name: "Đang bán · 2" })).toBeVisible();
  });

  test("posts a one-off dish with a photo, and a mixed box says what it holds", async ({
    page,
  }, testInfo) => {
    const store = await sampleStore(page, "quynh", testInfo);
    await page.goto(`/vi/stores/${store}/offers/new`);
    const drawer = page.getByRole("dialog");
    await drawer.getByRole("button", { name: "Tiếp tục" }).click();
    await drawer.getByRole("button", { name: "Món đột xuất" }).click();
    await drawer.getByLabel("Ảnh món").setInputFiles({
      name: "flan.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        "base64",
      ),
    });
    await drawer.getByLabel("Tên món").fill("Hộp bánh cuối ngày");
    await drawer.getByRole("button", { name: "Hộp tổng hợp" }).click();
    await expect(drawer.getByLabel("Hộp gồm những gì")).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Tiếp tục" })).toBeDisabled();
    await drawer.getByLabel("Hộp gồm những gì").fill("Bánh mì và bánh ngọt, có trứng");
    await expectNoSeriousA11yViolations(page);
    await drawer.getByRole("button", { name: "Tiếp tục" }).click();

    await drawer.getByLabel("Số lượng").fill("6");
    await drawer.getByLabel("Giá gốc (đồng)").fill("60000");
    await drawer.getByLabel("Giá bán (đồng)").fill("36000");
    await expect(
      drawer.getByText("Giảm 40% so với giá gốc. Mức giảm tối thiểu là 20%."),
    ).toBeVisible();
    await drawer.getByRole("button", { name: "Ngay bây giờ" }).click();
    await drawer.getByRole("button", { name: "1 tiếng rưỡi" }).click();
    await expect(
      drawer.getByText(/Khách đến lấy từ \d\d:\d\d đến \d\d:\d\d hôm nay/),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await drawer.getByRole("button", { name: "Đăng", exact: true }).click();
    await expect(page.getByText("Đã đăng 6 suất. Khách đặt được ngay.")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("posts a closed post again, from the last step", async ({ page }, testInfo) => {
    const store = await sampleStore(page, "uyen", testInfo);
    await page.goto(`/vi/stores/${store}/offers?tab=closed`);
    await page.getByRole("link", { name: "Đăng lại" }).first().click();

    const drawer = page.getByRole("dialog");
    await expect(drawer.getByText("Từ bài đã đóng")).toBeVisible();
    await expect(drawer.getByText("Bán lại thế nào?")).toBeVisible();
    await expect(drawer.getByLabel("Số lượng")).not.toHaveValue("");
    await expectNoSeriousA11yViolations(page);
    await drawer.getByRole("button", { name: "Ngay bây giờ" }).click();
    await drawer.getByRole("button", { name: "Đăng", exact: true }).click();
    await expect(page.getByText(/Đã đăng \d suất\. Khách đặt được ngay\./)).toBeVisible();
  });
});

// SEC-57 › Changing and withdrawing a live post (Figma E1, E2, E2e, E3, E3b, K1).
test.describe("changing a post on the web", () => {
  async function storeNamed(
    page: Page,
    who: string,
    testInfo: { project: { name: string } },
    name: string,
  ) {
    await signIn(page, `${who}.${testInfo.project.name}@example.com`, "/open-store");
    await (await hydrated(page.getByLabel("Tên quán"))).fill(name);
    await page.getByLabel("Số điện thoại").fill("0912345678");
    await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall");
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(page).toHaveURL(/\/vi\/stores\/se-1-/);
    return page.url().split("/").pop() ?? "";
  }

  test("changes the units and the price of a post nobody has ordered", async ({
    page,
  }, testInfo) => {
    const store = await storeNamed(page, "vy", testInfo, "Tiệm bánh Pháp");
    await page.goto(`/vi/stores/${store}/offers`);
    await page.getByRole("link", { name: "Sửa" }).click();

    const drawer = page.getByRole("dialog");
    await expect(drawer.getByText("Sửa bài đăng")).toBeVisible();
    await expect(drawer.getByText("Đang bán", { exact: true })).toBeVisible();
    await expect(
      drawer.getByText(/Chưa ai đặt, nên bạn sửa được số suất, giá và giờ lấy\./),
    ).toBeVisible();
    await expect(drawer.getByLabel("Số lượng")).toHaveValue("3");
    await expectNoSeriousA11yViolations(page);

    await drawer.getByLabel("Số lượng").fill("5");
    await drawer.getByLabel("Giá bán (đồng)").fill("70000");
    await drawer.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByText("Đã lưu.")).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByRole("listitem").filter({ hasText: /Còn 5\/5 suất · 70\.000đ/ }),
    ).toBeVisible();
  });

  test("locks the price and the hours once units are ordered, and refuses fewer units", async ({
    page,
  }, testInfo) => {
    const store = await storeNamed(page, "bao", testInfo, "Tiệm có đơn");
    await page.goto(`/vi/stores/${store}/offers`);
    await page.getByRole("link", { name: "Sửa" }).click();

    const drawer = page.getByRole("dialog");
    await expect(drawer.getByText("Đang bán, đã có 2 suất được đặt")).toBeVisible();
    await expect(drawer.getByLabel("Giá bán (đồng)")).toBeDisabled();
    await expect(drawer.getByLabel("Giá gốc (đồng)")).toBeDisabled();
    await expect(drawer.getByRole("button", { name: "Ngay bây giờ" })).toBeDisabled();
    await expect(drawer.getByRole("button", { name: "Rút bài" })).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);

    await drawer.getByLabel("Số lượng").fill("1");
    await drawer.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(
      drawer.getByText("Số suất không được thấp hơn 2, vì đã có 2 suất được đặt."),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await drawer.getByLabel("Số lượng").fill("4");
    await drawer.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByText("Đã lưu.")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("listitem").filter({ hasText: /Còn 2\/4 suất/ })).toBeVisible();
  });

  test("withdraws a post nobody has ordered into Đã đóng", async ({ page }, testInfo) => {
    const store = await storeNamed(page, "khoa", testInfo, "Tiệm bánh Pháp");
    await page.goto(`/vi/stores/${store}/offers`);
    await page.getByRole("link", { name: "Sửa" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Rút bài" }).click();

    const drawer = page.getByRole("dialog");
    await expect(drawer.getByText("Rút bài này?")).toBeVisible();
    await expect(drawer.getByText("Bài rút vẫn lưu ở tab Đã đóng, đăng lại được.")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await drawer.getByRole("button", { name: "Rút bài" }).click();

    await expect(page.getByText(/Đã rút bài\. Bài nằm ở tab Đã đóng/)).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("link", { name: "Đã đóng · 3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("does not withdraw a post that has orders", async ({ page }, testInfo) => {
    const store = await storeNamed(page, "tam", testInfo, "Tiệm có đơn");
    await page.goto(`/vi/stores/${store}/offers/of-1-${store}/withdraw`);

    const drawer = page.getByRole("dialog");
    await expect(
      drawer.getByText(/Bài này đã có 2 suất được đặt nên chưa rút được\./),
    ).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Rút bài" })).toHaveCount(0);
    await expect(drawer.getByRole("link", { name: "Đến tab Đơn" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
});
