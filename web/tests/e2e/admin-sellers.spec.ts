import { expect, type Page, test } from "@playwright/test";

import { signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

// The stub gives each admin session the same fifteen stores: eleven active, two waiting, one rejected, one
// blocked (stub-backend.mjs › Admin › Cửa hàng).
function card(page: Page, name: string) {
  return page.getByRole("link", { name: new RegExp(`^${name}\\s*\\d+`) });
}

/**
 * The figure on a status card: its name then its count, as a screen reader reads the link, and then the 14 days
 * of its trend, the last of them today's count.
 */
async function expectCount(page: Page, name: string, count: number) {
  await expect(card(page, name)).toHaveAccessibleName(
    new RegExp(`^${name}\\s*${count}(\\D.*: ${count})?$`),
  );
}

function table(page: Page) {
  return page.getByRole("table");
}

function row(page: Page, name: string) {
  return table(page).getByRole("row").filter({ hasText: name });
}

async function openRowMenu(page: Page, name: string) {
  await (await hydrated(page.getByRole("button", { name: `Thao tác với ${name}` }))).click();
}

// SEC-62 › Stores list (Figma AD-Q1, AD-Q2, AD-DS1).
test("the stores list opens on the pending queue, oldest first (AD-DS1)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers", testInfo, { who: "ds" });

  await expect(page.getByRole("heading", { level: 1, name: "Cửa hàng" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(card(page, "Chờ duyệt")).toHaveAttribute("aria-current", "true");
  await expectCount(page, "Chờ duyệt", 2);
  await expectCount(page, "Đang hoạt động", 11);
  await expectCount(page, "Bị từ chối", 1);
  await expectCount(page, "Bị chặn", 1);

  // Each card draws its last 14 days: one value a day under the pointer, and the days for a screen reader. The
  // blocked store was blocked yesterday, active before.
  const blocked = card(page, "Bị chặn");
  await expect(blocked.locator("svg title")).toHaveCount(14);
  await expect(blocked.locator("svg title").last()).toHaveText(/: 1$/);
  await expect(blocked.locator("svg title").first()).toHaveText(/: 0$/);
  await expect(blocked.locator(".sr-only")).toHaveText(/^(.+: [01], ){13}.+: 1$/);

  await expect(table(page).getByRole("row")).toHaveCount(3);
  await expect(table(page).getByRole("row").nth(1)).toContainText("Cơm tấm Sài Gòn");
  await expect(table(page).getByRole("row").nth(2)).toContainText("Phở bò Gánh");
  await expectNoSeriousA11yViolations(page);
});

test("the active stores come ten to a page, the latest change first (AD-Q1)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers?status=active", testInfo, { who: "dsact" });

  await expect(card(page, "Đang hoạt động")).toHaveAttribute("aria-current", "true");
  await expect(table(page).getByRole("row")).toHaveCount(11);
  const first = table(page).getByRole("row").nth(1);
  await expect(first).toContainText("Tầng 1, Tasco Mall, Việt Hưng");
  await expect(first).toContainText("0900 000 1");
  await expect(first).toContainText("Đang hoạt động");
  await expect(page.getByText("Hiển thị 1–10 trên 11 cửa hàng")).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  await (await hydrated(page.getByRole("button", { name: "Trang 2" }))).click();
  await expect(page.getByText("Hiển thị 11–11 trên 11 cửa hàng")).toBeVisible();
  await expect(page).toHaveURL(/\/vi\/admin\/sellers\?status=active&page=2$/);
  await expect(table(page).getByRole("row")).toHaveCount(2);
});

test("a row opens the store, from its menu or anywhere on it (AD-Q2)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers?status=active", testInfo, { who: "dsmenu" });

  await openRowMenu(page, "Tiệm bánh Pháp");
  const menu = page.getByRole("menu");
  await expect(menu.getByRole("menuitem")).toHaveText(["Xem chi tiết", "Chặn cửa hàng…"]);
  await expectNoSeriousA11yViolations(page);
  await menu.getByRole("menuitem", { name: "Xem chi tiết" }).click();
  await expect(page).toHaveURL(/\/vi\/admin\/sellers\/se-admin-1$/);
  await expect(page.getByRole("heading", { level: 1, name: "Tiệm bánh Pháp" })).toBeVisible();

  await page.goBack();
  await (await hydrated(row(page, "Cơm nhà Hạnh").getByRole("cell").nth(1))).click();
  await expect(page).toHaveURL(/\/vi\/admin\/sellers\/se-admin-2$/);
});

