import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.describe("the terms and the privacy policy", () => {
  test("are reached from the foot of the home, or the account tab on a phone, and say they are drafts", async ({
    page,
    isMobile,
  }) => {
    await page.goto(isMobile ? "/vi/account" : "/vi");
    const links = page.getByRole("navigation", { name: "Thông tin pháp lý" });
    await (await hydrated(links.getByRole("link", { name: "Chính sách quyền riêng tư" }))).click();

    await expect(page).toHaveURL(/\/vi\/privacy$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Chính sách quyền riêng tư" }),
    ).toBeVisible();
    await expect(page.getByRole("note")).toContainText("Bản nháp");
    await expect(page.getByRole("heading", { level: 2, name: "5. Quyền của bạn" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("are in English under /en", async ({ page }) => {
    await page.goto("/en/terms");

    await expect(page.getByRole("heading", { level: 1, name: "Terms of use" })).toBeVisible();
    await expect(page.getByRole("note")).toContainText("Draft");
    await expect(page.getByRole("link", { name: "3. Sellers' responsibilities" })).toHaveAttribute(
      "href",
      "#section-3",
    );
    await expectNoSeriousA11yViolations(page);
  });
});
