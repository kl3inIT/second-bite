import { expect, test, type Locator, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";
import { pinHere, TASCO_MALL } from "./pin";

test.use({ locale: "vi-VN", permissions: ["geolocation"], geolocation: TASCO_MALL });

// A one-pixel PNG, the store's photo in the checks below.
const onePixel =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

/** Let native inertia and the wheel's idle recenter finish before the next interaction. */
async function settledWheel(wheel: Locator) {
  let previous: number | undefined;
  let unchangedSince = Date.now();
  await expect
    .poll(
      async () => {
        const top = await wheel.evaluate((element) => element.scrollTop);
        if (top !== previous) {
          previous = top;
          unchangedSince = Date.now();
        }
        return Date.now() - unchangedSince;
      },
      { intervals: [100], timeout: 5_000 },
    )
    .toBeGreaterThanOrEqual(300);
}

/** Scroll an actual wheel to its centred row; the editor exposes no text input. */
async function pickTime(popup: Locator, hour: number, minute: number) {
  for (const [name, value] of [
    ["Giờ", hour],
    ["Phút", minute],
  ] as const) {
    const wheel = popup.getByRole("spinbutton", { name, exact: true });
    await settledWheel(wheel);
    await wheel.evaluate((element, target) => {
      const row = element.querySelector<HTMLElement>("[aria-hidden] > div")!;
      const count = Number(element.getAttribute("aria-valuemax")) + 1;
      // Layout height stays fixed while the opening popover animation scales its painted bounds.
      element.scrollTop = (count + target) * row.offsetHeight;
    }, value);
    await settledWheel(wheel);
    await expect(wheel).toHaveAttribute("aria-valuenow", String(value));
  }
}
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

  test("fills the address from where the person stands, and pins the store there", async ({
    page,
    context,
  }, testInfo) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 21.0367, longitude: 105.7818, accuracy: 20 });
    await signIn(page, `dinh.${testInfo.project.name}@example.com`, "/open-store");

    await (await hydrated(page.getByLabel("Tên quán"))).fill("Quán Cầu Giấy");
    await page.getByLabel("Số điện thoại").fill("0912345678");
    await page.getByRole("button", { name: "Dùng vị trí hiện tại" }).click();
    await expect(page.getByLabel("Địa chỉ quán")).toHaveValue(
      "21 Phố Cầu Giấy, Dịch Vọng, Cầu Giấy, Hà Nội",
    );
    await expect(
      page.getByText("Đã lấy vị trí hiện tại, sai số khoảng 20 m. Bạn có thể sửa địa chỉ."),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    // The store is pinned where the person stood, not at the mall.
    const sent = page.waitForRequest(
      (request) =>
        request.method() === "POST" && new URL(request.url()).pathname.endsWith("/sellers"),
    );
    await pinHere(page);
    await page.getByRole("button", { name: "Tạo quán" }).click();
    const body = (await sent).postDataJSON() as {
      address: string;
      latitude: number;
      longitude: number;
    };
    expect(body.latitude).toBeCloseTo(21.0367, 3);
    expect(body.longitude).toBeCloseTo(105.7818, 3);
    // The address sent is the one in the field, and the body holds nothing the API does not know.
    expect(body.address).toBe("21 Phố Cầu Giấy, Dịch Vọng, Cầu Giấy, Hà Nội");
    expect(Object.keys(body).sort()).toEqual(["address", "latitude", "longitude", "name", "phone"]);
  });

  test("keeps an address the person wrote, and says when no street is found", async ({
    page,
    context,
  }, testInfo) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 21.0367, longitude: 105.7818, accuracy: 20 });
    await signIn(page, `mai.${testInfo.project.name}@example.com`, "/open-store");

    await (await hydrated(page.getByLabel("Địa chỉ quán"))).fill("Tầng 2, Tasco Mall");
    await page.getByRole("button", { name: "Dùng vị trí hiện tại" }).click();
    await expect(page.getByText(/Địa chỉ giữ như bạn đã nhập/)).toBeVisible();
    await expect(page.getByLabel("Địa chỉ quán")).toHaveValue("Tầng 2, Tasco Mall");

    // Somewhere the geocoder knows nothing of: the store is pinned and the person writes the address.
    await context.setGeolocation({ latitude: 10.77, longitude: 106.7, accuracy: 30 });
    await page.getByLabel("Địa chỉ quán").fill("");
    await page.getByRole("button", { name: "Dùng vị trí hiện tại" }).click();
    await expect(page.getByText(/Chưa tìm được tên đường, bạn nhập địa chỉ nhé/)).toBeVisible();
    await expect(page.getByLabel("Địa chỉ quán")).toHaveValue("");
  });

  test("an empty form says what is missing under each field, the first one focused", async ({
    page,
  }, testInfo) => {
    await signIn(page, `trong.${testInfo.project.name}@example.com`, "/open-store");
    await (await hydrated(page.getByRole("button", { name: "Tạo quán" }))).click();
    await expect(page.getByLabel("Tên quán")).toBeFocused();
    await expect(page.getByText("Nhập tên quán.")).toBeVisible();
    await expect(page.getByText("Nhập địa chỉ quán.")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    // A field put right is no longer refused, as it is typed.
    await page.getByLabel("Tên quán").fill("Quán Trống");
    await expect(page.getByText("Nhập tên quán.")).toBeHidden();
  });

  test("says when the location is not given, and the address is typed", async ({
    page,
    context,
  }, testInfo) => {
    await context.clearPermissions();
    await signIn(page, `huong.${testInfo.project.name}@example.com`, "/open-store");
    await (await hydrated(page.getByLabel("Tên quán"))).fill("Quán Hương");
    await page.getByRole("button", { name: "Dùng vị trí hiện tại" }).click();
    await expect(page.getByText(/Chưa lấy được vị trí/)).toBeVisible();
    await expectNoSeriousA11yViolations(page);
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
    await pinHere(page);
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(
      page.getByText("Nhập số điện thoại 9 đến 15 chữ số, ví dụ 0912 345 678."),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByLabel("Số điện thoại").fill("0912 345 678");
    await pinHere(page);
    await page.getByRole("button", { name: "Tạo quán" }).click();

    // The new store's home, where it invites the first post (Figma Q1).
    await expect(page).toHaveURL(/\/vi\/stores\/se-1-/);
    await expect(page.getByRole("heading", { level: 1, name: "Quán Hoa Sữa" })).toBeVisible();
    await expect(page.getByText("Bắt đầu bán")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    // With one store, the way to the stores goes straight into it.
    await page.goto("/vi/stores");
    await expect(page).toHaveURL(/\/vi\/stores\/se-1-/);
    await expect(page.getByRole("heading", { level: 1, name: "Quán Hoa Sữa" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("the header goes into the only store, or lists several to pick from", async ({
    page,
  }, testInfo) => {
    await signIn(page, `hoa.${testInfo.project.name}@example.com`, "/open-store");
    for (const name of ["Quán Một", "Quán Hai"]) {
      await page.goto("/vi/open-store");
      await (await hydrated(page.getByLabel("Tên quán"))).fill(name);
      await page.getByLabel("Số điện thoại").fill("0912345678");
      await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall");
      await pinHere(page);
      await page.getByRole("button", { name: "Tạo quán" }).click();
      await expect(page).toHaveURL(/\/vi\/stores\/se-\d-/, { timeout: 20_000 });
    }

    await page.goto("/vi");
    await page.getByRole("link", { name: "Mở quán" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Quán của tôi" })).toBeVisible();
    await expect(page.getByRole("link", { name: /^Quán Một/ })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("link", { name: /^Quán Hai/ }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Quán Hai" })).toBeVisible();
  });

  test("shows the store's photo in its header and in the list of stores", async ({
    page,
  }, testInfo) => {
    await signIn(page, `anh.${testInfo.project.name}@example.com`, "/open-store");
    await (await hydrated(page.getByLabel("Tên quán"))).fill("Ăn cùng chú Nhật");
    await page.getByLabel("Số điện thoại").fill("0912345678");
    await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall");
    await page.getByLabel("Ảnh đại diện quán").setInputFiles({
      name: "quan.png",
      mimeType: "image/png",
      buffer: Buffer.from(onePixel, "base64"),
    });
    await pinHere(page);
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(page).toHaveURL(/\/vi\/stores\/se-1-/, { timeout: 20_000 });

    // The capsule of the store's name has its photo, not only its initials.
    const photo = page.locator('header [data-slot="avatar-image"]').first();
    await expect(photo).toHaveAttribute("src", /\/api\/photos\/ph-upload\/400\.jpg/);
  });

  test("the store's name opens a menu to the stores and a new store, and the shop is beside the language", async ({
    page,
  }, testInfo) => {
    await signIn(page, `bich.${testInfo.project.name}@example.com`, "/open-store");
    await (await hydrated(page.getByLabel("Tên quán"))).fill("Quán Một");
    await page.getByLabel("Số điện thoại").fill("0912345678");
    await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall");
    await pinHere(page);
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(page).toHaveURL(/\/vi\/stores\/se-1-/, { timeout: 20_000 });

    // The way back to the shop is a button of the header, not an item of the menu.
    await expect(page.getByRole("link", { name: "Mua đồ" })).toHaveAttribute("href", /\/vi$/);

    // With one store the name still opens the menu, and does not reload the page.
    await page.getByRole("button", { name: "Quán Một", exact: true }).click();
    await expect(page.getByRole("menuitem", { name: "Mua đồ" })).toHaveCount(0);
    await expect(page.getByRole("menuitem", { name: "Quán Một" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect(page.getByRole("menuitem", { name: "Tạo thêm quán" })).toHaveAttribute(
      "href",
      /\/vi\/open-store$/,
    );
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("menuitem", { name: "Tạo thêm quán" }).click();
    await expect(page).toHaveURL(/\/vi\/open-store$/);
  });

  test("a store's posts are in three tabs", async ({ page }, testInfo) => {
    await signIn(page, `lien.${testInfo.project.name}@example.com`, "/open-store");
    await (await hydrated(page.getByLabel("Tên quán"))).fill("Tiệm bánh Pháp");
    await page.getByLabel("Số điện thoại").fill("0912345678");
    await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall");
    await pinHere(page);
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
    await expect(row(/Hết giờ nhận · bán 2\/3 suất/)).toBeVisible();
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
      await pinHere(page);
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
    await pinHere(page);
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
    await pinHere(page);
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(page).toHaveURL(/\/vi\/stores\/se-1-/);
    return page.url().split("/").pop() ?? "";
  }

  test("posts an earlier dish using the default discount and a selected percentage", async ({
    page,
  }, testInfo) => {
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

    await expect(drawer.getByText("Giá bán & số lượng")).toBeVisible();
    await expect(drawer.getByLabel("Giá bán (đồng)")).toHaveText("76.000đ");
    await expect(drawer.getByRole("button", { name: "20%", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await drawer.getByRole("button", { name: "30%", exact: true }).click();
    await expect(drawer.getByLabel("Giá bán (đồng)")).toHaveText("66.500đ");
    await expectNoSeriousA11yViolations(page);
    await drawer.getByRole("button", { name: "Đăng", exact: true }).click();
    await expect(page.getByText("Đã đăng 3 suất. Khách đặt được ngay.")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("link", { name: "Đang bán · 2" })).toBeVisible();
  });

  test("applies custom discounts and pickup times without changing cancelled drafts", async ({
    page,
    isMobile,
  }, testInfo) => {
    await page.setViewportSize({ width: isMobile ? 390 : 1440, height: 900 });
    const store = await sampleStore(page, "price-time", testInfo);
    const openedAfter = Date.now();
    await page.goto(`/vi/stores/${store}/offers/new`);
    const drawer = page.getByRole("dialog", { name: "Đăng món", exact: true });
    await (await hydrated(drawer.getByRole("button", { name: "Tiếp tục" }))).click();
    await drawer
      .getByRole("listitem")
      .filter({ hasText: "Túi bánh mì và croissant, 4 chiếc" })
      .getByRole("button", { name: "Chọn", exact: true })
      .click();
    await drawer.getByRole("button", { name: "Tiếp tục" }).click();
    await drawer.getByLabel("Giá gốc (đồng)").fill("20000");
    await drawer.getByLabel("Số lượng").fill("5");
    const sale = drawer.getByLabel("Giá bán (đồng)");
    await expect(sale).toHaveText("16.000đ");
    await expect(drawer.locator("del")).toHaveText("20.000đ");
    const original = await drawer.getByLabel("Giá gốc (đồng)").boundingBox();
    const quantity = await drawer.getByLabel("Số lượng").boundingBox();
    expect(original!.x).toBeLessThan(quantity!.x);
    expect(original!.y).toBeCloseTo(quantity!.y, 0);
    const startGroup = drawer.getByRole("group", { name: "Bắt đầu", exact: true });
    const endGroup = drawer.getByRole("group", { name: "Kết thúc", exact: true });
    const initialStart = await startGroup.getByRole("button").first().innerText();
    const vietnamClock = (at: number) =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(at);
    expect([vietnamClock(openedAfter), vietnamClock(Date.now())]).toContain(initialStart);
    await expect(startGroup.getByRole("button").first()).toHaveAttribute("aria-pressed", "true");
    await expect(drawer.getByRole("button", { name: /bây giờ/i })).toHaveCount(0);
    for (const [name, count] of [
      ["Giảm giá (%)", 5],
      ["Bắt đầu", 5],
      ["Kết thúc", 5],
    ] as const) {
      const group = drawer.getByRole("group", { name, exact: true });
      const buttons = group.getByRole("button");
      await expect(buttons).toHaveCount(count);
      // Browsers quantize a 1.5px stroke to device pixels; the input-edge colour must stay the same.
      expect(
        await buttons
          .nth(1)
          .evaluate((element) => parseFloat(getComputedStyle(element).borderTopWidth)),
      ).toBeGreaterThanOrEqual(1);
      await expect(buttons.nth(1)).toHaveCSS(
        "border-top-color",
        await drawer
          .getByLabel("Giá gốc (đồng)")
          .evaluate((element) => getComputedStyle(element).borderTopColor),
      );
      const boxes = await buttons.evaluateAll((elements) =>
        elements.map((element) => {
          const box = element.getBoundingClientRect();
          return { x: box.x, y: box.y, width: box.width, height: box.height };
        }),
      );
      const bounds = await group.boundingBox();
      expect(boxes[0]!.x).toBeCloseTo(bounds!.x, 0);
      expect(boxes.at(-1)!.x + boxes.at(-1)!.width).toBeCloseTo(bounds!.x + bounds!.width, 0);
      for (const box of boxes) {
        expect(box.y).toBeCloseTo(boxes[0]!.y, 0);
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeCloseTo(boxes[0]!.width, 0);
      }
    }
    await expectNoSeriousA11yViolations(page);
    await page.screenshot({ path: testInfo.outputPath("posting-layout.png") });
    await drawer.getByRole("button", { name: "50%", exact: true }).click();
    await drawer.getByLabel("Giá gốc (đồng)").fill("30000");
    await expect(sale).toHaveText("15.000đ");
    await drawer.getByLabel("Giá gốc (đồng)").fill("20000");
    await drawer.getByRole("button", { name: /^Mức giảm khác:/ }).click();
    let popup = page.getByRole("dialog", { name: "Mức giảm khác", exact: true });
    await expect(popup.getByRole("button", { name: "90%", exact: true })).toBeVisible();
    await popup.getByRole("button", { name: "70%", exact: true }).click();
    await expect(sale).toHaveText("6.000đ");
    await drawer.getByRole("button", { name: /^Mức giảm khác:/ }).click();
    await popup.getByRole("button", { name: "Nhập mức khác…", exact: true }).click();
    await popup.getByLabel("Giảm giá (%)").fill("35");
    await expect(popup.getByText("Giá bán: 13.000đ")).toBeVisible();
    await popup.getByRole("button", { name: "Hủy", exact: true }).click();
    await expect(sale).toHaveText("6.000đ");
    await drawer.getByRole("button", { name: /^Mức giảm khác:/ }).click();
    await popup.getByRole("button", { name: "Nhập mức khác…", exact: true }).click();
    await popup.getByLabel("Giảm giá (%)").fill("19");
    await popup.getByRole("button", { name: "Áp dụng", exact: true }).click();
    await expect(popup.getByText("Nhập số nguyên từ 20% đến 99%.")).toBeVisible();
    await expect(sale).toHaveText("6.000đ");
    await popup.getByLabel("Giảm giá (%)").fill("35");
    await expectNoSeriousA11yViolations(page);
    await page.screenshot({ path: testInfo.outputPath("custom-discount.png") });
    await popup.getByRole("button", { name: "Áp dụng", exact: true }).click();
    await expect(sale).toHaveText("13.000đ");
    await expect(drawer.getByRole("button", { name: /^Mức giảm khác:/ })).toHaveText("35%");
    await startGroup.getByRole("button", { name: /^Giờ bắt đầu:/ }).click();
    popup = page.getByRole("dialog", { name: "Giờ bắt đầu", exact: true });
    await expect(popup.getByRole("textbox")).toHaveCount(0);
    await expect(popup.getByRole("button")).toHaveCount(2);
    await pickTime(popup, 8, 30);
    await popup.getByRole("button", { name: "Hủy", exact: true }).click();
    await expect(startGroup.getByRole("button").first()).toHaveAttribute("aria-pressed", "true");
    await startGroup.getByRole("button", { name: /^Giờ bắt đầu:/ }).click();
    const hourWheel = popup.getByRole("spinbutton", { name: "Giờ", exact: true });
    const minuteWheel = popup.getByRole("spinbutton", { name: "Phút", exact: true });
    await hourWheel.focus();
    await hourWheel.press("End");
    await hourWheel.press("ArrowUp");
    await expect(hourWheel).toHaveAttribute("aria-valuenow", "0");
    await pickTime(popup, 8, 59);
    await minuteWheel.hover();
    await page.mouse.wheel(0, 44);
    await expect(minuteWheel).toHaveAttribute("aria-valuenow", "0");
    await pickTime(popup, 8, 29);
    const wheelBounds = (await minuteWheel.boundingBox())!;
    if (isMobile) {
      const session = await page.context().newCDPSession(page);
      const x = wheelBounds.x + wheelBounds.width / 2;
      const y = wheelBounds.y + wheelBounds.height / 2;
      const before = await minuteWheel.evaluate((element) => element.scrollTop);
      await session.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x, y }],
      });
      for (let by = 10; by <= 70; by += 10) {
        await session.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x, y: y - by }],
        });
      }
      await expect
        .poll(() => minuteWheel.evaluate((element) => element.scrollTop))
        .toBeGreaterThan(before);
      await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await session.detach();
    } else {
      await page.mouse.move(
        wheelBounds.x + wheelBounds.width / 2,
        wheelBounds.y + wheelBounds.height / 2,
      );
      await page.mouse.down();
      await page.mouse.move(
        wheelBounds.x + wheelBounds.width / 2,
        wheelBounds.y + wheelBounds.height / 2 - 44,
        { steps: 8 },
      );
      await page.mouse.up();
      await expect(minuteWheel).toHaveAttribute("aria-valuenow", "30");
    }
    await pickTime(popup, 8, 30);
    await expectNoSeriousA11yViolations(page);
    await page.screenshot({ path: testInfo.outputPath("custom-start.png") });
    const popupBounds = await popup.boundingBox();
    expect(popupBounds!.x).toBeGreaterThanOrEqual(0);
    expect(popupBounds!.x + popupBounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    await popup.getByRole("button", { name: "Áp dụng", exact: true }).click();
    await expect(endGroup.getByRole("button").first()).toHaveText("09:30");
    await expect(endGroup.getByRole("button").nth(1)).toHaveText("10:00");
    await expect(endGroup.getByRole("button").nth(2)).toHaveText("10:30");
    await expect(endGroup.getByRole("button").nth(3)).toHaveText("11:30");
    await endGroup.getByRole("button", { name: /^Giờ kết thúc:/ }).click();
    popup = page.getByRole("dialog", { name: "Giờ kết thúc", exact: true });
    await pickTime(popup, 8, 40);
    await popup.getByRole("button", { name: "Áp dụng", exact: true }).click();
    await expect(
      popup.getByText("Giờ kết thúc phải sau giờ bắt đầu từ 30 phút đến 6 giờ."),
    ).toBeVisible();
    await pickTime(popup, 10, 40);
    await popup.getByRole("button", { name: "Hủy", exact: true }).click();
    await expect(endGroup.getByRole("button").first()).toHaveAttribute("aria-pressed", "true");
    await endGroup.getByRole("button", { name: /^Giờ kết thúc:/ }).click();
    await expect(popup.getByRole("spinbutton", { name: "Giờ", exact: true })).toHaveAttribute(
      "aria-valuenow",
      "9",
    );
    await pickTime(popup, 10, 40);
    await popup.getByRole("button", { name: "Áp dụng", exact: true }).click();
    await expect(drawer.getByRole("status", { name: "Thời gian nhận hàng" })).toHaveText(
      "08:30–10:40",
    );
    // A different start resets a custom end, then custom times can be applied again.
    await startGroup.getByRole("button").first().click();
    await expect(endGroup.getByRole("button").first()).toHaveAttribute("aria-pressed", "true");
    await startGroup.getByRole("button", { name: /^Giờ bắt đầu:/ }).click();
    popup = page.getByRole("dialog", { name: "Giờ bắt đầu", exact: true });
    await pickTime(popup, 8, 30);
    await popup.getByRole("button", { name: "Áp dụng", exact: true }).click();
    await endGroup.getByRole("button", { name: /^Giờ kết thúc:/ }).click();
    popup = page.getByRole("dialog", { name: "Giờ kết thúc", exact: true });
    await pickTime(popup, 10, 40);
    await popup.getByRole("button", { name: "Áp dụng", exact: true }).click();
    await expect(sale).toHaveText("13.000đ");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(0);
    await expectNoSeriousA11yViolations(page);
    const sent = page.waitForRequest(
      (request) =>
        request.method() === "POST" &&
        new URL(request.url()).pathname.endsWith(`/sellers/${store}/offers`),
    );
    await drawer.getByRole("button", { name: "Đăng", exact: true }).click();
    const body = (await sent).postDataJSON() as {
      originalPriceVnd: number;
      priceVnd: number;
      units: number;
      windowStart: string;
      windowEnd: string;
    };
    expect(body.originalPriceVnd).toBe(20_000);
    expect(body.priceVnd).toBe(13_000);
    expect(body.units).toBe(5);
    expect(Date.parse(body.windowEnd) - Date.parse(body.windowStart)).toBe(130 * 60_000);
    expect(vietnamClock(Date.parse(body.windowStart))).toBe("08:30");
    await expect(page.getByText("Đã đăng 5 suất. Khách đặt được ngay.")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("posts a one-off dish with a photo, and a mixed box says what it holds", async ({
    page,
  }, testInfo) => {
    const store = await sampleStore(page, "quynh", testInfo);
    await page.goto(`/vi/stores/${store}/offers/new`);
    const drawer = page.getByRole("dialog");
    await drawer.getByRole("button", { name: "Tiếp tục" }).click();
    await drawer.getByRole("button", { name: "Món mới" }).click();
    await drawer.getByLabel("Ảnh món").setInputFiles({
      name: "flan.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        "base64",
      ),
    });
    await drawer.getByLabel("Tên món").fill("Hộp bánh cuối ngày");
    // The unit is chosen from a list, and "suất" is the first.
    await expect(drawer.getByLabel("Đơn vị")).toHaveValue("suất");
    await drawer.getByLabel("Đơn vị").selectOption("hộp");
    await drawer.getByRole("button", { name: "Hộp tổng hợp" }).click();
    await expect(drawer.getByLabel("Hộp gồm những gì")).toBeVisible();
    // "Tiếp tục" checks the step: what is missing is said under its field, which takes the focus.
    await drawer.getByRole("button", { name: "Tiếp tục" }).click();
    await expect(drawer.getByText("Hộp tổng hợp cần nói hộp gồm những gì.")).toBeVisible();
    await expect(drawer.getByLabel("Hộp gồm những gì")).toBeFocused();
    await drawer.getByLabel("Hộp gồm những gì").fill("Bánh mì và bánh ngọt, có trứng");
    await expectNoSeriousA11yViolations(page);
    await drawer.getByRole("button", { name: "Tiếp tục" }).click();

    await drawer.getByLabel("Số lượng").fill("6");
    await drawer.getByLabel("Giá gốc (đồng)").fill("60000");
    await drawer.getByRole("button", { name: "40%", exact: true }).click();
    await expect(drawer.getByLabel("Giá bán (đồng)")).toHaveText("36.000đ");
    await drawer
      .getByRole("group", { name: "Kết thúc", exact: true })
      .getByRole("button")
      .nth(1)
      .click();
    await expect(drawer.getByRole("status", { name: "Thời gian nhận hàng" })).toContainText(
      /\d\d:\d\d–\d\d:\d\d/,
    );
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
    await expect(drawer.getByText("Giá bán & số lượng")).toBeVisible();
    await expect(drawer.getByLabel("Số lượng")).not.toHaveValue("");
    await expectNoSeriousA11yViolations(page);
    await drawer
      .getByRole("group", { name: "Bắt đầu", exact: true })
      .getByRole("button")
      .first()
      .click();
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
    await pinHere(page);
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
      drawer.getByText(/Chưa ai đặt, nên bạn sửa được số suất, giá và giờ nhận\./),
    ).toBeVisible();
    await expect(drawer.getByLabel("Số lượng")).toHaveValue("3");
    await expectNoSeriousA11yViolations(page);

    await drawer.getByLabel("Số lượng").fill("5");
    await drawer.getByRole("button", { name: "30%", exact: true }).click();
    await drawer.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByText("Đã lưu.")).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByRole("listitem").filter({ hasText: /Còn 5\/5 suất · 66\.500đ/ }),
    ).toBeVisible();
  });

  test("locks the price once units are ordered, lets the hours move, and refuses fewer units", async ({
    page,
  }, testInfo) => {
    const store = await storeNamed(page, "bao", testInfo, "Tiệm có đơn");
    await page.goto(`/vi/stores/${store}/offers`);
    await page.getByRole("link", { name: "Sửa" }).click();

    const drawer = page.getByRole("dialog");
    await expect(drawer.getByText("Đang bán, đã có 2 suất được đặt")).toBeVisible();
    await expect(drawer.getByRole("button", { name: "40%", exact: true })).toBeDisabled();
    await expect(drawer.getByLabel("Giá gốc (đồng)")).toBeDisabled();
    await expect(
      drawer.getByRole("group", { name: "Bắt đầu", exact: true }).getByRole("button").first(),
    ).toBeEnabled();
    await expect(drawer.getByText(/Khách đã đặt sẽ nhận theo giờ mới/)).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Rút bài" })).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);

    await drawer.getByLabel("Số lượng").fill("1");
    await drawer.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(
      drawer.getByText("Số suất không được thấp hơn 2, vì đã có 2 suất được đặt."),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    // The current-time choice sends a new window even when portions have been ordered.
    await drawer.getByLabel("Số lượng").fill("4");
    await drawer
      .getByRole("group", { name: "Bắt đầu", exact: true })
      .getByRole("button")
      .first()
      .click();
    await drawer.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(page.getByText("Đã lưu.")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("listitem").filter({ hasText: /Còn 2\/4 suất/ })).toBeVisible();
  });

  test("searches the posts by name and picks a day", async ({ page }, testInfo) => {
    const store = await storeNamed(page, "thu", testInfo, "Tiệm bánh Pháp");
    await page.goto(`/vi/stores/${store}/offers`);
    await expect(page.getByRole("heading", { level: 2, name: "Hôm nay" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Đã hết · 1" })).toBeVisible();

    await (await hydrated(page.getByLabel("Tìm bài đăng"))).fill("croissant");
    await expect(page).toHaveURL(/q=croissant/);
    await expect(page.getByRole("link", { name: "Đang bán · 1" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Đã hết · 0" })).toBeVisible();

    await page.getByLabel("Tìm bài đăng").fill("xyz");
    await expect(page.getByText("Không có bài nào khớp “xyz”.")).toBeVisible();
    await page.getByLabel("Tìm bài đăng").fill("");
    await expect(page.getByRole("link", { name: "Đã hết · 1" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("link", { name: "Ngày trước" }).click();
    await expect(page).toHaveURL(/day=\d{4}-\d{2}-\d{2}/);
    await expect(page.getByText("Chưa có bài đăng nào ngày này.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Đang bán · 0" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page.getByRole("button", { name: /^Chọn ngày/ }).click();
    await page.getByRole("link", { name: "Hôm nay" }).click();
    await expect(page.getByRole("link", { name: "Đang bán · 1" })).toBeVisible();
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

  test("withdraws a post that has orders, and says they are cancelled", async ({
    page,
  }, testInfo) => {
    const store = await storeNamed(page, "tam", testInfo, "Tiệm có đơn");
    await page.goto(`/vi/stores/${store}/offers/of-1-${store}/withdraw`);

    const drawer = page.getByRole("dialog");
    await expect(
      drawer.getByText(/Bài này đã có 2 suất được đặt\. Rút bài sẽ huỷ các đơn đó/),
    ).toBeVisible();
    await expect(drawer.getByText("2 suất đang chờ nhận sẽ bị huỷ.")).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Đến tab Đơn" })).toHaveCount(0);
    await expectNoSeriousA11yViolations(page);

    await drawer.getByRole("button", { name: "Rút bài và huỷ đơn" }).click();
    await expect(page.getByText(/Đã rút bài\. Bài nằm ở tab Đã đóng/)).toBeVisible({
      timeout: 15_000,
    });
  });
});

// SEC-55 › The catalog (Figma Q3, Q3b, Q3c, C1, C2, D1, and the dish step of P2).
test.describe("the catalog on the web", () => {
  async function catalogStore(page: Page, who: string, testInfo: { project: { name: string } }) {
    await signIn(page, `${who}.${testInfo.project.name}@example.com`, "/open-store");
    await (await hydrated(page.getByLabel("Tên quán"))).fill("Tiệm danh mục");
    await page.getByLabel("Số điện thoại").fill("0912345678");
    await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall");
    await pinHere(page);
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(page).toHaveURL(/\/vi\/stores\/se-1-/, { timeout: 20_000 });
    return page.url().split("/").pop() ?? "";
  }

  const row = (page: Page, text: RegExp | string) =>
    page.getByRole("listitem").filter({ hasText: text });
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );

  test("lists the dishes, a hidden one dimmed", async ({ page }, testInfo) => {
    const store = await catalogStore(page, "dao", testInfo);
    await page.goto(`/vi/stores/${store}/catalog`);
    await expect(page.getByRole("heading", { level: 1, name: "Danh mục" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "3 món" })).toBeVisible();
    await expect(row(page, /Túi bánh mì và croissant, 4 chiếc/)).toContainText("Bánh · 1 túi");
    await expect(row(page, /Cơm sườn nướng/)).toContainText("Món chín · 1 suất · Đang ẩn");
    await expect(
      row(page, /Cơm sườn nướng/).getByRole("button", { name: "Hiện lại" }),
    ).toBeVisible();
    await expect(row(page, /Xôi thập cẩm/).getByRole("link", { name: "Đăng ngay" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("adds a dish, a mixed box needing what it holds", async ({ page }, testInfo) => {
    const store = await catalogStore(page, "hanh", testInfo);
    await page.goto(`/vi/stores/${store}/catalog`);
    await page.getByRole("link", { name: "Thêm món" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Thêm món" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByLabel("Tên món"))).fill("Hộp bánh cuối ngày");
    await page.getByRole("button", { name: "Hộp tổng hợp" }).click();
    await page.getByRole("button", { name: "Lưu món" }).click();
    await expect(page.getByText("Chọn một ảnh cho món.")).toBeVisible();
    // The first field in error, the photos, takes the focus.
    await expect(page.getByLabel("Ảnh món")).toBeFocused();
    await expect(page.getByText(/Hộp tổng hợp cần nói hộp gồm những gì/)).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await page
      .getByLabel("Ảnh món")
      .setInputFiles({ name: "hop.png", mimeType: "image/png", buffer: png });
    await page.getByLabel("Mô tả").fill("Bánh mì và bánh ngọt, có trứng");
    // The unit is chosen from a list, not typed.
    await expect(page.getByLabel("Đơn vị")).toHaveValue("suất");
    await page.getByLabel("Đơn vị").selectOption("hộp");
    await page.getByRole("button", { name: "Lưu món" }).click();
    await expect(page.getByText("Đã lưu món.")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 2, name: "4 món" })).toBeVisible();
    await expect(row(page, /Hộp bánh cuối ngày/)).toContainText("Hộp tổng hợp · 1 hộp");
  });

  test("a dish of the kind Khác is named by its seller", async ({ page }, testInfo) => {
    const store = await catalogStore(page, "che", testInfo);
    await page.goto(`/vi/stores/${store}/catalog`);
    await page.getByRole("link", { name: "Thêm món" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Thêm món" })).toBeVisible();

    await (await hydrated(page.getByLabel("Tên món"))).fill("Chè đậu xanh");
    // The kind is named only when it is Khác; three more kinds are there to choose.
    await expect(page.getByLabel("Tên loại")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Tráng miệng" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Ăn vặt" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Rau củ quả" })).toBeVisible();
    await page.getByRole("button", { name: "Khác", exact: true }).click();
    await page.getByLabel("Tên loại").fill("Chè truyền thống");
    await page
      .getByLabel("Ảnh món")
      .setInputFiles({ name: "che.png", mimeType: "image/png", buffer: png });
    await page.getByRole("button", { name: "Lưu món" }).click();
    await expect(page.getByText("Đã lưu món.")).toBeVisible({ timeout: 15_000 });
    await expect(row(page, /Chè đậu xanh/)).toContainText("Chè truyền thống · 1 suất");
  });

  test("changes a dish, shows a hidden one again, and deletes one after asking", async ({
    page,
  }, testInfo) => {
    const store = await catalogStore(page, "kiet", testInfo);
    await page.goto(`/vi/stores/${store}/catalog`);
    await row(page, /Xôi thập cẩm/)
      .getByRole("link", { name: "Sửa" })
      .click();
    await expect(page.getByRole("heading", { level: 1, name: "Sửa món" })).toBeVisible();
    await expect(page.getByLabel("Tên món")).toHaveValue("Xôi thập cẩm, 1 hộp");
    await expectNoSeriousA11yViolations(page);
    await (await hydrated(page.getByLabel("Tên món"))).fill("Xôi thập cẩm lớn");
    await page.getByRole("button", { name: "Lưu thay đổi" }).click();
    await expect(row(page, /Xôi thập cẩm lớn/)).toBeVisible({ timeout: 15_000 });

    await row(page, /Cơm sườn nướng/)
      .getByRole("button", { name: "Hiện lại" })
      .click();
    await expect(row(page, /Cơm sườn nướng/).getByRole("link", { name: "Đăng ngay" })).toBeVisible({
      timeout: 15_000,
    });

    await row(page, /Cơm sườn nướng/)
      .getByRole("link", { name: "Sửa" })
      .click();
    await (await hydrated(page.getByRole("button", { name: "Xoá món" }))).click();
    const dialog = page.getByRole("alertdialog");
    await expect(dialog.getByText("Xoá món này?")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await dialog.getByRole("button", { name: "Giữ lại" }).click();
    await expect(dialog).toHaveCount(0);
    await page.getByRole("button", { name: "Xoá món" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Xoá món" }).click();
    await expect(page.getByRole("heading", { level: 2, name: "2 món" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(row(page, /Cơm sườn nướng/)).toHaveCount(0);
  });

  test("posts a dish from its row, and picks one from the catalog in the drawer", async ({
    page,
  }, testInfo) => {
    const store = await catalogStore(page, "loc", testInfo);
    await page.goto(`/vi/stores/${store}/catalog`);
    await row(page, /Túi bánh mì và croissant/)
      .getByRole("link", { name: "Đăng ngay" })
      .click();

    const drawer = page.getByRole("dialog");
    await expect(drawer.getByText("Bước 3 / 3")).toBeVisible();
    await expect(drawer.getByText("Túi bánh mì và croissant, 4 chiếc")).toBeVisible();
    // The price comes with the dish, so the cursor waits in the units, which the seller has to type.
    await expect(drawer.getByLabel("Số lượng")).toBeFocused();
    // The dish brings its original price, and the price starts at the most the minimum discount allows.
    await expect(drawer.getByLabel("Giá gốc (đồng)")).toHaveValue("95.000");
    await expect(drawer.getByLabel("Giá bán (đồng)")).toHaveText("76.000đ");
    await expectNoSeriousA11yViolations(page);
    await drawer.getByLabel("Số lượng").fill("3");
    await drawer.getByRole("button", { name: "40%", exact: true }).click();
    await drawer
      .getByRole("group", { name: "Bắt đầu", exact: true })
      .getByRole("button")
      .first()
      .click();
    await drawer.getByRole("button", { name: "Đăng", exact: true }).click();
    await expect(page.getByText("Đã đăng 3 suất. Khách đặt được ngay.")).toBeVisible({
      timeout: 15_000,
    });

    await page.goto(`/vi/stores/${store}/offers/new`);
    const step = page.getByRole("dialog");
    await step.getByRole("button", { name: "Tiếp tục" }).click();
    await expect(step.getByRole("button", { name: "Từ danh mục" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(row(page, /Cơm sườn nướng/)).toHaveCount(0);
    await row(page, /Xôi thập cẩm/)
      .getByRole("button", { name: "Chọn" })
      .click();
    await expectNoSeriousA11yViolations(page);
    await step.getByRole("button", { name: "Tiếp tục" }).click();
    await expect(step.getByText("Xôi thập cẩm, 1 hộp")).toBeVisible();
    await expect(step.getByText("Món chín · hộp")).toBeVisible();
  });
});
