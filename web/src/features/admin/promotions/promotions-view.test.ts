import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { type PromotionRow, promotionDefaults } from "./promotion";
import { blankPromotion } from "./promotion-form";
import { PromotionFields, PromotionSheet } from "./promotion-sheet";
import { PromotionsView } from "./promotions-view";
import { renderAdmin, textOf } from "../testing/render";

vi.mock("@/i18n/navigation", async () => (await import("../testing/render")).navigationMock);

// Sample codes, as Figma AD-MK1 draws them; the page itself has none until a backend keeps codes.
const rows: PromotionRow[] = [
  {
    id: "p1",
    code: "TASCO20",
    description: "Giảm 20% cho 100 khách đầu trên mini app Tasco",
    discount: { kind: "percent", percent: 20, capVnd: 30_000 },
    used: 63,
    limit: 100,
    startsAt: "2026-10-01T00:00:00+07:00",
    endsAt: "2026-10-31T23:59:00+07:00",
    stores: { kind: "all" },
    status: "running",
  },
  {
    id: "p2",
    code: "QUAY15K",
    description: "Giảm 15.000đ khi đổi tại quầy",
    discount: { kind: "amount", amountVnd: 15_000 },
    used: 41,
    limit: 200,
    startsAt: "2026-10-15T00:00:00+07:00",
    endsAt: "2026-11-15T23:59:00+07:00",
    stores: { kind: "some", count: 3 },
    status: "scheduled",
  },
  {
    id: "p3",
    code: "TRASUA5K",
    description: "Giảm 5.000đ trà sữa sau 20 giờ",
    discount: { kind: "amount", amountVnd: 5_000 },
    used: 30,
    limit: 60,
    startsAt: "2026-10-05T00:00:00+07:00",
    endsAt: "2026-10-25T23:59:00+07:00",
    stores: { kind: "some", count: 1 },
    status: "paused",
  },
];

describe("the promotions list", () => {
  it("shows each code with its discount, uses, period, stores and status", () => {
    const text = textOf(
      renderAdmin(
        createElement(PromotionsView, {
          list: { items: rows, total: 12, counts: { running: 4, scheduled: 2, inactive: 6 } },
          query: promotionDefaults,
          stores: [],
        }),
      ),
    );
    expect(text).toContain("Mã giảm giá");
    expect(text).toContain("Đang chạy 4");
    expect(text).toContain("Lên lịch 2");
    expect(text).toContain("Hết hạn · Tạm dừng 6");
    expect(text).toMatch(
      /TASCO20 Giảm 20% cho 100 khách đầu trên mini app Tasco 20% 63 \/ 100 01\/10 – 31\/10\/2026 Tất cả cửa hàng Đang chạy/,
    );
    expect(text).toMatch(
      /QUAY15K Giảm 15\.000đ khi đổi tại quầy 15\.000đ 41 \/ 200 15\/10 – 15\/11\/2026 3 cửa hàng Lên lịch/,
    );
    expect(text).toContain("1 cửa hàng Tạm dừng");
    expect(text).toContain("Hiển thị 1–10 trên 12 mã");
    expect(text).not.toContain("Chưa có mã giảm giá nào");
  });

  it("shows dashes on the cards and its empty state with no codes", () => {
    const empty = { list: { items: [], total: 0 }, stores: [] };
    const text = textOf(
      renderAdmin(createElement(PromotionsView, { ...empty, query: promotionDefaults })),
    );
    expect(text).toContain("Đang chạy —");
    expect(text).toContain("Chưa có mã giảm giá nào");
    expect(text).not.toContain("Hiển thị");

    const filtered = textOf(
      renderAdmin(
        createElement(PromotionsView, {
          ...empty,
          query: { ...promotionDefaults, status: "running" },
        }),
      ),
    );
    expect(filtered).toContain("Không có mã nào khớp bộ lọc");
  });

  it("marks the card of the status it is filtered by", () => {
    const html = renderAdmin(
      createElement(PromotionsView, {
        list: { items: [], total: 0 },
        query: { ...promotionDefaults, status: "scheduled" },
        stores: [],
      }),
    );
    expect(html).toMatch(/aria-current="true"[^>]*href="\/admin\?status=scheduled"/);
    expect(html).not.toMatch(/aria-current="true"[^>]*href="\/admin\?status=running"/);
  });
});

describe("the sheet that creates a code", () => {
  const form = blankPromotion(new Date("2026-10-20T12:00:00+07:00"), () => 0);
  const stores = [
    { id: "s1", name: "Tiệm bánh Pháp" },
    { id: "s2", name: "Trà sữa Mây" },
  ];

  it("holds the made-up code, the share with its cap, the uses, the run and the channel", () => {
    const html = renderAdmin(createElement(PromotionFields, { form, onChange: () => {}, stores }));
    const text = textOf(html);
    expect(html).toContain('value="TASCO-AAAA"');
    expect(text).toContain("Mã (tự sinh, có thể sửa) Tạo lại");
    expect(text).toContain("Phần trăm (%) Số tiền (đ)");
    expect(html).toContain('value="20"');
    expect(html).toContain('value="30000"');
    expect(html).toContain('value="2026-10-21T00:00"');
    expect(html).toMatch(
      /min="2026-10-21T00:00"[^>]*value="2026-11-19T23:59"|value="2026-11-19T23:59"[^>]*min="2026-10-21T00:00"/,
    );
    expect(text).toContain("Áp dụng cho tất cả cửa hàng");
    expect(text).not.toContain("Cửa hàng áp dụng");
    expect(text).toContain("Mini app Tasco Cả hai kênh Quầy Tasco Mall");
  });

  it("disables the cap for an amount and asks for stores when not for every store", () => {
    const html = renderAdmin(
      createElement(PromotionFields, {
        form: { ...form, kind: "amount", allStores: false },
        onChange: () => {},
        stores,
      }),
    );
    const text = textOf(html);
    expect(html).toContain('value="10000"');
    expect(html).toMatch(
      /<input[^>]*disabled=""[^>]*value="30000"|<input[^>]*value="30000"[^>]*disabled=""/,
    );
    expect(text).toContain("Cửa hàng áp dụng · 0 cửa hàng");
    expect(text).toContain("Cửa hàng: Chưa chọn");
    expect(text).toContain("Chọn ít nhất một cửa hàng");
  });

  it("is not rendered while closed", () => {
    const html = renderAdmin(
      createElement(PromotionSheet, {
        open: false,
        onOpenChange: () => {},
        editing: false,
        initial: form,
        stores,
      }),
    );
    expect(textOf(html)).not.toContain("Tạo mã giảm giá");
  });
});
