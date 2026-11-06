import { expect, test, type Page, type TestInfo } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

/** Signs in as an admin of its own, so each test has its own limits in the stub. */
async function signInAsAdmin(page: Page, testInfo: TestInfo) {
  const email = `admin.limits.${testInfo.project.name}.${testInfo.title.length}@example.com`;
  const response = await page.request.post("/api/auth/sessions", {
    data: { challengeId: `ch-${encodeURIComponent(email)}`, code: "123456", session: "cookie" },
  });
  expect(response.status()).toBe(201);
}

// SEC-158 › the limits on what one person holds (Figma L7), on the stub's settings.
test.describe("the ordering limits", () => {
  test("the settings open on Đặt món, and a change of both settings is saved", async ({
    page,
  }, testInfo) => {
    await signInAsAdmin(page, testInfo);
    await page.goto("/vi/admin/settings");
    await expect(page).toHaveURL(/\/vi\/admin\/settings\/order-limits$/);

    await expect(page.getByRole("heading", { level: 1, name: "Cài đặt" })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Mục cài đặt" }).getByRole("link", { name: "Đặt món" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(page.getByLabel("Tối đa mặc định (phần)")).toHaveValue("5");
    await expect(page.getByLabel("Mỗi số điện thoại ở một quán (đơn)")).toHaveValue("2");
    await expect(page.getByLabel("Mỗi mạng (IP) (đơn)")).toHaveValue("20");
    await expect(page.getByLabel("Chặn khi số điện thoại bỏ (đơn)")).toHaveValue("2");
    await expect(page.getByLabel("Trong vòng (ngày)")).toHaveValue("7");
    const save = page.getByRole("button", { name: "Lưu thay đổi" });
    await expect(save).toBeDisabled();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(page.getByLabel("Trong vòng (ngày)"))).fill("61");
    await save.click();
    await expect(page.getByText("Nhập số nguyên từ 1 đến 60.")).toBeVisible();

    await page.getByLabel("Trong vòng (ngày)").fill("14");
    await page.getByLabel("Tối đa mặc định (phần)").fill("4");
    await expect(page.getByText("Bạn có thay đổi chưa lưu")).toBeVisible();
    await save.click();

    await expect(page.getByText("Đã lưu giới hạn đặt món")).toBeVisible();
    await expect(page.getByLabel("Trong vòng (ngày)")).toHaveValue("14");
    await expect(page.getByLabel("Tối đa mặc định (phần)")).toHaveValue("4");
    await expect(save).toBeDisabled();
  });
});
