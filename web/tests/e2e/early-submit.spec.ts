import { expect, test, type Locator, type Page } from "@playwright/test";

import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });

/** The names of the fields a form with a secret has; none of them may reach an address. */
const FIELDS = [
  "username",
  "password",
  "confirm",
  "currentPassword",
  "newPassword",
  "email",
  "code",
  "smtpPassword",
  "brevoApiKey",
] as const;

/** The requests the page makes that write to the API, to show that a form is sent once. */
function writesOf(page: Page) {
  const sent: string[] = [];
  page.on("request", (request) => {
    const { pathname } = new URL(request.url());
    if (request.method() !== "GET" && pathname.startsWith("/api/")) {
      sent.push(`${request.method()} ${pathname}`);
    }
  });
  return sent;
}

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
  page.on("request", (request) => {
    if (request.resourceType() === "document") documents.push(request.url());
  });
  return { release, documents, sent: writesOf(page) };
}

/**
 * Holds the requests the router makes for the next page (React Server Components, asked for with an `RSC` header),
 * so a form that leaves the page once it is sent stays on the screen until `release`, as on a slow line, where the
 * next page once took seconds to come and a second press in that time was sent again.
 */
async function holdTheNextPage(page: Page) {
  let release!: () => void;
  const released = new Promise<void>((resolve) => (release = resolve));
  await page.route("**/*", async (route) => {
    if (route.request().headers()["rsc"] === "1") await released;
    await route.fallback();
  });
  return release;
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

  test("changing the password", async ({ page }) => {
    const made = await page.request.post("/api/auth/accounts", {
      data: {
        username: `doi.som.${Date.now().toString(36)}`,
        password: "an old password",
        session: "cookie",
      },
    });
    expect(made.status()).toBe(201);
    const { release, documents, sent } = await beforeHydration(page);
    const put = page.waitForRequest(
      (request) =>
        request.method() === "PUT" && request.url().endsWith("/api/accounts/me/password"),
    );
    await page.goto("/vi/account/settings", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: "Đổi mật khẩu" });
    await page.getByLabel("Mật khẩu hiện tại").fill("an old password");
    await page.getByLabel("Mật khẩu mới", { exact: true }).fill("a new early password");
    await page.getByLabel("Nhập lại mật khẩu mới").fill("a new early password");
    expect(await isHydrated(button)).toBe(false);
    await button.click();
    await button.click();
    release();
    expectNothingInTheAddress(page, documents, "an old password");
    expectNothingInTheAddress(page, documents, "a new early password");

    expect((await put).postDataJSON()).toEqual({
      currentPassword: "an old password",
      newPassword: "a new early password",
    });
    await expect(page.getByRole("status")).toContainText("Đã đổi mật khẩu");
    await page.waitForLoadState("networkidle");
    expect(sent).toEqual(["PUT /api/accounts/me/password"]);
    expectNothingInTheAddress(page, documents, "an old password");
    expectNothingInTheAddress(page, documents, "a new early password");
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

// A form that leaves the page once it is sent (signing in, making an account, deleting it) is sent once whenever the
// presses come: one kept from before the page hydrated, one right after React replayed it, and one while the next
// page is still on its way after the server said yes. On a slow phone that last wait took seconds, the button came
// back, and a second press made a second session.
test.describe("a form that leaves the page pressed again on its way out", () => {
  test("signing in with a password", async ({ page }) => {
    const { release, sent } = await beforeHydration(page);
    const releaseTheNextPage = await holdTheNextPage(page);
    await page.goto("/vi/sign-in?returnTo=%2F%3Fkind%3Dbakery", { waitUntil: "domcontentloaded" });

    // The button keeps its place while it says the form is being sent.
    const button = page.getByRole("button", { name: /^(Đăng nhập|Đang đăng nhập…)$/ });
    await page.getByLabel("Tên đăng nhập").fill("lan.anh");
    await page.getByLabel("Mật khẩu").fill("correct horse");
    const answered = page.waitForResponse((response) =>
      response.url().endsWith("/api/auth/password-sessions"),
    );
    await button.click();
    release();
    await (await hydrated(button)).click({ force: true });
    expect((await answered).status()).toBe(201);
    await expect(button).toBeDisabled();
    await button.click({ force: true });
    releaseTheNextPage();

    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
    await expect(page.getByRole("button", { name: "Tài khoản lan.anh" })).toBeVisible();
    expect(sent).toEqual(["POST /api/auth/password-sessions"]);
  });

  test("making an account", async ({ page }) => {
    const username = `som.ra.${Date.now().toString(36)}`;
    const { release, sent } = await beforeHydration(page);
    const releaseTheNextPage = await holdTheNextPage(page);
    await page.goto("/vi/register?returnTo=%2F%3Fkind%3Dbakery", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: /^(Tạo tài khoản|Đang tạo tài khoản…)$/ });
    await page.getByLabel("Tên đăng nhập").fill(username);
    await page.getByLabel("Mật khẩu", { exact: true }).fill("an early password");
    await page.getByLabel("Nhập lại mật khẩu").fill("an early password");
    const answered = page.waitForResponse((response) =>
      response.url().endsWith("/api/auth/accounts"),
    );
    await button.click();
    release();
    await (await hydrated(button)).click({ force: true });
    expect((await answered).status()).toBe(201);
    await expect(button).toBeDisabled();
    await button.click({ force: true });
    releaseTheNextPage();

    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
    await expect(page.getByRole("button", { name: `Tài khoản ${username}` })).toBeVisible();
    expect(sent).toEqual(["POST /api/auth/accounts"]);
  });

  test("signing in with an emailed code", async ({ page }, testInfo) => {
    const { release, sent } = await beforeHydration(page);
    const releaseTheNextPage = await holdTheNextPage(page);
    await page.goto("/vi/sign-in/email?returnTo=%2F%3Fkind%3Dbakery", {
      waitUntil: "domcontentloaded",
    });
    await page.getByLabel("Email").fill(`roi.${testInfo.project.name}@example.com`);
    await page.getByRole("button", { name: "Gửi mã" }).click();
    release();

    // The code sends itself once its sixth digit is typed; the button is pressed as well, and again.
    const button = page.getByRole("button", { name: /^(Xác nhận|Đang xác nhận…)$/ });
    const answered = page.waitForResponse((response) =>
      response.url().endsWith("/api/auth/sessions"),
    );
    await page.getByLabel("Mã đăng nhập 6 số").fill("123456");
    await button.click({ force: true });
    expect((await answered).status()).toBe(201);
    await expect(button).toBeDisabled();
    await button.click({ force: true });
    releaseTheNextPage();

    await expect(page).toHaveURL(/\/vi\?kind=bakery$/);
    expect(sent).toEqual(["POST /api/auth/sign-in-codes", "POST /api/auth/sessions"]);
  });

  test("deleting an account with its password", async ({ page }) => {
    const made = await page.request.post("/api/auth/accounts", {
      data: {
        username: `xoa.ra.${Date.now().toString(36)}`,
        password: "a long password",
        session: "cookie",
      },
    });
    expect(made.status()).toBe(201);
    const { release, sent } = await beforeHydration(page);
    const releaseTheNextPage = await holdTheNextPage(page);
    await page.goto("/vi/delete-account", { waitUntil: "domcontentloaded" });

    const button = page.getByRole("button", { name: /^(Xoá vĩnh viễn tài khoản|Đang xoá…)$/ });
    await page.getByLabel("Mật khẩu").fill("a long password");
    const answered = page.waitForResponse((response) =>
      response.url().endsWith("/api/accounts/me/password-deletion"),
    );
    await button.click();
    release();
    await (await hydrated(button)).click({ force: true });
    expect((await answered).ok()).toBe(true);
    await expect(button).toBeDisabled();
    await button.click({ force: true });
    releaseTheNextPage();

    await expect(page.getByRole("heading", { name: "Đã xoá tài khoản" })).toBeVisible();
    expect(sent).toEqual(["POST /api/accounts/me/password-deletion"]);
  });
});

/**
 * Drops the requests the router makes for the next page (React Server Components, asked for with an `RSC` header):
 * held for good, as on a mobile line that lost them, or failed at once. The page's own document still loads.
 */
async function dropTheNextPage(page: Page, how: "hold" | "abort") {
  await page.route("**/*", async (route) => {
    if (route.request().headers()["rsc"] !== "1") return route.fallback();
    if (how === "abort") return route.abort("internetdisconnected");
    // Held until the test ends.
  });
}

// A form that leaves the page once it is sent stays sent until the next page comes (above). When the router never
// brings that page, the line having lost it, the form does not stay stuck on "sending…" for good: the next page
// loads in full, which sends nothing again.
test.describe("a form that leaves the page when the next page does not come", () => {
  // The next page loads in full after the wait `leavingThePage` gives the router, then takes its own time.
  test.slow();

  for (const how of ["hold", "abort"] as const) {
    test(`signing in with a password (${how})`, async ({ page }) => {
      await page.goto("/vi/sign-in?returnTo=%2F%3Fkind%3Dbakery");
      const sent = writesOf(page);
      await dropTheNextPage(page, how);

      await page.getByLabel("Tên đăng nhập").fill("lan.anh");
      await page.getByLabel("Mật khẩu").fill("correct horse");
      await (await hydrated(page.getByRole("button", { name: "Đăng nhập", exact: true }))).click();

      await expect(page).toHaveURL(/\/vi\?kind=bakery$/, { timeout: 20_000 });
      await expect(page.getByRole("button", { name: "Tài khoản lan.anh" })).toBeVisible();
      expect(sent).toEqual(["POST /api/auth/password-sessions"]);
    });
  }

  test("making an account", async ({ page }) => {
    const username = `som.mat.${Date.now().toString(36)}`;
    await page.goto("/vi/register?returnTo=%2F%3Fkind%3Dbakery");
    const sent = writesOf(page);
    await dropTheNextPage(page, "hold");

    await page.getByLabel("Tên đăng nhập").fill(username);
    await page.getByLabel("Mật khẩu", { exact: true }).fill("a lost password");
    await page.getByLabel("Nhập lại mật khẩu").fill("a lost password");
    await (await hydrated(page.getByRole("button", { name: "Tạo tài khoản" }))).click();

    await expect(page).toHaveURL(/\/vi\?kind=bakery$/, { timeout: 20_000 });
    await expect(page.getByRole("button", { name: `Tài khoản ${username}` })).toBeVisible();
    expect(sent).toEqual(["POST /api/auth/accounts"]);
  });

  test("signing in with an emailed code", async ({ page }, testInfo) => {
    await page.goto("/vi/sign-in/email?returnTo=%2F%3Fkind%3Dbakery");
    const sent = writesOf(page);
    await page.getByLabel("Email").fill(`mat.${testInfo.project.name}@example.com`);
    await (await hydrated(page.getByRole("button", { name: "Gửi mã" }))).click();
    await expect(page.getByRole("heading", { level: 1, name: "Nhập mã" })).toBeVisible();
    await dropTheNextPage(page, "hold");

    await page.getByLabel("Mã đăng nhập 6 số").fill("123456");

    await expect(page).toHaveURL(/\/vi\?kind=bakery$/, { timeout: 20_000 });
    expect(sent).toEqual(["POST /api/auth/sign-in-codes", "POST /api/auth/sessions"]);
  });

  test("deleting an account with its password", async ({ page }) => {
    const made = await page.request.post("/api/auth/accounts", {
      data: {
        username: `xoa.mat.${Date.now().toString(36)}`,
        password: "a long password",
        session: "cookie",
      },
    });
    expect(made.status()).toBe(201);
    await page.goto("/vi/delete-account");
    const sent = writesOf(page);
    await dropTheNextPage(page, "hold");

    await page.getByLabel("Mật khẩu").fill("a long password");
    await (await hydrated(page.getByRole("button", { name: "Xoá vĩnh viễn tài khoản" }))).click();

    await expect(page).toHaveURL(/\/vi\/delete-account\?done=1$/, { timeout: 20_000 });
    await expect(page.getByRole("heading", { name: "Đã xoá tài khoản" })).toBeVisible();
    expect(sent).toEqual(["POST /api/accounts/me/password-deletion"]);
  });

  test("deleting an account with an emailed code", async ({ page }, testInfo) => {
    await signIn(page, `xoa.mat.${testInfo.project.name}.${Date.now().toString(36)}@example.com`);
    await page.goto("/vi/delete-account");
    const sent = writesOf(page);
    await (await hydrated(page.getByRole("button", { name: "Gửi mã xác nhận" }))).click();
    await expect(page.getByRole("heading", { name: "Nhập mã xác nhận" })).toBeVisible();
    await dropTheNextPage(page, "hold");

    await page.getByLabel("Mã xác nhận 6 số").fill("123456");
    await page.getByRole("button", { name: "Xoá vĩnh viễn tài khoản" }).click();

    await expect(page).toHaveURL(/\/vi\/delete-account\?done=1$/, { timeout: 20_000 });
    await expect(page.getByRole("heading", { name: "Đã xoá tài khoản" })).toBeVisible();
    expect(sent).toEqual([
      "POST /api/accounts/me/deletion-codes",
      "POST /api/accounts/me/deletion",
    ]);
  });
});
