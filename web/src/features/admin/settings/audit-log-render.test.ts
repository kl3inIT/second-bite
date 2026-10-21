import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { navigationMock, renderAdmin, textOf } from "../testing/render";
import { type AuditEntry, auditDefaults } from "./audit-log";
import { AuditLogTable } from "./audit-log-table";

vi.mock("@/i18n/navigation", () => navigationMock);

const quantri = { id: "a1", label: "quantri@example.com" };

// Every action of the catalog once, newest first, as GET /admin/audit-events is expected to answer (SEC-75).
const entries: AuditEntry[] = [
  {
    id: "e8",
    occurredAt: "2026-10-21T03:05:00Z",
    actor: quantri,
    action: "store.block",
    resource: { type: "store", id: "s1", label: "Tiệm bánh Pháp" },
    detail: { reason: "bánh quá hạn sử dụng" },
    requestId: "7f3a2c91",
  },
  {
    id: "e7",
    occurredAt: "2026-10-21T02:58:00Z",
    actor: { id: "a4", label: "minhanh@example.com" },
    action: "store.reject",
    resource: { type: "store", id: "s2", label: "Chè Thái Phố Cổ" },
    detail: { reason: "ảnh chưa phải quầy" },
    requestId: "b21e07d4",
  },
  {
    id: "e6",
    occurredAt: "2026-10-21T02:40:00Z",
    actor: quantri,
    action: "admin.revoke",
    resource: { type: "admin", id: "a5", label: "vantoan@example.com" },
    requestId: "4c9d1a3f",
  },
  {
    id: "e5",
    occurredAt: "2026-10-20T09:30:00Z",
    actor: { id: "a6", label: "quocbao@example.com" },
    action: "store.approve",
    resource: { type: "store", id: "s3", label: "Cơm tấm Sài Gòn" },
    requestId: "e85b6f02",
  },
  {
    id: "e4",
    occurredAt: "2026-10-20T08:20:00Z",
    actor: quantri,
    action: "offer_settings.change",
    resource: { type: "offer_settings", id: "offer", label: null },
    detail: {
      changes: [
        { field: "minDiscountPercent", before: 20, after: 30 },
        { field: "windowMaxMinutes", before: 120, after: 180 },
      ],
    },
    requestId: "19a7c3e5",
  },
  {
    id: "e3",
    occurredAt: "2026-10-20T07:02:00Z",
    actor: { id: "a4", label: "minhanh@example.com" },
    action: "store.unblock",
    resource: { type: "store", id: "s4", label: "Xôi xéo Bà Tư" },
    requestId: "6d0f4b8a",
  },
  {
    id: "e2",
    occurredAt: "2026-10-20T04:15:00Z",
    actor: quantri,
    action: "email_settings.change",
    resource: { type: "email_settings", id: "email", label: null },
    detail: {
      changes: [
        { field: "senderName", before: "", after: "Second Bite" },
        { field: "smtpSecurity", before: "none", after: "starttls" },
        { field: "smtpPassword" },
      ],
    },
    requestId: "a3e9d217",
  },
  {
    id: "e1",
    occurredAt: "2026-10-15T01:30:00Z",
    actor: { id: "gone", label: null },
    action: "admin.grant",
    resource: { type: "admin", id: "a7", label: null },
    requestId: "5f2a7d1c",
  },
];

function renderLog(items: AuditEntry[], next: { occurredAt: string; id: string } | null = null) {
  return renderAdmin(createElement(AuditLogTable, { query: auditDefaults, page: { items, next } }));
}

describe("the audit log (AD-AL1)", () => {
  const html = renderLog(entries, { occurredAt: entries[7]!.occurredAt, id: "e1" });
  const text = textOf(html);

  it("shows each entry's time, who, action, subject, detail and request", () => {
    expect(text).toContain("Thời gian Người làm Hành động Đối tượng Chi tiết Mã yêu cầu");
    expect(text).toContain(
      "21/10/2026 10:05 quantri@example.com Chặn cửa hàng Tiệm bánh Pháp Lý do: bánh quá hạn sử dụng 7f3a2c91",
    );
    expect(text).toContain(
      "minhanh@example.com Từ chối cửa hàng Chè Thái Phố Cổ Lý do: ảnh chưa phải quầy",
    );
    expect(text).toContain("Thu hồi quyền vantoan@example.com — 4c9d1a3f");
    expect(text).toContain("Duyệt cửa hàng Cơm tấm Sài Gòn —");
    expect(text).toContain(
      "Sửa cài đặt Cài đặt bài đăng Giảm tối thiểu: 20% → 30% Khung nhận dài nhất: 120 phút → 180 phút",
    );
    expect(text).toContain("Gỡ chặn cửa hàng Xôi xéo Bà Tư");
    expect(text).toContain(
      "Sửa cài đặt Cài đặt email Tên người gửi: trống → Second Bite Bảo mật: Không mã hoá → STARTTLS Mật khẩu SMTP: đã đổi",
    );
  });

  it("names a deleted account, as actor or as subject, without a link", () => {
    expect(text).toContain("15/10/2026 08:30 Tài khoản đã xoá Cấp quyền Tài khoản đã xoá —");
    expect(html).not.toMatch(/<a [^>]*>Tài khoản đã xoá<\/a>/);
  });

  it("links each subject to its page", () => {
    expect(html).toContain('href="/admin/sellers/s1"');
    expect(html).toContain('href="/admin/settings/offers"');
    expect(html).toContain('href="/admin/settings/email"');
    expect(html).toMatch(/href="\/admin\/settings\/admins"[^>]*>vantoan@example.com</);
  });

  it("offers the next page while there is one", () => {
    expect(text).toContain("Tải thêm");
    expect(textOf(renderLog(entries))).not.toContain("Tải thêm");
  });

  it("has its filters, and is an empty state with nothing in it", () => {
    const empty = textOf(renderLog([]));
    expect(empty).toContain("Hành động: Tất cả");
    expect(empty).toContain("Ngày: Mọi lúc");
    expect(empty).toContain("Chưa có thao tác nào");
    expect(empty).not.toContain("Tải thêm");
  });

  it("names a filtered action", () => {
    const filtered = textOf(
      renderAdmin(
        createElement(AuditLogTable, {
          query: { ...auditDefaults, action: "admin.grant" },
          page: { items: [], next: null },
        }),
      ),
    );
    expect(filtered).toContain("Hành động: Cấp quyền quản trị");
  });
});
