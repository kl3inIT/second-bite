import { createElement, type ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";

import { renderAdmin } from "../testing/render";
import { type AdminAccount, type AdminAccountRow, readAccountQuery } from "./account";
import { AccountDetail } from "./account-detail";
import { AccountsList } from "./accounts-list";

// The screens with sample accounts, as the identity module's admin list will give them; the pages have none yet.
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) =>
    createElement("a", { href: `/vi${href}`, ...rest }, children),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/admin/accounts",
}));

function render(node: ReactNode) {
  return renderAdmin(node);
}

const rows: AdminAccountRow[] = [
  {
    id: "a-1",
    name: "Minh Anh",
    email: "minh.anh@example.com",
    role: "customer",
    sellers: [],
    orders: 12,
    createdAt: "2026-10-02T03:00:00Z",
    status: "active",
  },
  {
    id: "a-2",
    name: "Tuấn Phong",
    email: "tuan.phong@example.com",
    role: "staff",
    sellers: [
      { id: "s-1", name: "Trà sữa Mây" },
      { id: "s-2", name: "Cơm nhà Hạnh" },
    ],
    orders: 2,
    createdAt: "2026-10-01T03:00:00Z",
    status: "locked",
  },
];

describe("the accounts (AD-TK1)", () => {
  test("shows each account with its role, stores, orders, day created and status", () => {
    const html = render(
      createElement(AccountsList, {
        query: readAccountQuery({}),
        rows,
        total: 214,
        counts: { all: 214, customer: 186, seller: 26, admin: 2 },
      }),
    );
    expect(html).toContain("<h1");
    expect(html).toContain("Tài khoản");
    expect(html).toContain("Chủ cửa hàng/Nhân viên");
    expect(html).toContain(">186<");
    expect(html).toContain(">MA<");
    expect(html).toContain('href="/vi/admin/accounts/a-1"');
    expect(html).toContain("Khách");
    expect(html).toContain("Nhân viên");
    expect(html).toContain("Trà sữa Mây +1");
    expect(html).toContain("02/10/2026");
    expect(html).toContain("Hoạt động");
    expect(html).toContain("Đã khoá");
    expect(html).toContain("Hiển thị 1–10 trên 214 tài khoản");
    expect(html).toContain("Ngày tạo:");
  });

  test("says when a tab is empty", () => {
    const html = render(
      createElement(AccountsList, {
        query: readAccountQuery({ tab: "admin" }),
        rows: [],
        total: 0,
      }),
    );
    expect(html).toContain("Chưa có quản trị viên nào");
  });
});

const minhAnh: AdminAccount = {
  id: "a-1",
  name: "Minh Anh",
  email: "minh.anh@example.com",
  role: "customer",
  status: "active",
  createdAt: "2026-10-02T03:00:00Z",
  lastActiveAt: "2026-10-20T12:42:00Z",
  signIn: "email_code",
  orders: 12,
  pickupRate: 0.83,
  issues: [{ id: "i-1042", code: "BL-1042", title: "Bánh su kem bị chảy" }],
  recentOrders: [
    {
      id: "o-1",
      code: "SB-24817",
      item: "Túi bánh mì và croissant, 4 chiếc",
      sellerName: "Tiệm bánh Pháp",
      amountVnd: 57000,
      status: "held",
    },
    {
      id: "o-2",
      code: "SB-24790",
      item: "Cơm gà xối mỡ, kèm canh",
      sellerName: "Cơm nhà Hạnh",
      amountVnd: 30000,
      status: "no_show",
    },
  ],
  sellers: [],
  heldOrders: [{ code: "SB-24817", sellerName: "Tiệm bánh Pháp" }],
  position: { index: 1, total: 214, nextId: "a-2" },
};

describe("an account (AD-TK2, AD-TK4)", () => {
  test("shows its figures, recent orders and how it signs in, with the lock action", () => {
    const html = render(createElement(AccountDetail, { account: minhAnh, tab: "orders" }));
    expect(html).toContain("Minh Anh");
    expect(html).toContain("Hoạt động");
    expect(html).toContain("Đơn đã đặt");
    expect(html).toContain("83%");
    expect(html).toContain("02/10/2026");
    expect(html).toContain("Xem tất cả 12 đơn");
    expect(html).toContain("Túi bánh mì và croissant, 4 chiếc · Tiệm bánh Pháp");
    expect(html).toContain("57.000đ");
    expect(html).toContain("Đang giữ");
    expect(html).toContain("Không đến");
    expect(html).toContain("Mã qua email");
    expect(html).toContain("19:42, 20/10/2026");
    expect(html).toContain("Chưa là chủ cửa hàng hay nhân viên của cửa hàng nào.");
    expect(html).toContain("Khoá tài khoản");
    expect(html).not.toContain("Tài khoản đang bị khoá");
  });

  test("when locked, says what that means and offers to unlock, which waits for its backend", () => {
    const html = render(
      createElement(AccountDetail, { account: { ...minhAnh, status: "locked" }, tab: "orders" }),
    );
    expect(html).toContain("Đã khoá");
    expect(html).toContain("Tài khoản đang bị khoá");
    expect(html).toContain("Không đăng nhập được");
    expect(html).toContain("Lịch sử đơn và báo lỗi vẫn được giữ");
    expect(html).toContain("Mở khoá tài khoản");
    expect(html).toContain('title="Sắp có"');
  });

  test("lists its reports on their tab", () => {
    const html = render(createElement(AccountDetail, { account: minhAnh, tab: "issues" }));
    expect(html).toContain("BL-1042 · Bánh su kem bị chảy");
    expect(html).toContain('href="/vi/admin/issues/i-1042"');
  });
});
