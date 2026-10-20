import { expect, type Page, test } from "@playwright/test";

import { signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

// The stub gives each admin session the same fourteen stores: eleven active, two waiting, one blocked
// (stub-backend.mjs › Admin › Cửa hàng).
function card(page: Page, name: string) {
  return page.getByRole("link", { name: new RegExp(`^${name}\\s*\\d+$`) });
}

/** The figure on a status card: its name then its count, as a screen reader reads the link. */
async function expectCount(page: Page, name: string, count: number) {
  await expect(card(page, name)).toHaveAccessibleName(new RegExp(`^${name}\\s*${count}$`));
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

// SEC-62 › Stores list (Figma AD-Q1, AD-Q2).
test("the stores list shows the active stores, ten to a page (AD-Q1)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers", testInfo, { who: "ds" });

  await expect(page.getByRole("heading", { level: 1, name: "Cửa hàng" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expectCount(page, "Đang hoạt động", 11);
  await expect(card(page, "Đang hoạt động")).toHaveAttribute("aria-current", "true");
  await expectCount(page, "Chờ duyệt", 2);
  await expectCount(page, "Bị chặn", 1);

  // Newest change first; the address, the phone and the status on each row.
  await expect(table(page).getByRole("row")).toHaveCount(11);
  const first = table(page).getByRole("row").nth(1);
  await expect(first).toContainText("Tầng 1, Tasco Mall, Việt Hưng");
  await expect(first).toContainText("0900 000 1");
  await expect(first).toContainText("Đang hoạt động");
  await expect(page.getByRole("columnheader", { name: "Ngày sửa đổi" })).toHaveAttribute(
    "aria-sort",
    "descending",
  );
  await expect(page.getByText("Hiển thị 1–10 trên 11 cửa hàng")).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  await (await hydrated(page.getByRole("button", { name: "Trang 2" }))).click();
  await expect(page.getByText("Hiển thị 11–11 trên 11 cửa hàng")).toBeVisible();
  await expect(page).toHaveURL(/\/vi\/admin\/sellers\?page=2$/);
  await expect(table(page).getByRole("row")).toHaveCount(2);
});

test("a row opens the store, from its menu or anywhere on it (AD-Q2)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers", testInfo, { who: "dsmenu" });

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

test("the search, the area, the rows and the sort stay in the address (AD-TT2)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers", testInfo, { who: "dsloc" });

  const search = await hydrated(page.getByRole("searchbox", { name: "Tìm cửa hàng" }));
  await search.fill("banh");
  // The heading row and three stores.
  await expect(table(page).getByRole("row")).toHaveCount(4);
  await expect(row(page, "Tiệm bánh Pháp")).toBeVisible();
  await expect(row(page, "Bánh mì Hội An")).toBeVisible();
  await expect(page).toHaveURL(/\?q=banh$/);

  // An address reads the same list back.
  await page.reload();
  await expect(page.getByRole("searchbox", { name: "Tìm cửa hàng" })).toHaveValue("banh");
  await expect(table(page).getByRole("row")).toHaveCount(4);

  await (await hydrated(page.getByRole("searchbox", { name: "Tìm cửa hàng" }))).fill("bánh cuốn");
  await expect(page.getByText("Không có cửa hàng nào khớp với tìm kiếm")).toBeVisible();
  await expectNoSeriousA11yViolations(page);
  await page.getByRole("button", { name: "Xoá bộ lọc" }).click();
  await expect(page.getByRole("searchbox", { name: "Tìm cửa hàng" })).toHaveValue("");
  await expect(table(page).getByRole("row")).toHaveCount(11);

  await page.getByRole("combobox").filter({ hasText: "Khu vực" }).click();
  await page.getByRole("option", { name: "Tầng B1" }).click();
  await expect(table(page).getByRole("row")).toHaveCount(3);
  await expect(page).toHaveURL(/area=T%E1%BA%A7ng\+B1/);

  await page.getByRole("button", { name: "Cửa hàng", exact: true }).click();
  await expect(page.getByRole("columnheader", { name: "Cửa hàng" })).toHaveAttribute(
    "aria-sort",
    "ascending",
  );
  await expect(table(page).getByRole("row").nth(1)).toContainText("Rau củ sạch Việt Hưng");
  await expect(table(page).getByRole("row").nth(2)).toContainText("Xôi xéo Bà Tư");
  await expect(page).toHaveURL(/sort=name&dir=asc/);

  await page.getByRole("combobox").filter({ hasText: "Khu vực" }).click();
  await page.getByRole("option", { name: "Tất cả" }).click();
  await page.getByRole("combobox").filter({ hasText: "Số dòng" }).click();
  await page.getByRole("option", { name: "20" }).click();
  await expect(table(page).getByRole("row")).toHaveCount(12);
  await expect(page.getByText("Hiển thị 1–11 trên 11 cửa hàng")).toBeVisible();
});

test("a status card filters the list; an empty status says so in one line (AD-TT1)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers", testInfo, { who: "ds.trong" });

  await expect(page.getByText("Không có cửa hàng nào đang hoạt động.")).toBeVisible();
  await expectCount(page, "Chờ duyệt", 0);
  await (await hydrated(card(page, "Chờ duyệt"))).click();
  await expect(page).toHaveURL(/\?status=pending$/);
  await expect(card(page, "Chờ duyệt")).toHaveAttribute("aria-current", "true");
  await expect(page.getByText("Không có cửa hàng nào chờ duyệt.")).toBeVisible();
  await expect(page.getByRole("table")).toHaveCount(0);
  await expectNoSeriousA11yViolations(page);
});

// SEC-62 › Block, unblock, approve (Figma AD-Q5 to AD-Q11).
test("blocking asks first, then the store moves to Bị chặn (AD-Q5, AD-Q6)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers", testInfo, { who: "dschan" });

  await openRowMenu(page, "Tiệm bánh Pháp");
  await page.getByRole("menuitem", { name: "Chặn cửa hàng…" }).click();
  const dialog = page.getByRole("alertdialog", { name: "Chặn cửa hàng Tiệm bánh Pháp?" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Khi bị chặn:")).toBeVisible();
  await expect(dialog.getByRole("listitem")).toHaveCount(3);
  await expect(dialog.getByText("Có thể gỡ chặn bất cứ lúc nào.")).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  // Huỷ leaves the store as it was.
  await dialog.getByRole("button", { name: "Huỷ" }).click();
  await expect(dialog).toBeHidden();
  await expect(row(page, "Tiệm bánh Pháp")).toBeVisible();

  await openRowMenu(page, "Tiệm bánh Pháp");
  await page.getByRole("menuitem", { name: "Chặn cửa hàng…" }).click();
  await dialog.getByRole("button", { name: "Chặn cửa hàng" }).click();
  await expect(page.getByText("Đã chặn Tiệm bánh Pháp")).toBeVisible();
  await expect(dialog).toBeHidden();
  await expect(row(page, "Tiệm bánh Pháp")).toHaveCount(0);
  await expectCount(page, "Đang hoạt động", 10);
  await expectCount(page, "Bị chặn", 2);

  await card(page, "Bị chặn").click();
  await expect(row(page, "Tiệm bánh Pháp")).toContainText("Bị chặn");
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
  await page.goto("/vi/admin/sellers", { waitUntil: "commit" });

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
