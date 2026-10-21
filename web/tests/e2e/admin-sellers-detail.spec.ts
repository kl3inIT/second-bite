import { expect, type Page, test } from "@playwright/test";

import { signInTo } from "./admin";
import { expectNoSeriousA11yViolations } from "./axe";
import { hydrated } from "./hydration";

test.use({ locale: "vi-VN" });
// Each test signs in first, which takes a while when the projects run side by side.
test.setTimeout(90_000);

// The stub's first store, Tiệm bánh Pháp, has the Figma sample's four posts (one on sale, one sold out, one over,
// one withdrawn) and two members; the others have no posts (stub-backend.mjs › Admin › Cửa hàng).
const bakery = "/admin/sellers/se-admin-1";

function tab(page: Page, name: string | RegExp) {
  return page.getByRole("navigation", { name: "Mục của cửa hàng" }).getByRole("link", { name });
}

// SEC-62 › A store (Figma AD-Q3).
test("a store's page shows its profile, figures and overview (AD-Q3)", async ({
  page,
  isMobile,
}, testInfo) => {
  await signInTo(page, bakery, testInfo, { who: "ct" });

  await expect(page.getByRole("heading", { level: 1, name: "Tiệm bánh Pháp" })).toBeVisible();
  await expect(page).toHaveTitle(/Tiệm bánh Pháp/);
  await expect(page.getByRole("navigation", { name: "Đường dẫn" })).toContainText("Tiệm bánh Pháp");
  await expect(page.getByText("Đang hoạt động").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Chặn cửa hàng" })).toBeVisible();

  const figures = page.getByRole("definition");
  await expect(figures.first()).toHaveText("1");
  await expect(figures.nth(1)).toHaveText("2");
  await expect(page.getByText("Ngày tham gia")).toBeVisible();
  await expect(tab(page, "Tổng quan")).toHaveAttribute("aria-current", "page");
  await expect(tab(page, "Bài đăng · 4")).toBeVisible();
  await expect(tab(page, "Thành viên · 2")).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Túi bánh mì và croissant, 4 chiếc" }),
  ).toBeVisible();
  await expect(page.getByText("-40% · còn 3/3 suất")).toBeVisible();
  await expect(page.getByText("chu.cua.hang@example.com")).toBeVisible();
  await expect(page.getByText("Chủ cửa hàng")).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  if (!isMobile) {
    // Active stores, the newest change first: two changed later today, so this one is third.
    await expect(page.getByText("3 / 11")).toBeVisible();
    await (await hydrated(page.getByRole("link", { name: "Cửa hàng trước" }))).click();
    await expect(page).toHaveURL(/\/vi\/admin\/sellers\/se-admin-2$/);
    await expect(page.getByRole("heading", { level: 1, name: "Cơm nhà Hạnh" })).toBeVisible();
    await expect(page.getByText("2 / 11")).toBeVisible();
    await expect(page.getByText("Không có bài đang bán.")).toBeVisible();
  }
});

// SEC-62 › A store's posts (Figma AD-QD1 to AD-QD3).
test("the posts tab filters by status and opens a post in the side panel (AD-QD1 to QD3)", async ({
  page,
}, testInfo) => {
  await signInTo(page, bakery, testInfo, { who: "ctbai" });

  await (await hydrated(tab(page, "Bài đăng · 4"))).click();
  await expect(page).toHaveURL(/\?tab=posts$/);
  const filter = page.getByRole("group", { name: "Trạng thái bài đăng" });
  await expect(filter.getByRole("radio", { name: "Đang bán · 1" })).toBeChecked();
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(2);
  await expect(page.getByRole("columnheader", { name: "Đăng lúc" })).toBeVisible();
  await expect(page.getByText("Hiển thị 1–1 trên 1 bài đăng")).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  await (await hydrated(filter.getByText("Đã gỡ · 1"))).click();
  await expect(page).toHaveURL(/\?tab=posts&posts=withdrawn$/);
  await expect(page.getByRole("columnheader", { name: "Gỡ lúc" })).toBeVisible();
  await expect(page.getByRole("table")).toContainText("Cơm sườn nướng, 1 suất");

  await filter.getByText("Đang bán · 1").click();
  await page.getByRole("button", { name: "Xem Túi bánh mì và croissant, 4 chiếc" }).click();
  const sheet = page.getByRole("dialog", { name: "Chi tiết bài đăng" });
  await expect(sheet).toBeVisible();
  await expect(
    sheet.getByRole("heading", { name: "Túi bánh mì và croissant, 4 chiếc" }),
  ).toBeVisible();
  await expect(sheet.getByText("Còn 3/3 suất · đã giữ 0")).toBeVisible();
  await expect(sheet.getByText("Bánh", { exact: true })).toBeVisible();
  await expect(sheet.getByText("57.000đ")).toBeVisible();
  await expectNoSeriousA11yViolations(page);
  await sheet.getByRole("button", { name: "Đóng" }).click();
  await expect(sheet).toBeHidden();
});

