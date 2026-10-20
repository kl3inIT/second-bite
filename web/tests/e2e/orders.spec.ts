import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

// Ordering on the web (SEC-51, Figma W1–W7), against the stub backend's orders.
test.describe("ordering, following and cancelling an order", () => {
  test("someone signed out signs in, orders, cancels and finds the order among the ended ones", async ({
    page,
  }, testInfo) => {
    const email = `dat.${testInfo.project.name}@example.com`;
    await page.goto("/vi/orders/new?offer=of-banh-bao&units=2");

    await expect(page.getByRole("heading", { name: "Xác nhận đơn", level: 1 })).toBeVisible();
    await expect(page.getByText("Trả tiền tại quầy", { exact: true })).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByRole("link", { name: "Đăng nhập để đặt món" }))).click();
    await (await hydrated(page.getByLabel("Email"))).fill(email);
    await page.getByRole("button", { name: "Gửi mã" }).click();
    await page.getByLabel("Mã đăng nhập 6 số").fill("123456");

    await expect(page).toHaveURL(/\/vi\/orders\/new\?offer=of-banh-bao&units=2$/);
    await (await hydrated(page.getByRole("button", { name: "Đặt món", exact: true }))).click();

    await expect(page).toHaveURL(/\/vi\/orders\/or-\d+$/);
    await expect(page.getByRole("heading", { name: "Đã xác nhận" })).toBeVisible();
    await expect(page.getByText("2× Bánh bao nhân thịt, 2 chiếc")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByRole("button", { name: "Huỷ đơn" }))).click();
    const dialog = page.getByRole("alertdialog", { name: /Huỷ đơn SB-\d+\?/ });
    await expect(dialog).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await dialog.getByRole("button", { name: "Không đến kịp" }).click();
    await dialog.getByRole("button", { name: "Huỷ đơn" }).click();
    await expect(page.getByRole("heading", { name: "Đã huỷ đơn" })).toBeVisible();
    await expect(page.getByText(/Không đến kịp/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Huỷ đơn" })).toHaveCount(0);

    await page.goto("/vi/orders");
    await expect(page.getByText("Bạn chưa có đơn nào đang chờ nhận.")).toBeVisible();
    await (await hydrated(page.getByRole("link", { name: "Đã xong" }))).click();
    await expect(page).toHaveURL(/\/vi\/orders\?state=ended$/);
    await expect(page.getByRole("link", { name: /Bánh bao nhân thịt/ })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("an offer that has sold out cannot be ordered", async ({ page }) => {
    await page.goto("/vi/orders/new?offer=of-com-tam");
    await expect(page.getByRole("heading", { name: "Món vừa hết" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Xem món khác" })).toHaveAttribute("href", "/vi");
    await expectNoSeriousA11yViolations(page);
  });

  test("my orders ask someone signed out to sign in", async ({ page }) => {
    await page.goto("/vi/orders");
    await expect(page.getByRole("heading", { name: "Đơn của tôi", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Đăng nhập để xem đơn" })).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: "Đăng nhập", exact: true }),
    ).toHaveAttribute("href", "/vi/sign-in?returnTo=%2Forders");
    await expectNoSeriousA11yViolations(page);
  });
});
