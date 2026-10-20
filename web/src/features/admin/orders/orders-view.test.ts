import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { OrdersView } from "./orders-view";
import { renderAdmin, textOf } from "../testing/render";
import { sampleRows } from "./test-samples";

vi.mock("@/i18n/navigation", async () => {
  const { createElement: h } = await import("react");
  return {
    Link: ({ href, scroll: _scroll, ...props }: { href: string; scroll?: boolean }) =>
      h("a", { href, ...props }),
    useRouter: () => ({ push: () => {}, replace: () => {} }),
    usePathname: () => "/admin/orders",
  };
});

describe("the orders list (AD-DH1)", () => {
  it("shows the empty state and no figures without orders, as the page does until SEC-15", () => {
    const html = renderAdmin(createElement(OrdersView, { rows: [], status: "all" }));
    const text = textOf(html);
    expect(text).toContain("Chưa có đơn nào");
    expect(text).toContain("Đã nhận hôm nay —");
    expect(text).toContain("Khách không đến —");
    expect(text).not.toContain("Hiển thị");
  });

  it("draws the cards, the filter bar and a page of ten rows from sample orders", () => {
    const html = renderAdmin(
      createElement(OrdersView, {
        rows: sampleRows,
        summary: { collectedToday: 86, waiting: 23, noShow: 4 },
        status: "all",
      }),
    );
    const text = textOf(html);
    expect(text).toContain("Đã nhận hôm nay 86");
    expect(text).toContain("Đang chờ nhận 23");
    expect(html).toContain('placeholder="Tìm mã đơn, tên khách hoặc cửa hàng"');
    expect(text).toContain("Cửa hàng: Tất cả");
    expect(text).toContain("Ngày: Mọi lúc");
    // The latest pickup first: #SB-24820 picks up at 22:50, the last of the twelve; the first two wait on
    // page 2.
    expect(text.indexOf("#SB-24820")).toBeLessThan(text.indexOf("#SB-24821"));
    expect(text).not.toContain("#SB-24831");
    expect(html.match(/<tr/g)).toHaveLength(11);
    expect(text).toContain("Hiển thị 1–10 trên 12 đơn");
    expect(text).toContain("Trang 2");
    expect(html).toContain('aria-sort="descending"');
  });

  it("writes each row on one line: code, customer, store, items, total, window, state", () => {
    const html = renderAdmin(createElement(OrdersView, { rows: sampleRows, status: "waiting" }));
    const text = textOf(html);
    expect(text).toContain("#SB-24831 Minh Anh Tiệm bánh Pháp Croissant × 2, Bánh mì chà bông × 1");
    expect(text).toContain("30.000đ 21:00–22:00 Đã xác nhận");
    expect(html).toContain('href="/admin/orders/o-0"');
    expect(html).toContain('aria-label="Thao tác với #SB-24831"');
  });

  it("names every state with words and an icon", () => {
    const text = textOf(
      renderAdmin(createElement(OrdersView, { rows: sampleRows, status: "all" })),
    );
    for (const words of ["Đã xác nhận", "Sẵn sàng", "Đã nhận", "Hết hạn", "Đã huỷ", "Bị từ chối"]) {
      expect(text).toContain(words);
    }
  });

  it("starts the search from the address and keeps it in the cards' links", () => {
    const html = renderAdmin(
      createElement(OrdersView, {
        rows: sampleRows,
        status: "all",
        search: "khach3@example.com",
      }),
    );
    expect(html).toContain('value="khach3@example.com"');
    expect(textOf(html)).toContain("Hiển thị 1–1 trên 1 đơn");
    expect(html).toContain('href="/admin/orders?status=expired&amp;q=khach3%40example.com"');
  });

  it("filters by the card the address names, and marks that card", () => {
    const html = renderAdmin(createElement(OrdersView, { rows: sampleRows, status: "expired" }));
    expect(textOf(html)).toContain("Hiển thị 1–2 trên 2 đơn");
    expect(html).toMatch(/<a[^>]*href="\/admin\/orders"[^>]*aria-current="true"/);
    expect(html).toContain('href="/admin/orders?status=collected"');
  });
});
