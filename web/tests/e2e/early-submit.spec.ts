import { expect, test, type Locator, type Page } from "@playwright/test";

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
 * document the page asks for is kept, to show that no field went into its address.
 */
async function beforeHydration(page: Page) {
  let release!: () => void;
  const released = new Promise<void>((resolve) => (release = resolve));
  await page.route(/\/_next\/static\/.*\.js$/, async (route) => {
    await released;
    await route.fallback();
  });
  const documents: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "document") documents.push(request.url());
  });
  return { release, documents };
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
// address (a GET); React keeps the press and sends it the way the form does once the page has hydrated.
test.describe("a form with a secret pressed before the page has hydrated", () => {
  test("signing in with a password", async ({ page }) => {
    const { release, documents } = await beforeHydration(page);
    await page.goto("/vi/sign-in?returnTo=%2F%3Fkind%3Dbakery", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: "Đăng nhập", exact: true });
    await page.getByLabel("Tên đăng nhập").fill("lan.anh");
    await page.getByLabel("Mật khẩu").fill("correct horse");
    expect(await isHydrated(button)).toBe(false);
    await button.click();
    release();
    expectNothingInTheAddress(page, documents, "correct horse");

    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
    await expect(page.getByRole("button", { name: "Tài khoản lan.anh" })).toBeVisible();
    expectNothingInTheAddress(page, documents, "correct horse");
  });

  test("making an account", async ({ page }) => {
    const username = `som.${Date.now().toString(36)}`;
    const { release, documents } = await beforeHydration(page);
    await page.goto("/vi/register?returnTo=%2F%3Fkind%3Dbakery", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: "Tạo tài khoản" });
    await page.getByLabel("Tên đăng nhập").fill(username);
    await page.getByLabel("Mật khẩu", { exact: true }).fill("an early password");
    await page.getByLabel("Nhập lại mật khẩu").fill("an early password");
    expect(await isHydrated(button)).toBe(false);
    await button.click();
    release();
    expectNothingInTheAddress(page, documents, "an early password");

    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
    await expect(page.getByRole("button", { name: `Tài khoản ${username}` })).toBeVisible();
    expectNothingInTheAddress(page, documents, "an early password");
  });

  test("asking for an emailed code", async ({ page }, testInfo) => {
    const email = `early.${testInfo.project.name}@example.com`;
    const { release, documents } = await beforeHydration(page);
    await page.goto("/vi/sign-in/email", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: "Gửi mã" });
    await page.getByLabel("Email").fill(email);
    expect(await isHydrated(button)).toBe(false);
    await button.click();
    release();
    expectNothingInTheAddress(page, documents, email);

    await expect(page.getByRole("heading", { level: 1, name: "Nhập mã" })).toBeVisible();
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
    const { release, documents } = await beforeHydration(page);
    await page.goto("/vi/delete-account", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: "Xoá vĩnh viễn tài khoản" });
    await page.getByLabel("Mật khẩu").fill("a long password");
    expect(await isHydrated(button)).toBe(false);
    await button.click();
    release();
    expectNothingInTheAddress(page, documents, "a long password");

    await expect(page).toHaveURL(/\/vi\/delete-account\?done=1$/);
    await expect(page.getByRole("heading", { name: "Đã xoá tài khoản" })).toBeVisible();
    expectNothingInTheAddress(page, documents, "a long password");
  });

  test("saving the email settings with the SMTP password", async ({ page }, testInfo) => {
    const email = `admin.email.unset.${testInfo.project.name}.early@example.com`;
    const session = await page.request.post("/api/auth/sessions", {
      data: { challengeId: `ch-${encodeURIComponent(email)}`, code: "123456", session: "cookie" },
    });
    expect(session.status()).toBe(201);
    const { release, documents } = await beforeHydration(page);
    await page.goto("/vi/admin/settings/email", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: "Lưu cấu hình" });
    await page.getByLabel("Địa chỉ gửi").fill("noreply@example.com");
    await page.getByLabel("Tên người gửi").fill("Second Bite");
    await page.getByLabel("Host").fill("smtp.example.com");
    await page.getByLabel("Mật khẩu").fill("smtp early secret");
    expect(await isHydrated(button)).toBe(false);
    await button.click();
    release();
    expectNothingInTheAddress(page, documents, "smtp early secret");

    await expect(page.getByText("Đã lưu cấu hình email")).toBeVisible();
    expectNothingInTheAddress(page, documents, "smtp early secret");
  });
});
