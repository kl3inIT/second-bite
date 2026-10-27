import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

async function signInAsAdmin(page: Page, name: string) {
  const response = await page.request.post("/api/auth/sessions", {
    data: {
      challengeId: `ch-${encodeURIComponent(`admin.${name}@example.com`)}`,
      code: "123456",
      session: "cookie",
    },
  });
  expect(response.status()).toBe(201);
}

// SEC-145 › every customer's review (Figma AD-DG1 to AD-DG3), on the stub's six reviews: stars 5, 4, 1
// (hidden), 3, 2 and 5, so the mean of those shown is 3,8, two give one or two stars and one is hidden.
test.describe("the admin's reviews", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await signInAsAdmin(page, `reviews.${testInfo.project.name}.${testInfo.title.length}`);
  });

  test("the list shows the mean, the poor and the hidden reviews, and filters by a card", async ({
    page,
  }) => {
    await page.goto("/vi/admin/reviews");
    await expect(page.getByRole("heading", { level: 1, name: "Đánh giá" })).toBeVisible();
    await expect(page.getByText("3,8")).toBeVisible();
    const cards = page.getByRole("group", { name: "Tổng quan đánh giá" });
    await expect(cards.getByRole("button", { name: /^1–2 sao/ })).toContainText("2");
    await expect(cards.getByRole("button", { name: /^Đã ẩn/ })).toContainText("1");

    const table = page.getByRole("table", { name: "Đánh giá" });
    await expect(table.getByRole("row")).toHaveCount(7);
    await expect(table.getByText("Không có bình luận")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(cards.getByRole("button", { name: /^Đã ẩn/ }))).click();
    await expect(page).toHaveURL(/card=hidden/);
    await expect(table.getByRole("row")).toHaveCount(2);
    await expect(table.getByText("Đã ẩn", { exact: true })).toBeVisible();
  });

  test("hides a review with an optional reason, then shows it again", async ({ page }) => {
    await page.goto("/vi/admin/reviews?q=b%C3%A1nh%20c%C3%B2n");
    const table = page.getByRole("table", { name: "Đánh giá" });
    await expect(table.getByRole("row")).toHaveCount(2);

    await (
      await hydrated(table.getByRole("button", { name: /^Thao tác với đánh giá của/ }))
    ).click();
    await page.getByRole("menuitem", { name: "Ẩn đánh giá" }).click();
    const dialog = page.getByRole("dialog", { name: /^Ẩn đánh giá của/ });
    await expect(dialog.getByText("Không bắt buộc, tối đa 500 ký tự")).toBeVisible();
    await dialog.getByLabel("Lý do ẩn").fill("Spam");
    await expect(dialog.getByText("4/500")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
    await dialog.getByRole("button", { name: "Ẩn đánh giá" }).click();
    await expect(page.getByText(/^Đã ẩn đánh giá của/)).toBeVisible();
    await expect(table.getByText("Đã ẩn", { exact: true })).toBeVisible();

    await table.getByRole("button", { name: /^Thao tác với đánh giá của/ }).click();
    await page.getByRole("menuitem", { name: "Hiện lại" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Hiện lại" }).click();
    await expect(page.getByText(/^Đã hiện lại đánh giá của/)).toBeVisible();
    await expect(table.getByText("Hiển thị", { exact: true })).toBeVisible();
  });
});
