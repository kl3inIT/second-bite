import { expect, test } from "@playwright/test";

test.use({ locale: "vi-VN" });

// SEC-80 › each page on screen tells the server, as a phone's browser would. Playwright's browser says it is
// driven by a program (navigator.webdriver), which the count leaves out, so the first test says it is not.
test.describe("a page view", () => {
  test("is sent once a page is shown, with the poster's source", async ({ page }) => {
    await page.addInitScript(() =>
      Object.defineProperty(navigator, "webdriver", { get: () => false }),
    );
    const sent = page.waitForRequest(
      (r) => r.method() === "POST" && new URL(r.url()).pathname === "/api/stats/views",
    );
    await page.goto("/vi?utm_source=qr");
    expect((await sent).postDataJSON()).toEqual({ path: "/vi", source: "qr" });
  });

  test("is not sent by a browser a program drives, as Playwright's is", async ({ page }) => {
    let sent = 0;
    page.on("request", (r) => {
      if (new URL(r.url()).pathname === "/api/stats/views") sent++;
    });
    await page.goto("/vi");
    await page.waitForLoadState("networkidle");
    expect(sent).toBe(0);
  });
});