// SEC-62 › A store's members and documents (Figma AD-QD4, AD-QD5).
test("the members tab lists the people, the documents tab is empty until its backend (AD-QD4, QD5)", async ({
  page,
}, testInfo) => {
  await signInTo(page, `${bakery}?tab=members`, testInfo, { who: "cttv" });

  const members = page.getByRole("table", { name: "Thành viên của cửa hàng" });
  await expect(members.getByRole("row")).toHaveCount(3);
  await expect(members.getByRole("row").nth(1)).toContainText("chu.cua.hang@example.com");
  await expect(members.getByRole("row").nth(1)).toContainText("Chủ cửa hàng");
  await expect(members.getByRole("row").nth(2)).toContainText("Nhân viên");
  await expectNoSeriousA11yViolations(page);

  await (await hydrated(tab(page, "Kiểm định"))).click();
  await expect(page).toHaveURL(/\?tab=documents$/);
  await expect(page.getByText("Chưa có giấy tờ kiểm định.")).toBeVisible();
  await expectNoSeriousA11yViolations(page);
});

// SEC-62 › Blocking from a store's page (Figma AD-Q7, AD-Q4).
test("a store blocked from its page shows the blocked card and can be unblocked (AD-Q7, AD-Q4)", async ({
  page,
}, testInfo) => {
  await signInTo(page, bakery, testInfo, { who: "ctchan" });

  await (await hydrated(page.getByRole("button", { name: "Chặn cửa hàng" }))).click();
  const dialog = page.getByRole("alertdialog", { name: "Chặn cửa hàng Tiệm bánh Pháp?" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("textbox", { name: "Lý do chặn" }).fill("Bán bánh đã quá hạn sử dụng.");
  await dialog.getByRole("button", { name: "Chặn cửa hàng" }).click();
  await expect(
    page.getByText("Đã chặn Tiệm bánh Pháp và gửi email cho chủ cửa hàng"),
  ).toBeVisible();

  await expect(page.getByRole("heading", { name: "Cửa hàng đang bị chặn" })).toBeVisible();
  await expect(page.getByText("Lý do: Bán bánh đã quá hạn sử dụng.")).toBeVisible();
  await expect(page.getByText("Không hiện với khách")).toBeVisible();
  await expect(page.getByText("Đổi trạng thái")).toBeVisible();
  const unblock = page.getByRole("button", { name: "Gỡ chặn" });
  await expect(unblock).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  await (await hydrated(unblock)).click();
  await expect(page.getByText("Đã gỡ chặn Tiệm bánh Pháp")).toBeVisible();
  await expect(page.getByRole("button", { name: "Chặn cửa hàng" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cửa hàng đang bị chặn" })).toHaveCount(0);
});

test("a store waiting for approval is approved from its page", async ({ page }, testInfo) => {
  await signInTo(page, "/admin/sellers/se-admin-12", testInfo, { who: "ctduyet" });

  await expect(page.getByRole("heading", { level: 1, name: "Phở bò Gánh" })).toBeVisible();
  await expect(page.getByText("Chờ duyệt").first()).toBeVisible();
  await (await hydrated(page.getByRole("button", { name: "Duyệt" }))).click();
  await expect(page.getByText("Đã duyệt Phở bò Gánh")).toBeVisible();
  await expect(page.getByRole("button", { name: "Chặn cửa hàng" })).toBeVisible();
});

test("a rejected store says why and is approved from its page (AD-DS5)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers/se-admin-15", testInfo, { who: "cttuchoi" });

  await expect(page.getByRole("heading", { level: 1, name: "Bánh cuốn Thanh Trì" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cửa hàng bị từ chối" })).toBeVisible();
  await expect(
    page.getByText("Lý do: Ảnh cửa hàng chưa phải ảnh quầy tại Tasco Mall."),
  ).toBeVisible();
  await expectNoSeriousA11yViolations(page);
  await (await hydrated(page.getByRole("button", { name: "Duyệt" }))).click();
  await expect(page.getByText("Đã duyệt Bánh cuốn Thanh Trì")).toBeVisible();
  await expect(page.getByRole("button", { name: "Chặn cửa hàng" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cửa hàng bị từ chối" })).toHaveCount(0);
});

// SEC-62 › A store that does not exist (Figma AD-TT5).
test("a store that does not exist is the admin's not-found page (AD-TT5)", async ({
  page,
}, testInfo) => {
  await signInTo(page, "/admin/sellers/se-admin-99", testInfo, { who: "ctkhong" });

  await expect(
    page.getByRole("heading", { level: 1, name: "Không tìm thấy trang này" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Về Tổng quan", exact: true })).toBeVisible();
  await expectNoSeriousA11yViolations(page);
});
