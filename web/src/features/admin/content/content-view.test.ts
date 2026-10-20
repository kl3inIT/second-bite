import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { renderAdmin, textOf } from "../testing/render";
import {
  type BannerRow,
  bannerFormOf,
  bannerProblems,
  bannersIn,
  blankBanner,
  placementCounts,
  placementOf,
  positionsIn,
  withBannerEnd,
  withBannerStart,
} from "./banner";
import { BannerFields, BannerPreview } from "./banner-editor";
import { ContentView } from "./content-view";

vi.mock("@/i18n/navigation", async () => (await import("../testing/render")).navigationMock);

// Sample banners and collections, as Figma AD-MK3 draws them; the page itself has none until a backend keeps them.
const banner = (
  id: string,
  position: number,
  title: string,
  extra: Partial<BannerRow> = {},
): BannerRow => ({
  id,
  title,
  subtitle: "Giảm đến 50% sau 19:00",
  placement: "home",
  position,
  status: "running",
  startsAt: "2026-10-20T06:00:00+07:00",
  endsAt: "2026-10-31T23:00:00+07:00",
  visible: true,
  link: { kind: "collection", target: "c1" },
  ...extra,
});

const banners = [
  banner("b2", 2, "Món ngon mỗi ngày"),
  banner("b1", 1, "Ưu đãi cuối ngày"),
  banner("b4", 4, "Cuối tuần vui ở Tasco Mall", { status: "scheduled" }),
  banner("b3", 3, "Mã TASCO20 cho 100 khách đầu"),
  banner("s1", 1, "Đồ uống sau 20 giờ", { placement: "search" }),
];
const collections = [
  { id: "c1", name: "Món ngon cuối ngày" },
  { id: "c2", name: "Cơm trưa còn suất" },
];

describe("the banners and their places", () => {
  it("reads the place from the address and lists its banners in order", () => {
    expect(placementOf({ placement: "search" })).toBe("search");
    expect(placementOf({ placement: "nowhere" })).toBe("home");
    expect(bannersIn(banners, "home").map((b) => b.id)).toEqual(["b1", "b2", "b3", "b4"]);
    expect(placementCounts(banners)).toEqual({ home: 4, search: 1, orders: 0 });
  });

  it("offers the places after the banners there, or any of theirs for one already there", () => {
    expect(positionsIn(banners, "home")).toEqual([1, 2, 3, 4, 5]);
    expect(positionsIn(banners, "home", "b1")).toEqual([1, 2, 3, 4]);
    expect(positionsIn(banners, "orders")).toEqual([1]);
  });

  it("keeps the end after the start and asks for a title and a link", () => {
    const form = blankBanner(new Date("2026-10-20T12:00:00+07:00"));
    expect(form.startsAt).toBe("2026-10-21T06:00");
    expect(form.endsAt).toBe("2026-10-31T23:00");
    expect(withBannerStart(form, "2026-11-05T06:00").endsAt).toBe("2026-11-05T06:00");
    expect(withBannerEnd(form, "2026-10-01T00:00").endsAt).toBe(form.startsAt);
    expect(bannerProblems(form)).toEqual(["title", "link"]);
    expect(
      bannerProblems({ ...form, title: "Ưu đãi", linkKind: "url", linkTarget: "tasco" }),
    ).toEqual(["link"]);
    expect(
      bannerProblems({
        ...form,
        title: "Ưu đãi",
        linkKind: "url",
        linkTarget: "https://example.com",
      }),
    ).toEqual([]);
    expect(bannerFormOf(banners[1])).toMatchObject({
      title: "Ưu đãi cuối ngày",
      startsAt: "2026-10-20T06:00",
      linkKind: "collection",
      linkTarget: "c1",
    });
  });
});

describe("the banners page", () => {
  it("shows the place's banners in order with their status, and the collections", () => {
    const text = textOf(
      renderAdmin(
        createElement(ContentView, { content: { banners, collections }, placement: "home" }),
      ),
    );
    expect(text).toContain("Trang chủ · 4 Tìm kiếm · 1 Trang đơn · 0");
    expect(text).toContain("Banner trang chủ");
    expect(text).toMatch(
      /1 · Ưu đãi cuối ngày Đang chạy .*2 · Món ngon mỗi ngày Đang chạy .*3 · Mã TASCO20 cho 100 khách đầu Đang chạy .*4 · Cuối tuần vui ở Tasco Mall Lên lịch/,
    );
    expect(text).not.toContain("Đồ uống sau 20 giờ");
    expect(text).toContain("Món ngon cuối ngày Cơm trưa còn suất");
    expect(text).toContain("Thêm bộ sưu tập");
  });

  it("shows each card's empty state with nothing kept", () => {
    const text = textOf(
      renderAdmin(
        createElement(ContentView, {
          content: { banners: [], collections: [] },
          placement: "orders",
        }),
      ),
    );
    expect(text).toContain("Banner trang đơn");
    expect(text).toContain("Chưa có banner nào ở trang đơn");
    expect(text).toContain("Chưa có bộ sưu tập nào");
  });
});

describe("the banner editor", () => {
  it("holds a banner's values and draws it on the phone", () => {
    const form = bannerFormOf(banners[1]);
    const html = renderAdmin(
      createElement(BannerFields, {
        form,
        onChange: () => {},
        positions: (placement) => positionsIn(banners, placement, "b1"),
        collections,
        stores: [],
      }),
    );
    const text = textOf(html);
    expect(html).toContain('value="Ưu đãi cuối ngày"');
    expect(html).toContain('maxLength="40"');
    expect(text).toContain("Vị trí: Trang chủ · vị trí 1");
    expect(text).toContain("Cửa hàng Bộ sưu tập URL");
    expect(text).toContain("Bộ sưu tập: Món ngon cuối ngày");
    expect(html).toContain('value="2026-10-20T06:00"');
    expect(text).toContain("Hiển thị trên app trong thời gian đã hẹn");

    const preview = textOf(renderAdmin(createElement(BannerPreview, { form })));
    expect(preview).toContain("Ưu đãi cuối ngày Giảm đến 50% sau 19:00");
    expect(preview).toContain("Gần bạn ở Tasco Mall");
  });
});
