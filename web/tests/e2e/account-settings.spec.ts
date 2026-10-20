import { expect, test, type Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

/** Signs in through the API, as the sign-in screen does; the cookie lands in the browser's jar. */
async function signIn(page: Page, email: string) {
  const response = await page.request.post("/api/auth/sessions", {
    data: { challengeId: `ch-${encodeURIComponent(email)}`, code: "123456", session: "cookie" },
  });
  expect(response.status()).toBe(201);
}

// SEC-61 › Verification: the display name is changed from account settings, in the server's words when refused.
test.describe("naming the account on the web", () => {
  test("changes the display name, after the server refuses an empty one", async ({
    page,
  }, testInfo) => {
    await signIn(page, `ten.${testInfo.project.name}@example.com`);
    await page.goto("/vi/account/settings");

    const row = page.getByRole("definition").filter({ hasText: "Chưa có" });
    await expect(row).toBeVisible();
    await (await hydrated(page.getByRole("button", { name: "Sửa tên hiển thị" }))).click();

    const field = page.getByRole("textbox", { name: "Tên hiển thị" });
    await expect(field).toBeFocused();
    await field.fill("   ");
    await page.getByRole("button", { name: "Lưu" }).click();
    await expect(page.getByText("Nhập tên hiển thị từ 1 đến 50 ký tự.")).toBeVisible();
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expectNoSeriousA11yViolations(page, { exclude: ["[data-decorative]"] });

    await field.fill("  Trần Thị Lan ");
    await page.getByRole("button", { name: "Lưu" }).click();

    await expect(page.getByRole("heading", { level: 2, name: "Trần Thị Lan" })).toBeVisible();
    await expect(page.getByRole("definition").filter({ hasText: "Trần Thị Lan" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Tên hiển thị" })).toHaveCount(0);
  });

  test("keeps the name when editing is cancelled", async ({ page }, testInfo) => {
    await signIn(page, `huy.${testInfo.project.name}@example.com`);
    await page.goto("/vi/account/settings");

    await (await hydrated(page.getByRole("button", { name: "Sửa tên hiển thị" }))).click();
    await page.getByRole("textbox", { name: "Tên hiển thị" }).fill("Tên khác");
    await page.getByRole("button", { name: "Huỷ" }).click();

    await expect(page.getByRole("definition").filter({ hasText: "Chưa có" })).toBeVisible();
  });
});
