import { createElement, type ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";

import issues from "../../../../messages/admin/issues.vi.json";
import { type AdminIssue, type AdminIssueRow, readIssueQuery } from "./issue";
import { IssueDetail } from "./issue-detail";
import { IssuesList } from "./issues-list";
import { renderAdmin } from "./render-for-tests";

// The screens with sample reports, as SEC-13's backend will give them; the page itself has none yet.
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) =>
    createElement("a", { href: `/vi${href}`, ...rest }, children),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/admin/issues",
}));

function render(node: ReactNode) {
  return renderAdmin(node, { issues });
}

const rows: AdminIssueRow[] = [
  {
    id: "i-1042",
    code: "BL-1042",
    kind: "food_problem",
    status: "new",
    senderName: "Minh Anh",
    related: { kind: "order", id: "o-24817", code: "SB-24817" },
    handler: { id: "a-1", name: "Thu Hà" },
    updatedAt: "2026-10-20T12:42:00Z",
  },
  {
    id: "i-1038",
    code: "BL-1038",
    kind: "other",
    status: "new",
    senderName: "Xôi xéo Bà Tư",
    related: { kind: "seller", id: "s-7", name: "Xôi xéo Bà Tư" },
    updatedAt: "2026-10-20T10:47:00Z",
  },
];

describe("the problem reports' queue (AD-BL1)", () => {
  test("shows each report with its type, sender, order or store, handler and time", () => {
    const html = render(
      createElement(IssuesList, {
        query: readIssueQuery({}),
        rows,
        total: 12,
        counts: { new: 12, in_progress: 7, done: 128 },
        handlers: [{ id: "a-1", name: "Thu Hà" }],
      }),
    );
    expect(html).toContain("<h1");
    expect(html).toContain("Báo lỗi");
    expect(html).toContain("Mới");
    expect(html).toContain(">128<");
    expect(html).toContain('href="/vi/admin/issues/i-1042"');
    expect(html).toContain("Món có vấn đề");
    expect(html).toContain("Khác");
    expect(html).toContain("Đơn #SB-24817");
    expect(html).toContain('href="/vi/admin/orders/o-24817"');
    expect(html).toContain('href="/vi/admin/sellers/s-7"');
    expect(html).toContain("Thu Hà");
    expect(html).toContain("Chưa nhận");
    expect(html).toContain("20/10 · 19:42");
    expect(html).toContain("Hiển thị 1–10 trên 12 báo lỗi mới");
    expect(html).toContain("Thao tác với BL-1042");
    expect(html).not.toContain("Không có báo lỗi mới");
  });

  test("names the done time on the done tab and says when a tab is empty", () => {
    const html = render(
      createElement(IssuesList, {
        query: readIssueQuery({ tab: "done" }),
        rows: [],
        total: 0,
        handlers: [],
      }),
    );
    expect(html).toContain("Xong lúc");
    expect(html).toContain("Chưa có báo lỗi đã xong");
    expect(html).not.toContain("Hiển thị");
  });
});

const issue: AdminIssue = {
  id: "i-1042",
  code: "BL-1042",
  title: "Bánh su kem bị chảy, có mùi chua",
  kind: "food_problem",
  status: "in_progress",
  sender: { name: "Minh Anh", role: "customer" },
  body: "Mình nhận túi bánh su kem lúc 20:41 tại quầy Tiệm bánh Pháp.",
  photos: [
    { id: "p1", url: "/api/photos/p1/400.jpg" },
    { id: "p2", url: "/api/photos/p2/400.jpg" },
  ],
  messages: [
    {
      id: "m1",
      author: { name: "Minh Anh", role: "customer" },
      body: "Mình đã trả 35.000đ bằng VietQR tại quầy.",
      at: "2026-10-20T12:44:00Z",
      internal: false,
    },
    {
      id: "m2",
      author: { name: "Thu Hà", role: "admin" },
      body: "Mình đang hỏi lại Tiệm bánh Pháp.",
      at: "2026-10-20T12:55:00Z",
      internal: false,
    },
    {
      id: "m3",
      author: { name: "Thu Hà", role: "admin" },
      body: "Đề xuất hoàn đủ 35.000đ cho khách.",
      at: "2026-10-20T13:02:00Z",
      internal: true,
    },
  ],
  handler: { id: "a-1", name: "Thu Hà" },
  handlers: [{ id: "a-1", name: "Thu Hà" }],
  order: {
    id: "o-24817",
    code: "SB-24817",
    sellerId: "s-1",
    sellerName: "Tiệm bánh Pháp",
    item: "Bánh su kem, hộp 6 cái × 1",
    amountVnd: 35000,
    payment: { method: "vietqr", paid: true },
    collectedAt: "2026-10-20T13:41:00Z",
  },
};

describe("a problem report (AD-BL2)", () => {
  test("shows what was sent, the conversation with its internal note and the related order", () => {
    const html = render(createElement(IssueDetail, { issue }));
    expect(html).toContain("BL-1042 · Bánh su kem bị chảy, có mùi chua");
    expect(html).toContain("Đang xử lý");
    expect(html).toContain("Ảnh đính kèm · 2");
    expect(html).toContain('alt="Ảnh đính kèm 1"');
    expect(html).toContain("Minh Anh · Khách");
    expect(html).toContain("Thu Hà · Quản trị");
    expect(html).toContain("Chỉ admin thấy");
    expect(html).toContain("Ghi chú nội bộ · Thu Hà");
    expect(html).toContain("Viết trả lời cho Minh Anh…");
    expect(html).toContain("#SB-24817");
    expect(html).toContain("35.000đ");
    expect(html).toContain("VietQR tại quầy · đã trả");
    expect(html).toContain("20/10/2026 · 20:41");
    // Sending, giving the report to someone and refunding wait for their backend.
    expect(html.match(/title="Sắp có"/g)).toHaveLength(3);
  });
});
