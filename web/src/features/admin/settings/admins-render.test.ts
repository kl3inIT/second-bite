import { createElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import type { AccountBody } from "@/lib/api/generated";

import { navigationMock, renderAdmin, textOf } from "../testing/render";
import type { RowAction } from "../ui/row-action-menu";
import { AddAdmin } from "./add-admin";
import { AdminsTable } from "./admins-table";
import { RevokeAdminDialog } from "./revoke-admin-dialog";

vi.mock("@/i18n/navigation", () => navigationMock);

// A dialog renders in a portal and a menu only once opened, neither on the server; here both are drawn open as
// plain HTML, so their words, fields and locked actions are checked.
vi.mock("../ui/confirm-dialog", async (original) => ({
  ...(await original<Record<string, unknown>>()),
  ConfirmDialog: ({
    open,
    title,
    confirmLabel,
    confirmDisabled,
    confirmTitle,
    children,
    form,
  }: {
    open: boolean;
    title: string;
    confirmLabel: string;
    confirmDisabled?: boolean;
    confirmTitle?: string;
    children?: ReactNode;
    form?: ReactNode;
  }) =>
    createElement(
      "section",
      { "data-dialog": open ? "open" : "closed" },
      createElement("h2", null, title),
      children,
      form,
      createElement("button", { disabled: confirmDisabled, title: confirmTitle }, confirmLabel),
    ),
}));
vi.mock("../ui/row-action-menu", () => ({
  RowActionMenu: ({ name, actions }: { name: string; actions: RowAction[] }) =>
    createElement(
      "menu",
      { "aria-label": name },
      actions.map((action) =>
        createElement(
          "li",
          { key: action.label, "aria-disabled": action.disabled, title: action.title },
          action.label,
        ),
      ),
    ),
}));

const rows: AccountBody[] = [
  { id: "a1", email: "quantri@example.com", displayName: "", role: "admin" },
  { id: "a2", email: "ngocmai@example.com", displayName: "Ngọc Mai", role: "admin" },
  { id: "a3", email: "gialinh@example.com", displayName: "", role: "admin" },
];

describe("the admins (AD-AM1, AD-AM4)", () => {
  it("show each address with its initials, the viewer's marked", () => {
    const text = textOf(
      renderAdmin(createElement(AdminsTable, { rows, viewerEmail: "quantri@example.com" })),
    );
    expect(text).toContain("QU quantri@example.com (bạn)");
    expect(text).toContain("NG ngocmai@example.com");
    expect(text).toContain("GI gialinh@example.com");
  });

  it("lock revoking the viewer, and let them revoke the others", () => {
    const html = renderAdmin(
      createElement(AdminsTable, { rows, viewerEmail: "quantri@example.com" }),
    );
    expect(html).toContain(
      '<menu aria-label="quantri@example.com"><li aria-disabled="true" title="Không thể thu hồi quyền của chính bạn">Thu hồi quyền</li></menu>',
    );
    expect(html).toContain(
      '<menu aria-label="ngocmai@example.com"><li aria-disabled="false">Thu hồi quyền</li></menu>',
    );
    expect(html).toContain(
      '<menu aria-label="gialinh@example.com"><li aria-disabled="false">Thu hồi quyền</li></menu>',
    );
  });

  it("lock revoking the last admin", () => {
    const html = renderAdmin(createElement(AdminsTable, { rows: rows.slice(2) }));
    expect(html).toContain(
      '<menu aria-label="gialinh@example.com"><li aria-disabled="true" title="Phải còn ít nhất một quản trị viên">Thu hồi quyền</li></menu>',
    );
  });

  it("are an empty state with none", () => {
    expect(textOf(renderAdmin(createElement(AdminsTable, { rows: [] })))).toContain(
      "Chưa có quản trị viên nào",
    );
  });
});

describe("adding an admin (AD-AM2)", () => {
  it("asks for one email, and cannot be sent while it is empty", () => {
    const html = renderAdmin(createElement(AddAdmin, { admins: rows }));
    const text = textOf(html);
    expect(text).toContain("Thêm quản trị viên Thêm quản trị viên Email");
    expect(html).toContain('type="email"');
    expect(text).toContain("Email này phải đã đăng nhập bằng mã ít nhất một lần.");
    expect(html).toMatch(/<button disabled="">Thêm quản trị viên<\/button>/);
  });
});

describe("revoking an admin (AD-AM3)", () => {
  it("says what follows", () => {
    const html = renderAdmin(
      createElement(RevokeAdminDialog, {
        admin: { id: "a9", email: "vantoan@example.com" },
        open: true,
        onOpenChange: () => undefined,
      }),
    );
    const text = textOf(html);
    expect(text).toContain("Thu hồi quyền quản trị? Khi thu hồi:");
    expect(text).toContain(
      "vantoan@example.com không dùng được trang quản trị ngay từ thao tác tiếp theo.",
    );
    expect(text).toContain("Thao tác được ghi vào Nhật ký thao tác.");
    expect(text).toContain("Có thể cấp lại quyền bất cứ lúc nào.");
    expect(html).toMatch(/<button>Thu hồi quyền<\/button>/);
  });
});
