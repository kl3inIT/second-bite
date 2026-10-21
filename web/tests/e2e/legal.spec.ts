import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.describe("the terms and the privacy policy", () => {
  test("are reached from the foot of the home, or the account tab on a phone, and say they are drafts", async ({
    page,
    isMobile,
  }) => {
    await page.goto(isMobile ? "/vi/account" : "/vi");
    const links = page.getByRole("navigation", { name: isMobile ? "Thông tin pháp lý" : "Hỗ trợ" });
    await (await hydrated(links.getByRole("link", { name: "Chính sách quyền riêng tư" }))).click();

    await expect(page).toHaveURL(/\/vi\/privacy$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Chính sách quyền riêng tư" }),
    ).toBeVisible();
    await expect(page.getByRole("note")).toContainText("Bản nháp");
    await expect(page.getByRole("heading", { level: 2, name: "5. Quyền của bạn" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("tell search and answer engines their address, their translation and their sections", async ({
    page,
  }) => {
    await page.goto("/vi/terms");

    await expect(page).toHaveTitle("Điều khoản sử dụng · Second Bite");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/vi\/terms$/);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      /\/en\/terms$/,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      "href",
      /\/vi\/terms$/,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /trách nhiệm của người bán/,
    );
    await expect(page.locator("time")).toHaveAttribute("datetime", "2026-10-20");

    const structured = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? "")));
    const webPage = structured.find((data) => data["@type"] === "WebPage");
    expect(webPage).toMatchObject({
      name: "Điều khoản sử dụng",
      inLanguage: "vi",
      dateModified: "2026-10-20",
    });
    expect(webPage.hasPart).toHaveLength(8);
    expect(webPage.hasPart[0].url).toMatch(/\/vi\/terms#section-1$/);
    expect(structured.some((data) => data["@graph"]?.[0]?.["@type"] === "Organization")).toBe(true);
  });

  test("are listed in the sitemap in both languages, while robots stay closed", async ({
    request,
  }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/vi/terms</loc>");
    expect(sitemap).toContain("/en/privacy</loc>");
    expect(sitemap).toMatch(/hreflang="en"\s+href="[^"]*\/en\/terms"/);
    expect(sitemap).not.toContain("/account");

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /");
    expect(robots).toMatch(/Sitemap: \S+\/sitemap\.xml/);
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
