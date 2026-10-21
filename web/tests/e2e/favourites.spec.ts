import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

test.describe("the favourites", () => {
  // Figma K9a, K9: nothing followed, then a seller followed from its page, kept in this browser (SEC-109).
  test("follows a seller from its page and lists it with tonight's dishes, then lets it go", async ({
    page,
  }) => {
    await page.goto("/vi/favourites");
    await expect(page.getByRole("heading", { name: "Chưa có quán yêu thích" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Khám phá quán" })).toHaveAttribute("href", "/vi");
    await expectNoSeriousA11yViolations(page);

    await page.goto("/vi/sellers/se-la-paris");
    const heart = await hydrated(page.getByRole("button", { name: "Yêu thích La Paris" }));
    await heart.click();
    await expect(heart).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Đã thêm vào Yêu thích")).toBeVisible();

    await page.goto("/vi/favourites");
    const card = page.getByRole("article").filter({ hasText: "La Paris" });
    await expect(card.getByRole("heading", { name: "La Paris" })).toBeVisible();
    await expect(card.getByText("Bánh Croissant Truyền Thống")).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    await (await hydrated(card.getByRole("button", { name: "Yêu thích La Paris" }))).click();
    await expect(page.getByText("Đã bỏ khỏi Yêu thích")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Chưa có quán yêu thích" })).toBeVisible();
  });
});
