import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { renderAdmin, textOf } from "../testing/render";
import { clickRateText, sponsorDefaults, sponsorQueryOf, type SponsorRow } from "./sponsor";
import { SponsorsView } from "./sponsors-view";

vi.mock("@/i18n/navigation", async () => (await import("../testing/render")).navigationMock);

// Sample places, as Figma AD-MK7 draws them; the page itself has none until a backend sells places.
const rows: SponsorRow[] = [
  {
    id: "sp1",
    name: "Tiệm bánh Pháp",
    kind: "featuredStore",
    sellerId: "s1",
    placement: "homeTop",
    startsAt: "2026-10-15T00:00:00+07:00",
    endsAt: "2026-10-31T23:59:00+07:00",
    impressions: 8420,
    clickRate: 0.038,
    status: "running",
  },
  {
    id: "sp2",
    name: "Nhà hảo tâm ẩn danh",
    kind: "sponsor",
    placement: "collection",
    startsAt: "2026-11-01T00:00:00+07:00",
    endsAt: "2026-11-30T23:59:00+07:00",
    impressions: null,
    clickRate: null,
    status: "scheduled",
  },
  {
    id: "sp3",
    name: "CLB Ẩm thực Việt Hưng",
    kind: "sponsor",
    placement: "homeBanner",
    startsAt: "2026-09-01T00:00:00+07:00",
    endsAt: "2026-09-30T23:59:00+07:00",
    impressions: 18050,
    clickRate: 0.019,
    status: "ended",
  },
];

describe("the sponsors list's logic", () => {
  it("reads its filters from the address and writes a click rate to a tenth", () => {
    expect(sponsorQueryOf({})).toEqual(sponsorDefaults);
    expect(
      sponsorQueryOf({ kind: "sponsor", placement: "homeTop", status: "inactive" }),
    ).toMatchObject({
      kind: "sponsor",
      placement: "homeTop",
      status: "inactive",
    });
    expect(sponsorQueryOf({ kind: "ad", placement: "footer" })).toEqual(sponsorDefaults);
    expect(clickRateText(0.038, "vi")).toBe("3,8%");
    expect(clickRateText(0.021, "en")).toBe("2.1%");
  });
});

describe("the sponsors list", () => {
  it("lists each place with its kind, placement, run, reach and status", () => {
    const html = renderAdmin(
      createElement(SponsorsView, {
        list: { items: rows, total: 14, counts: { running: 4, scheduled: 2, inactive: 8 } },
        query: sponsorDefaults,
      }),
    );
    const text = textOf(html);
    expect(text).toContain("Tài trợ Sắp có Thêm tài trợ");
    expect(text).toContain("Đang chạy 4 Lên lịch 2 Hết hạn · Tạm dừng 8");
    expect(text).toContain(
      "Tiệm bánh Pháp Cửa hàng được đẩy Trang chủ · đầu trang 15/10 – 31/10/2026 8.420 3,8% Đang chạy",
    );
    expect(text).toContain(
      "Nhà hảo tâm ẩn danh Nhà tài trợ Bộ sưu tập 01/11 – 30/11/2026 — — Lên lịch",
    );
    expect(text).toContain(
      "CLB Ẩm thực Việt Hưng Nhà tài trợ Trang chủ · banner 01/09 – 30/09/2026 18.050 1,9% Hết hạn",
    );
    expect(text).toContain("Hiển thị 1–10 trên 14 vị trí");
    expect(html).toContain('href="/admin/sellers/s1"');
  });

  it("shows dashes on the cards and its empty state with no places", () => {
    const text = textOf(
      renderAdmin(
        createElement(SponsorsView, { list: { items: [], total: 0 }, query: sponsorDefaults }),
      ),
    );
    expect(text).toContain("Đang chạy —");
    expect(text).toContain("Chưa có vị trí tài trợ nào");
  });
});
