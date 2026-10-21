import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";
import { pinHere, TASCO_MALL } from "./pin";

test.use({ locale: "vi-VN", permissions: ["geolocation"], geolocation: TASCO_MALL });
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

/** Fills the open-store form but its location. */
async function fillStore(page: Page, name: string) {
  await (await hydrated(page.getByLabel("Tên quán"))).fill(name);
  await page.getByLabel("Số điện thoại").fill("0912345678");
  await page.getByLabel("Địa chỉ quán").fill("Tầng 1, Tasco Mall, Long Biên");
}

const opening = (request: { method(): string; url(): string }) =>
  request.method() === "POST" && new URL(request.url()).pathname.endsWith("/sellers");

/**
 * Moves the picker's map by the keyboard, as someone without a pointer does: MapLibre pans with the arrow keys and
 * zooms with "=", once its canvas has the focus. Answers whether the map started; without WebGL the picker says it
 * cannot show the map instead.
 */
async function nudgeMap(page: Page, keys: string[]) {
  const dialog = page.getByRole("dialog", { name: "Ghim vị trí quán" });
  const canvas = dialog.locator("canvas.maplibregl-canvas");
  await expect(canvas.or(dialog.getByText(/chưa hiện được bản đồ/))).toBeVisible();
  if (!(await canvas.isVisible())) return false;
  await canvas.focus();
  for (const key of keys) {
    await page.keyboard.press(key);
    // MapLibre eases each step; the next key waits for the map to rest.
    await page.waitForTimeout(400);
  }
  return true;
}

// SEC-66 › A store's real location, pinned on a map.
test.describe("a store's location on the map", () => {
  test("a store is not opened before it is pinned", async ({ page }, testInfo) => {
    await signIn(page, `pin.none.${testInfo.project.name}@example.com`, "/open-store");
    await fillStore(page, "Quán chưa ghim");

    let sent = false;
    page.on("request", (request) => {
      if (opening(request)) sent = true;
    });
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(page.getByText("Ghim vị trí quán trên bản đồ để khách tìm đến.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Ghim trên bản đồ" })).toBeFocused();
    await expectNoSeriousA11yViolations(page);
    expect(sent).toBe(false);

    // The location button pins it, and the store opens where the person stands.
    await pinHere(page);
    await expect(page.getByText("Ghim vị trí quán trên bản đồ để khách tìm đến.")).toHaveCount(0);
    await expect(page.getByRole("figure", { name: "Vị trí quán trên bản đồ" })).toBeVisible();
    const opened = page.waitForRequest(opening);
    await page.getByRole("button", { name: "Tạo quán" }).click();
    const body = (await opened).postDataJSON() as { latitude: number; longitude: number };
    expect(body.latitude).toBeCloseTo(TASCO_MALL.latitude, 4);
    expect(body.longitude).toBeCloseTo(TASCO_MALL.longitude, 4);
    await expect(page).toHaveURL(/\/vi\/stores\/se-1-/);
  });

  test("the store is pinned on the map, confirmed only close enough to the street", async ({
    page,
  }, testInfo) => {
    await signIn(page, `pin.map.${testInfo.project.name}@example.com`, "/open-store");
    await fillStore(page, "Quán trên bản đồ");

    await page.getByRole("button", { name: "Ghim trên bản đồ" }).click();
    const dialog = page.getByRole("dialog", { name: "Ghim vị trí quán" });
    await expect(dialog.getByText("Kéo bản đồ để mũi ghim nằm đúng cửa quán.")).toBeVisible();
    const confirm = dialog.getByRole("button", { name: "Xác nhận vị trí" });
    await expect(confirm).toBeDisabled();
    await expectNoSeriousA11yViolations(page);

    // It opens at Tasco Mall, one level short of the street: the pin waits for a closer look.
    test.skip(!(await nudgeMap(page, [])), "this browser has no WebGL; the picker says so instead");
    await expect(dialog.getByText("Phóng to bản đồ để ghim đúng chỗ.")).toBeVisible();
    await nudgeMap(page, ["Equal", "ArrowRight", "ArrowRight"]);
    await expect(confirm).toBeEnabled();
    await confirm.click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("figure", { name: "Vị trí quán trên bản đồ" })).toBeVisible();

    const opened = page.waitForRequest(opening);
    await page.getByRole("button", { name: "Tạo quán" }).click();
    const body = (await opened).postDataJSON() as { latitude: number; longitude: number };
    // Moved east of the mall by the arrows, and still in Hanoi.
    expect(body.latitude).toBeCloseTo(TASCO_MALL.latitude, 3);
    expect(body.longitude).toBeGreaterThan(TASCO_MALL.longitude);
    expect(body.longitude).toBeLessThan(TASCO_MALL.longitude + 0.05);
  });

  test("the owner moves the store's pin from the store menu", async ({ page }, testInfo) => {
    await signIn(page, `pin.move.${testInfo.project.name}@example.com`, "/open-store");
    await fillStore(page, "Quán dời chỗ");
    await pinHere(page);
    await page.getByRole("button", { name: "Tạo quán" }).click();
    await expect(page).toHaveURL(/\/vi\/stores\/se-1-/);

    await page.getByRole("button", { name: "Quán dời chỗ", exact: true }).click();
    await page.getByRole("menuitem", { name: "Vị trí quán" }).click();
    await expect(page).toHaveURL(/\/vi\/stores\/se-1-[\w-]+\/location$/);
    await expect(page.getByRole("heading", { level: 1, name: "Vị trí quán" })).toBeVisible();
    await expect(page.getByRole("figure", { name: "Vị trí quán trên bản đồ" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Địa chỉ quán" })).toHaveValue(
      "Tầng 1, Tasco Mall, Long Biên",
    );
    await expectNoSeriousA11yViolations(page);

    // It opens on the store's pin, at the street, so it can be confirmed at once.
    await (await hydrated(page.getByRole("button", { name: "Chỉnh vị trí" }))).click();
    const dialog = page.getByRole("dialog", { name: "Ghim vị trí quán" });
    const moved = await nudgeMap(page, ["ArrowUp", "ArrowUp"]);
    if (moved) {
      await dialog.getByRole("button", { name: "Xác nhận vị trí" }).click();
      await expect(dialog).toBeHidden();
    } else {
      await page.keyboard.press("Escape");
    }

    await page.getByRole("textbox", { name: "Địa chỉ quán" }).fill("12 Ngọc Lâm, Long Biên");
    const saved = page.waitForRequest(
      (request) => request.method() === "PUT" && /\/sellers\/se-1-[\w-]+$/.test(request.url()),
    );
    await page.getByRole("button", { name: "Lưu vị trí" }).click();
    const body = (await saved).postDataJSON() as {
      name: string;
      phone: string;
      address: string;
      latitude: number;
    };
    // The other details go back as they were; the pin moved north by the arrows.
    expect(body.name).toBe("Quán dời chỗ");
    expect(body.phone).toBe("0912345678");
    expect(body.address).toBe("12 Ngọc Lâm, Long Biên");
    if (moved) expect(body.latitude).toBeGreaterThan(TASCO_MALL.latitude);
    await expect(page.getByText("Đã lưu vị trí mới của quán.")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
});