test("the backend searches the stores; the search and the rows stay in the address (AD-TT2)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers?status=active", testInfo, { who: "dsloc" });

  const search = await hydrated(page.getByRole("searchbox", { name: "Tìm cửa hàng" }));
  await search.fill("banh");
  // The heading row and three stores, found without their marks.
  await expect(page).toHaveURL(/\?status=active&q=banh$/);
  await expect(table(page).getByRole("row")).toHaveCount(4);
  await expect(row(page, "Tiệm bánh Pháp")).toBeVisible();
  await expect(row(page, "Bánh mì Hội An")).toBeVisible();

  // An address reads the same list back.
  await page.reload();
  await expect(page.getByRole("searchbox", { name: "Tìm cửa hàng" })).toHaveValue("banh");
  await expect(table(page).getByRole("row")).toHaveCount(4);

  // A phone number finds its store too.
  await (await hydrated(page.getByRole("searchbox", { name: "Tìm cửa hàng" }))).fill("000 110");
  await expect(table(page).getByRole("row")).toHaveCount(2);
  await expect(row(page, "Gà rán Tasco")).toBeVisible();

  await page.getByRole("searchbox", { name: "Tìm cửa hàng" }).fill("bánh cuốn");
  await expect(page.getByText("Không có cửa hàng nào khớp với tìm kiếm")).toBeVisible();
  await expectNoSeriousA11yViolations(page);
  await page.getByRole("button", { name: "Xoá bộ lọc" }).click();
  await expect(page.getByRole("searchbox", { name: "Tìm cửa hàng" })).toHaveValue("");
  await expect(table(page).getByRole("row")).toHaveCount(11);

  await page.getByRole("combobox").filter({ hasText: "Số dòng" }).click();
  await page.getByRole("option", { name: "20" }).click();
  await expect(page).toHaveURL(/size=20/);
  await expect(table(page).getByRole("row")).toHaveCount(12);
  await expect(page.getByText("Hiển thị 1–11 trên 11 cửa hàng")).toBeVisible();
});

test("a status card filters the list; an empty status says so in one line (AD-TT1)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers", testInfo, { who: "ds.trong" });

  await expect(page.getByText("Không có cửa hàng nào chờ duyệt.")).toBeVisible();
  await expectCount(page, "Đang hoạt động", 0);
  await (await hydrated(card(page, "Đang hoạt động"))).click();
  await expect(page).toHaveURL(/\?status=active$/);
  await expect(card(page, "Đang hoạt động")).toHaveAttribute("aria-current", "true");
  await expect(page.getByText("Không có cửa hàng nào đang hoạt động.")).toBeVisible();
  await expect(page.getByRole("table")).toHaveCount(0);
  await expectNoSeriousA11yViolations(page);
});

// SEC-62 › Block, unblock, approve, reject (Figma AD-Q5 to AD-Q11, AD-DS3, AD-DS4).
test("blocking asks why first, then the store moves to Bị chặn (AD-Q5, AD-DS4)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers?status=active", testInfo, { who: "dschan" });

  await openRowMenu(page, "Tiệm bánh Pháp");
  await page.getByRole("menuitem", { name: "Chặn cửa hàng…" }).click();
  const dialog = page.getByRole("alertdialog", { name: "Chặn cửa hàng Tiệm bánh Pháp?" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Khi bị chặn:")).toBeVisible();
  await expect(dialog.getByRole("listitem")).toHaveCount(4);
  await expect(dialog.getByText("Có thể gỡ chặn bất cứ lúc nào.")).toBeVisible();
  const confirm = dialog.getByRole("button", { name: "Chặn cửa hàng" });
  await expect(confirm).toBeDisabled();
  await expectNoSeriousA11yViolations(page);

  // Huỷ leaves the store as it was.
  await dialog.getByRole("button", { name: "Huỷ" }).click();
  await expect(dialog).toBeHidden();
  await expect(row(page, "Tiệm bánh Pháp")).toBeVisible();

  await openRowMenu(page, "Tiệm bánh Pháp");
  await page.getByRole("menuitem", { name: "Chặn cửa hàng…" }).click();
  // A reason under ten characters is not enough.
  await dialog.getByRole("textbox", { name: "Lý do chặn" }).fill("Quá hạn");
  await expect(confirm).toBeDisabled();
  await dialog.getByRole("textbox", { name: "Lý do chặn" }).fill("Bán bánh đã quá hạn sử dụng.");
  await confirm.click();
  await expect(
    page.getByText("Đã chặn Tiệm bánh Pháp và gửi email cho chủ cửa hàng"),
  ).toBeVisible();
  await expect(dialog).toBeHidden();
  await expect(row(page, "Tiệm bánh Pháp")).toHaveCount(0);
  await expectCount(page, "Đang hoạt động", 10);
  await expectCount(page, "Bị chặn", 2);

  await card(page, "Bị chặn").click();
  await expect(row(page, "Tiệm bánh Pháp")).toContainText("Bị chặn");
});

