import { createElement, type ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";

import site from "../../../../messages/vi.json";
import { renderAdmin } from "../testing/render";
import { type AdminOfferRow, readOfferQuery } from "./offer";
import { OfferFacts } from "./offer-sheet";
import { OffersList } from "./offers-list";

// The list and the panel with sample posts, as an admin list of every store's posts will give them; the page
// itself has none yet.
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) =>
    createElement("a", { href: `/vi${href}`, ...rest }, children),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/admin/offers",
}));

function render(node: ReactNode) {
  return renderAdmin(node, { messages: { OfferKind: site.OfferKind } });
}

const comTam: AdminOfferRow = {
  id: "o-9",
  name: "Cơm tấm sườn bì chả",
  photoUrl: "/api/photos/p9/400.jpg",
  sellerId: "s-9",
  sellerName: "Cơm tấm Sài Gòn",
  kind: "prepared_food",
  priceVnd: 32000,
  originalPriceVnd: 55000,
  discountPercent: 42,
  units: 5,
  unitsLeft: 1,
  unitsHeld: 4,
  unit: "suất",
  weightGrams: 450,
  windowStart: "2026-10-20T13:00:00Z",
  windowEnd: "2026-10-20T14:00:00Z",
  description: "Cơm tấm sườn nướng, bì, chả trứng nấu trong ngày.",
  status: "on_sale",
  createdAt: "2026-10-20T11:20:00Z",
  postedBy: "chu.quan@example.com",
};

const pho: AdminOfferRow = {
  ...comTam,
  id: "o-6",
  name: "Phở bò tái, 2 suất",
  sellerName: "Phở bò Gánh",
  status: "removed",
};

describe("every post (AD-BD1)", () => {
  test("shows a card per status, then each post with its price, units, window and status", () => {
    const html = render(
      createElement(OffersList, {
        query: readOfferQuery({}),
        rows: [comTam, pho],
        total: 167,
        counts: { on_sale: 18, sold_out: 6, closed: 132, withdrawn: 9, removed: 2 },
        sellers: [{ id: "s-9", name: "Cơm tấm Sài Gòn" }],
      }),
    );
    expect(html).toContain("<h1");
    expect(html).toContain("Bài đăng");
    for (const card of ["Đang bán", "Hết hàng", "Đã đóng", "Đã gỡ", "Gỡ do vi phạm"]) {
      expect(html).toContain(card);
    }
    expect(html).toContain(">132<");
    expect(html).toContain("Cơm tấm sườn bì chả");
    expect(html).toContain('href="/vi/admin/offers?offer=o-9"');
    expect(html).toContain("32.000đ");
    expect(html).toContain("55.000đ");
    expect(html).toContain("1/5 suất");
    expect(html).toContain("20:00–21:00");
    expect(html).toContain("Thao tác với Phở bò tái, 2 suất");
    expect(html).toContain("Hiển thị 1–10 trên 167 bài đăng");
    expect(html).toContain("Ngày đăng:");
    expect(html).toContain("Mọi lúc");
  });

  test("shows a dash for a count the backend does not give, and says when there is no post", () => {
    const html = render(
      createElement(OffersList, { query: readOfferQuery({}), rows: [], total: 0, sellers: [] }),
    );
    expect(html.match(/>—</g)).toHaveLength(5);
    expect(html).toContain("Chưa có bài đăng nào");
  });
});

test("the panel shows what is left and held, the window, the weight and who posted (AD-BD2)", () => {
  const html = render(createElement(OfferFacts, { offer: comTam }));
  expect(html).toContain("Cơm tấm sườn bì chả");
  expect(html).toContain("-42%");
  expect(html).toContain("Món chín");
  expect(html).toContain("1/5 suất · 4 suất đang được giữ");
  expect(html).toContain("20:00–21:00, 20/10/2026");
  expect(html).toContain("Khối lượng mỗi suất");
  expect(html).toContain("450 g");
  expect(html).toContain("18:20, 20/10/2026 · chu.quan@example.com");
  expect(html).toContain("Cơm tấm sườn nướng");
});
