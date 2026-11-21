import { expect, test, type Locator, type Page } from "@playwright/test";

import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

/** The names of the fields a form with a secret has; none of them may reach an address. */
const FIELDS = [
  "username",
  "password",
  "confirm",
  "email",
  "code",
  "smtpPassword",
  "brevoApiKey",
] as const;

/**
 * Holds the page's scripts until `release` is called, so the server's HTML is on the screen and React has not
 * hydrated it, as on a slow phone on a slow line, where a press then once put the password in the address. Each
 * document the page asks for is kept, to show that no field went into its address, and each request that writes
 * to the API (`sent`), to show that React's replay of the presses sends the form once.
 */
async function beforeHydration(page: Page) {
  let release!: () => void;
  const released = new Promise<void>((resolve) => (release = resolve));
  await page.route(/\/_next\/static\/.*\.js$/, async (route) => {
    await released;
    await route.fallback();
  });
  const documents: string[] = [];
  const sent: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "document") documents.push(request.url());
    const { pathname } = new URL(request.url());
    if (request.method() !== "GET" && pathname.startsWith("/api/")) {
      sent.push(`${request.method()} ${pathname}`);
    }
  });
  return { release, documents, sent };
}

/** Signs in through the API with the stub's code; the cookie lands in the browser's jar. */
async function signIn(page: Page, email: string) {
  const session = await page.request.post("/api/auth/sessions", {
    data: { challengeId: `ch-${encodeURIComponent(email)}`, code: "123456", session: "cookie" },
  });
  expect(session.status()).toBe(201);
}

/** Says whether React has hydrated an element yet (see hydration.ts). */
function isHydrated(element: Locator) {
  return element.evaluate((node) =>
    Object.keys(node).some((key) => key.startsWith("__reactProps$")),
  );
}

/** No address the page asked for or shows carries a field or the secret, as typed or as a form encodes it. */
function expectNothingInTheAddress(page: Page, documents: string[], secret: string) {
  for (const address of [...documents, page.url()]) {
    const url = new URL(address);
    const decoded = decodeURIComponent(url.search.replace(/\+/g, " "));
    expect(decoded, address).not.toContain(secret);
    for (const name of FIELDS) expect(url.searchParams.has(name), address).toBe(false);
  }
}