test("rejecting a pending store asks why, then it moves to Bị từ chối (AD-DS3)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers", testInfo, { who: "dstuchoi" });

  await openRowMenu(page, "Phở bò Gánh");
  await expect(page.getByRole("menu").getByRole("menuitem")).toHaveText([
    "Xem chi tiết",
    "Duyệt",
    "Từ chối…",
  ]);
  await page.getByRole("menuitem", { name: "Từ chối…" }).click();
  const dialog = page.getByRole("alertdialog", { name: "Từ chối cửa hàng Phở bò Gánh?" });
  await expect(dialog.getByText("Khi bị từ chối:")).toBeVisible();
  await dialog
    .getByRole("textbox", { name: "Lý do từ chối" })
    .fill("Ảnh cửa hàng chưa phải ảnh quầy tại Tasco Mall.");
  await expectNoSeriousA11yViolations(page);
  await dialog.getByRole("button", { name: "Từ chối" }).click();
  await expect(
    page.getByText("Đã từ chối Phở bò Gánh và gửi email cho chủ cửa hàng"),
  ).toBeVisible();
  await expect(row(page, "Phở bò Gánh")).toHaveCount(0);
  await expectCount(page, "Chờ duyệt", 1);
  await expectCount(page, "Bị từ chối", 2);

  await card(page, "Bị từ chối").click();
  await expect(row(page, "Phở bò Gánh")).toContainText("Bị từ chối");
  await openRowMenu(page, "Phở bò Gánh");
  await expect(page.getByRole("menu").getByRole("menuitem")).toHaveText(["Xem chi tiết", "Duyệt"]);
});

test("unblocking and approving run at once (AD-Q8 to AD-Q11)", async ({ page }, testInfo) => {
  await signInTo(page, "/admin/sellers?status=blocked", testInfo, { who: "dsgo" });

  await openRowMenu(page, "Chè Thái Lan");
  await expect(page.getByRole("menu").getByRole("menuitem")).toHaveText([
    "Xem chi tiết",
    "Gỡ chặn",
  ]);
  await page.getByRole("menuitem", { name: "Gỡ chặn" }).click();
  await expect(page.getByText("Đã gỡ chặn Chè Thái Lan")).toBeVisible();
  await expect(page.getByText("Không có cửa hàng nào bị chặn.")).toBeVisible();
  await expectCount(page, "Đang hoạt động", 12);

  await (await hydrated(card(page, "Chờ duyệt"))).click();
  await expect(row(page, "Phở bò Gánh")).toContainText("Chờ duyệt");
  await openRowMenu(page, "Phở bò Gánh");
  await page.getByRole("menuitem", { name: "Duyệt" }).click();
  await expect(page.getByText("Đã duyệt Phở bò Gánh")).toBeVisible();
  await expect(row(page, "Phở bò Gánh")).toHaveCount(0);
  await expectCount(page, "Chờ duyệt", 1);
  await expectNoSeriousA11yViolations(page);
});
// SEC-62 › Loading and failing (Figma AD-TT3, AD-TT4).
test("the list shows its shapes while it loads (AD-TT3)", async ({ page }, testInfo) => {
  await signInTo(page, "/admin/khong-co", testInfo, { who: "ds.cham" });
  // The page streams in: its shapes show before the slow list arrives.
  await page.goto("/vi/admin/sellers?status=active", { waitUntil: "commit" });

  await expect(page.getByRole("status", { name: "Đang tải danh sách cửa hàng" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Cửa hàng" })).toBeVisible();
  await expect(table(page).getByRole("row")).toHaveCount(11, { timeout: 15_000 });
  await expect(page.getByRole("status", { name: "Đang tải danh sách cửa hàng" })).toHaveCount(0);
});

test("a list the backend cannot give shows the admin's error (AD-TT4)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/khong-co", testInfo, { who: "ds.loi" });
  await page.goto("/vi/admin/sellers");

  await expect(page.getByText("Không tải được dữ liệu")).toBeVisible();
  await expect(page.getByRole("button", { name: "Thử lại" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Đường dẫn" })).toContainText("Cửa hàng");
  await expectNoSeriousA11yViolations(page);
});
