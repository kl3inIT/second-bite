import { createElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import type { AccountBody } from "@/lib/api/generated";

import { navigationMock, renderAdmin, textOf } from "../testing/render";
import { AddAdmin } from "./add-admin";
import { AdminsTable } from "./admins-table";
import { RevokeAdminDialog } from "./revoke-admin-dialog";

vi.mock("@/i18n/navigation", () => navigationMock);

type Children = { children?: ReactNode };
const { passThrough } = vi.hoisted(() => ({
  passThrough: ({ children }: { children?: ReactNode }) => children,
}));

// A dialog renders in a portal, a menu and a tooltip only once opened, none of them on the server; here the shared
// primitives are drawn open as plain HTML, so the dialogs' words and fields and the menus' locked actions with
// their reasons are checked.
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ open, children }: Children & { open: boolean }) =>
    createElement("section", { "data-dialog": open ? "open" : "closed" }, children),
  DialogContent: passThrough,
  DialogHeader: passThrough,
  DialogFooter: passThrough,
  DialogTitle: ({ children }: Children) => createElement("h2", null, children),
  DialogClose: ({ children }: Children) => createElement("button", { type: "button" }, children),
}));
vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ open, children }: Children & { open: boolean }) =>
    createElement("section", { "data-dialog": open ? "open" : "closed" }, children),
  AlertDialogContent: passThrough,
  AlertDialogHeader: passThrough,
  AlertDialogFooter: passThrough,
  AlertDialogTitle: ({ children }: Children) => createElement("h2", null, children),
  AlertDialogDescription: ({ children }: Children) => createElement("div", null, children),
  AlertDialogCancel: ({ children }: Children) => createElement("button", null, children),
  AlertDialogAction: ({ children, disabled }: Children & { disabled?: boolean }) =>
    createElement("button", { disabled }, children),
}));
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: Children) => createElement("menu", null, children),
  DropdownMenuTrigger: ({ render }: { render: ReactElement<{ "aria-label"?: string }> }) =>
    createElement("button", { "aria-label": render.props["aria-label"] }),
  DropdownMenuContent: passThrough,
  DropdownMenuGroup: passThrough,
  DropdownMenuItem: ({ children, disabled }: Children & { disabled?: boolean }) =>
    createElement("li", { "aria-disabled": disabled ? "true" : "false" }, children),
}));
vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: passThrough,
  TooltipTrigger: passThrough,
  TooltipContent: ({ children }: Children) => createElement("span", { role: "tooltip" }, children),
}));

/** A row's ⋯ menu as plain HTML: its button's name, then its items, an item's icon left out. */
function menuOf(html: string, email: string): string {
  const start = html.indexOf(`<menu><button aria-label="Thao tác với ${email}"></button>`);
  const menu = html.slice(start, html.indexOf("</menu>", start) + "</menu>".length);
  return start < 0 ? "" : menu.replace(/<svg[^>]*>.*?<\/svg>/g, "");
}
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
    expect(menuOf(html, "quantri@example.com")).toBe(
      '<menu><button aria-label="Thao tác với quantri@example.com"></button><li aria-disabled="true">Thu hồi quyền</li><span role="tooltip">Không thể thu hồi quyền của chính bạn</span></menu>',
    );
    expect(menuOf(html, "ngocmai@example.com")).toBe(
      '<menu><button aria-label="Thao tác với ngocmai@example.com"></button><li aria-disabled="false">Thu hồi quyền</li></menu>',
    );
    expect(menuOf(html, "gialinh@example.com")).toBe(
      '<menu><button aria-label="Thao tác với gialinh@example.com"></button><li aria-disabled="false">Thu hồi quyền</li></menu>',
    );
  });

  it("lock revoking the last admin", () => {
    const html = renderAdmin(createElement(AdminsTable, { rows: rows.slice(2) }));
    expect(menuOf(html, "gialinh@example.com")).toBe(
      '<menu><button aria-label="Thao tác với gialinh@example.com"></button><li aria-disabled="true">Thu hồi quyền</li><span role="tooltip">Phải còn ít nhất một quản trị viên</span></menu>',
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
    expect(html).toMatch(
      /<button(?=[^>]*type="submit")(?=[^>]*disabled="")[^>]*>Thêm quản trị viên<\/button>/,
    );
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