// A press before the page's script has run must not submit the form natively, which sends its fields in the
// address (a GET); React keeps the press and sends it the way the form does once the page has hydrated. A cheap
// phone that seems stuck gets pressed again: React replays both presses, and the form is sent once.
test.describe("a form with a secret pressed before the page has hydrated", () => {
  test("signing in with a password", async ({ page }) => {
    const { release, documents, sent } = await beforeHydration(page);
    await page.goto("/vi/sign-in?returnTo=%2F%3Fkind%3Dbakery", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: "Đăng nhập", exact: true });
    await page.getByLabel("Tên đăng nhập").fill("lan.anh");
    await page.getByLabel("Mật khẩu").fill("correct horse");
    expect(await isHydrated(button)).toBe(false);
    await button.click();
    await button.click();
    release();
    expectNothingInTheAddress(page, documents, "correct horse");

    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
    await expect(page.getByRole("button", { name: "Tài khoản lan.anh" })).toBeVisible();
    expect(sent).toEqual(["POST /api/auth/password-sessions"]);
    expectNothingInTheAddress(page, documents, "correct horse");
  });

  test("making an account", async ({ page }) => {
    const username = `som.${Date.now().toString(36)}`;
    const { release, documents, sent } = await beforeHydration(page);
    await page.goto("/vi/register?returnTo=%2F%3Fkind%3Dbakery", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: "Tạo tài khoản" });
    await page.getByLabel("Tên đăng nhập").fill(username);
    await page.getByLabel("Mật khẩu", { exact: true }).fill("an early password");
    await page.getByLabel("Nhập lại mật khẩu").fill("an early password");
    expect(await isHydrated(button)).toBe(false);
    await button.click();
    await button.click();
    release();
    expectNothingInTheAddress(page, documents, "an early password");

    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
    await expect(page.getByRole("button", { name: `Tài khoản ${username}` })).toBeVisible();
    expect(sent).toEqual(["POST /api/auth/accounts"]);
    expectNothingInTheAddress(page, documents, "an early password");
  });

  test("asking for an emailed code", async ({ page }, testInfo) => {
    const email = `early.${testInfo.project.name}@example.com`;
    const { release, documents, sent } = await beforeHydration(page);
    await page.goto("/vi/sign-in/email", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: "Gửi mã" });
    await page.getByLabel("Email").fill(email);
    expect(await isHydrated(button)).toBe(false);
    await button.click();
    await button.click();
    release();
    expectNothingInTheAddress(page, documents, email);

    await expect(page.getByRole("heading", { level: 1, name: "Nhập mã" })).toBeVisible();
    expect(sent).toEqual(["POST /api/auth/sign-in-codes"]);
    expectNothingInTheAddress(page, documents, email);
  });

  test("deleting an account with its password", async ({ page }) => {
    const made = await page.request.post("/api/auth/accounts", {
      data: {
        username: `xoa.som.${Date.now().toString(36)}`,
        password: "a long password",
        session: "cookie",
      },
    });
    expect(made.status()).toBe(201);
    const { release, documents, sent } = await beforeHydration(page);
    await page.goto("/vi/delete-account", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: "Xoá vĩnh viễn tài khoản" });
    await page.getByLabel("Mật khẩu").fill("a long password");
    expect(await isHydrated(button)).toBe(false);
    await button.click();
    await button.click();
    release();
    expectNothingInTheAddress(page, documents, "a long password");

    await expect(page).toHaveURL(/\/vi\/delete-account\?done=1$/);
    await expect(page.getByRole("heading", { name: "Đã xoá tài khoản" })).toBeVisible();
    expect(sent).toEqual(["POST /api/accounts/me/password-deletion"]);
    expectNothingInTheAddress(page, documents, "a long password");
  });

  test("saving the email settings with the SMTP password", async ({ page }, testInfo) => {
    await signIn(
      page,
      `admin.email.unset.${testInfo.project.name}.${Date.now().toString(36)}@example.com`,
    );
    const { release, documents, sent } = await beforeHydration(page);
    await page.goto("/vi/admin/settings/email", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: "Lưu cấu hình" });
    await page.getByLabel("Địa chỉ gửi").fill("noreply@example.com");
    await page.getByLabel("Tên người gửi").fill("Second Bite");
    await page.getByLabel("Host").fill("smtp.example.com");
    await page.getByLabel("Mật khẩu").fill("smtp early secret");
    expect(await isHydrated(button)).toBe(false);
    await button.click();
    await button.click();
    release();
    expectNothingInTheAddress(page, documents, "smtp early secret");

    await expect(page.getByText("Đã lưu cấu hình email")).toBeVisible();
    expectNothingInTheAddress(page, documents, "smtp early secret");
    expect(sent.filter((request) => request.endsWith("/api/admin/email-settings"))).toHaveLength(1);
  });

  test("asking for the code that deletes an account", async ({ page }, testInfo) => {
    await signIn(page, `xoa.early.${testInfo.project.name}.${Date.now().toString(36)}@example.com`);
    const { release, sent } = await beforeHydration(page);
    await page.goto("/vi/delete-account", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: "Gửi mã xác nhận" });
    expect(await isHydrated(button)).toBe(false);
    await button.click();
    await button.click();
    release();

    await expect(page.getByRole("heading", { name: "Nhập mã xác nhận" })).toBeVisible();
    expect(sent).toEqual(["POST /api/accounts/me/deletion-codes"]);
  });

  // The test email waits while the settings have changes, which it would not use: a press kept from before the
  // page hydrated is not sent once the page sees the change typed then.
  test("a test email pressed after changing the settings is not sent", async ({
    page,
  }, testInfo) => {
    await signIn(
      page,
      `admin.email.set.${testInfo.project.name}.${Date.now().toString(36)}@example.com`,
    );
    const { release, sent } = await beforeHydration(page);
    await page.goto("/vi/admin/settings/email", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: "Gửi email thử" });
    await page.getByLabel("Tên người gửi").fill("Changed before hydration");
    expect(await isHydrated(button)).toBe(false);
    await button.click();
    release();

    await expect(page.getByText("Bạn có thay đổi chưa lưu")).toBeVisible();
    await expect(await hydrated(button)).toBeDisabled();
    await page.waitForLoadState("networkidle");
    expect(sent).toEqual([]);
  });
});
