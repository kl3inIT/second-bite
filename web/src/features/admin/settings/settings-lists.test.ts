import { createElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { AreasTable } from "./areas-table";
import { CategoriesTable } from "./categories-table";
import { Integrations } from "./integrations";
import { LegalDocuments } from "./legal-documents";
import { renderAdmin, textOf } from "../testing/render";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, ...props }: { href: string }) => createElement("a", { href, ...props }),
  usePathname: () => "/admin/settings",
  useRouter: () => ({ push: () => undefined, replace: () => undefined, refresh: () => undefined }),
}));
// A tooltip renders only once its trigger is pointed at; here its words are drawn after what it explains.
vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children?: ReactNode }) => children,
  TooltipTrigger: ({ children }: { children?: ReactNode }) => children,
  TooltipContent: ({ children }: { children?: ReactNode }) =>
    createElement("span", { role: "tooltip" }, children),
}));

// The settings pages whose backend does not exist yet are empty in the browser; here they are filled with sample
// rows, so their columns, badges and words are checked (admin-qa › Cách test màn chưa có backend).

/** A settings list's HTML, its relative days counted from 20/10/2026, 10:00 in Vietnam. */
function renderSettings(element: ReactElement) {
  return renderAdmin(element, { now: new Date("2026-10-20T03:00:00Z") });
}

describe("the categories (AD-CD1)", () => {
  const rows = [
    { id: "c2", name: "Bánh mì", parentId: "c1", postsOnSale: 18, visible: true },
    { id: "c1", name: "Bánh", icon: "bakery" as const, postsOnSale: 46, visible: true },
    {
      id: "c3",
      name: "Nguyên liệu",
      icon: "ingredients" as const,
      postsOnSale: 0,
      visible: false,
      opening: true,
    },
  ];

  it("show each group over its categories, with posts and whether customers see them", () => {
    const text = textOf(renderSettings(createElement(CategoriesTable, { rows })));
    expect(text).toContain("Danh mục Bài đang đăng Hiển thị cho khách");
    expect(text.indexOf("Bánh 46 bài")).toBeLessThan(text.indexOf("Bánh mì 18 bài"));
    expect(text).toContain("Nguyên liệu Sắp mở 0 bài");
    expect(text).toContain("Đang hiện");
    expect(text).toContain("Đang ẩn");
  });

  it("cannot be switched or changed until there is a backend", () => {
    const html = renderSettings(createElement(CategoriesTable, { rows }));
    expect(html).toContain('aria-label="Hiển thị Bánh cho khách"');
    expect(html).toMatch(/Đang hiện<\/span><\/span><span role="tooltip">Sắp có<\/span>/);
    expect(html).toMatch(
      /role="switch"[^>]*aria-disabled="true"|aria-disabled="true"[^>]*role="switch"/,
    );
  });

  it("are an empty state with no rows", () => {
    expect(textOf(renderSettings(createElement(CategoriesTable, { rows: [] })))).toContain(
      "Chưa có danh mục nào",
    );
  });
});

describe("the areas (AD-CD2)", () => {
  it("show the mall over its floors, the stores in each and whether it takes new ones", () => {
    const text = textOf(
      renderSettings(
        createElement(AreasTable, {
          rows: [
            { id: "m", name: "Tasco Mall Việt Hưng", sellers: 10, open: true },
            { id: "f2", name: "Tầng 2 · thời trang", parentId: "m", sellers: 1, open: false },
          ],
        }),
      ),
    );
    expect(text).toContain("Khu vực / tầng Cửa hàng tham gia Nhận cửa hàng mới");
    expect(text).toContain("Tasco Mall Việt Hưng 10 cửa hàng Đang mở");
    expect(text).toContain("Tầng 2 · thời trang 1 cửa hàng Tạm dừng");
  });
});

describe("the legal content (AD-CD6)", () => {
  it("lists each version with the day it takes effect and whether it applies, then the draft", () => {
    const html = renderSettings(
      createElement(LegalDocuments, {
        documents: [
          {
            id: "d1",
            kind: "terms" as const,
            version: "1.2",
            effectiveFrom: "2026-09-01",
            status: "active" as const,
          },
          {
            id: "d2",
            kind: "privacy" as const,
            version: "1.0",
            effectiveFrom: "2026-07-15",
            status: "replaced" as const,
          },
          { id: "d3", kind: "sellerRules" as const, version: "1.1", status: "draft" as const },
        ],
        draft: {
          kind: "terms" as const,
          version: "1.3",
          body: "1. Phạm vi áp dụng",
          effectiveFrom: "2026-11-01",
          savedAt: "2026-10-20T02:30:00Z",
          reconsent: true,
        },
      }),
    );
    const text = textOf(html);
    expect(text).toContain("Điều khoản sử dụng 1.2 01/09/2026 Đang áp dụng");
    expect(text).toContain("Chính sách bảo mật 1.0 15/07/2026 Đã thay thế");
    expect(text).toContain("Quy định cho cửa hàng 1.1 Chưa đặt Bản nháp");
    expect(text).toContain("Soạn thảo · Điều khoản sử dụng 1.3 Đã lưu nháp lúc 09:30");
    expect(html).toContain("1. Phạm vi áp dụng");
    expect(html).toContain('value="2026-11-01"');
    expect(text).toContain("Yêu cầu đồng ý lại");
    // Neither kept nor published until there is a backend.
    expect(html).toMatch(/disabled=""[^>]*>Xuất bản<\/button><span role="tooltip">Sắp có<\/span>/);
  });
});

describe("the integrations (AD-CD7)", () => {
  it("read whether email is connected from its settings, and open them", () => {
    const html = renderSettings(
      createElement(Integrations, {
        email: {
          provider: "smtp" as const,
          senderAddress: "noreply@example.com",
          senderName: "Second Bite",
          smtpHost: "smtp.example.com",
          smtpPort: 587,
          smtpSecurity: "starttls" as const,
          smtpUsername: "mailer@example.com",
          smtpPasswordSet: true,
          brevoApiKeySet: false,
          updatedAt: "2026-10-19T07:20:00Z",
        },
      }),
    );
    const text = textOf(html);
    expect(text).toContain("Brevo / SMTP Đã kết nối Mật khẩu SMTP");
    expect(html).toContain('placeholder="Đã lưu · để trống để giữ nguyên"');
    expect(html).toContain('href="/admin/settings/email"');
    expect(text).toContain("SePay (VietQR) Chưa kết nối");
    expect(text).toContain("Mini app Tasco Chưa kết nối");
    expect(text).toContain("Webhook Chưa kết nối");
  });

  it("show email as not connected when nothing is saved", () => {
    const text = textOf(renderSettings(createElement(Integrations, { email: null })));
    expect(text).toContain("Brevo / SMTP Chưa kết nối");
    expect(text).not.toContain("Ngắt kết nối");
  });
});
