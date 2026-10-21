import { createElement } from "react";
import { describe, expect, test, vi } from "vitest";

import type { OfferBody } from "@/lib/api/generated";

import { navigationMock, renderAdmin, textOf } from "../testing/render";
import { DuplicateAlert } from "./duplicate-alert";
import type { AdminMember } from "./member";
import { ReasonBody } from "./reason-dialog";
import { useSellerActions } from "./seller-actions";
import { SellerHeader } from "./seller-header";
import { type AdminSeller, defaultQuery } from "./seller-list";
import { SellerOverview } from "./seller-overview";
import { SellersList } from "./sellers-list";

// Reviewing a store (SEC-64, SEC-65, Figma AD-DS1 to AD-DS7), behind the `storeReview` flag, set here through the
// components' `review` prop: the screens with sample stores. Dialogs are portals, which do not render on the
// server, so their bodies are rendered on their own. Each part is also rendered with the flag off.
vi.mock("@/i18n/navigation", () => ({
  ...navigationMock,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));
vi.mock("next/navigation", async (original) => ({
  ...(await original<Record<string, unknown>>()),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/vi/admin/sellers",
}));

function store(name: string, status: AdminSeller["status"], id = `se-${name}`): AdminSeller {
  return {
    id,
    name,
    address: "Tầng 3, khu ẩm thực, Tasco Mall",
    phone: "0900 000 121",
    latitude: 21.05,
    longitude: 105.89,
    status,
    createdAt: "2026-10-20T09:00:00+07:00",
    updatedAt: "2026-10-20T09:00:00+07:00",
  };
}

const owner: AdminMember = {
  accountId: "acc-1",
  email: "chu.chethai@example.com",
  role: "owner",
  addedAt: "2026-10-20T02:00:00Z",
};
const staff: AdminMember = {
  ...owner,
  accountId: "acc-2",
  email: "nhan.vien@example.com",
  role: "staff",
};
const offers: OfferBody[] = [];
const counts = { active: 34, pending: 4, rejected: 1, blocked: 2 };
const pendingQuery = { ...defaultQuery, status: "pending" as const };

/** The words of each card, in order: "Chờ duyệt 4". */
function cardsOf(html: string): string[] {
  return [...html.matchAll(/<li><a[^>]*>(.*?)<\/a><\/li>/g)].map(([, card]) => textOf(card));
}

describe("the stores list", () => {
  test("keeps its three cards and opens on the active stores while the flag is off", () => {
    const html = renderAdmin(
      createElement(SellersList, {
        query: defaultQuery,
        rows: [store("Chè Thái", "active")],
        total: 1,
        counts,
        review: false,
      }),
    );
    expect(cardsOf(html)).toEqual(["Đang hoạt động 34", "Chờ duyệt 4", "Bị chặn 2"]);
    expect(html).toMatch(/<a[^>]*aria-current="true"[^>]*>.*?Đang hoạt động/);
    expect(textOf(html)).not.toContain("Bị từ chối");
  });

  test("opens on the pending queue with a fourth card for the rejected stores (AD-DS1)", () => {
    const html = renderAdmin(
      createElement(SellersList, {
        query: pendingQuery,
        rows: [store("Chè Thái Phố Cổ", "pending"), store("Phở bò Gánh", "pending")],
        total: 2,
        counts,
        review: true,
      }),
    );
    expect(cardsOf(html)).toEqual([
      "Chờ duyệt 4",
      "Đang hoạt động 34",
      "Bị từ chối 1",
      "Bị chặn 2",
    ]);
    expect(html).toMatch(/<a[^>]*aria-current="true"[^>]*>.*?Chờ duyệt/);
    expect(html).toContain('href="/admin/sellers?status=rejected"');
    expect(html).toContain('href="/admin/sellers"');
    expect(textOf(html)).toContain("Chè Thái Phố Cổ");
    expect(textOf(html)).toContain("Hiển thị 1–2 trên 2 cửa hàng");
  });

  test("says the pending queue is empty", () => {
    const html = renderAdmin(
      createElement(SellersList, { query: pendingQuery, rows: [], total: 0, counts, review: true }),
    );
    expect(textOf(html)).toContain("Không có cửa hàng nào chờ duyệt.");
  });

  test("numbers the pages from the backend's total (AD-TT1)", () => {
    const html = renderAdmin(
      createElement(SellersList, {
        query: { ...pendingQuery, page: 2 },
        rows: [store("Phở bò Gánh", "pending")],
        total: 11,
        counts,
        review: true,
      }),
    );
    expect(textOf(html)).toContain("Hiển thị 11–11 trên 11 cửa hàng");
  });
});

// The actions a store offers in its ⋯ menu, as words: the menu itself is a portal.
function MenuOf({
  seller,
  review,
  ownerless,
}: {
  seller: AdminSeller;
  review: boolean;
  ownerless?: boolean;
}) {
  const actions = useSellerActions({ review });
  return actions
    .actionsFor(seller, { ownerless })
    .map((action) => `${action.menuLabel}${action.refusal ? ` (${action.refusal})` : ""}`)
    .join(" | ");
}

function menu(seller: AdminSeller, review: boolean, ownerless?: boolean) {
  return textOf(renderAdmin(createElement(MenuOf, { seller, review, ownerless })));
}

describe("a store's actions", () => {
  test("approve or reject a pending store, approve a rejected one (AD-DS1, AD-DS5)", () => {
    expect(menu(store("Chè Thái", "pending"), true)).toBe("Duyệt | Từ chối…");
    expect(menu(store("Chè Thái", "rejected"), true)).toBe("Duyệt");
    expect(menu(store("Chè Thái", "active"), true)).toBe("Chặn cửa hàng…");
  });

  test("refuse to bring back a store with no owner left (AD-DS6)", () => {
    expect(menu(store("Chè Thái Lan", "blocked"), true, true)).toBe(
      "Gỡ chặn (Cửa hàng không còn chủ)",
    );
    expect(menu(store("Chè Thái Lan", "blocked"), true, false)).toBe("Gỡ chặn");
  });

  test("stay as today while the flag is off", () => {
    expect(menu(store("Chè Thái", "pending"), false)).toBe("Duyệt");
    expect(menu(store("Chè Thái Lan", "blocked"), false, true)).toBe("Gỡ chặn");
  });
});

describe("a store's header", () => {
  test("shows 'Từ chối' in a red edge then 'Duyệt' for a pending store (AD-DS2)", () => {
    const html = renderAdmin(
      createElement(SellerHeader, {
        seller: store("Chè Thái Phố Cổ", "pending"),
        cover: [],
        review: true,
      }),
    );
    const text = textOf(html);
    expect(text).toContain("Chờ duyệt");
    expect(text.indexOf("Từ chối")).toBeGreaterThan(-1);
    expect(text.indexOf("Từ chối")).toBeLessThan(text.indexOf("Duyệt"));
  });

  test("names a rejected store's status 'Bị từ chối' and offers 'Duyệt' (AD-DS5)", () => {
    const text = textOf(
      renderAdmin(
        createElement(SellerHeader, {
          seller: store("Chè Thái Phố Cổ", "rejected"),
          cover: [],
          review: true,
        }),
      ),
    );
    expect(text).toContain("Bị từ chối");
    expect(text).toContain("Duyệt");
    expect(text).not.toContain("Từ chối Duyệt");
  });

  test("keeps 'Gỡ chặn' off for a store with no owner, saying why (AD-DS6)", () => {
    const html = renderAdmin(
      createElement(SellerHeader, {
        seller: store("Chè Thái Lan", "blocked"),
        cover: [],
        review: true,
        ownerless: true,
      }),
    );
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*title="Cửa hàng không còn chủ"/);

    const today = renderAdmin(
      createElement(SellerHeader, {
        seller: store("Chè Thái Lan", "blocked"),
        cover: [],
        review: false,
        ownerless: true,
      }),
    );
    expect(today).not.toContain("Cửa hàng không còn chủ");
    expect(today).not.toMatch(/<button[^>]*disabled=""/);
  });
});

function overview(seller: AdminSeller, members: AdminMember[], review?: object) {
  return textOf(
    renderAdmin(
      createElement(SellerOverview, {
        seller,
        offers,
        members,
        postsHref: `/admin/sellers/${seller.id}?tab=posts`,
        review,
      }),
    ),
  );
}

describe("a store's overview", () => {
  test("says a rejected store's reason, its people first (AD-DS5)", () => {
    const text = overview(store("Chè Thái Phố Cổ", "rejected"), [owner], {
      reason: "ảnh chưa phải quầy tại Tasco Mall",
    });
    expect(text).toContain("Cửa hàng bị từ chối");
    expect(text).toContain("Lý do: ảnh chưa phải quầy tại Tasco Mall");
    expect(text).toContain("Không hiện với khách");
    expect(text).toContain("Chủ sửa rồi gửi lại được");
    expect(text.indexOf("Thành viên")).toBeLessThan(text.indexOf("Bài đang bán"));
  });

  test("shows a pending store's people first, with no status card (AD-DS2)", () => {
    const text = overview(store("Chè Thái Phố Cổ", "pending"), [owner], {});
    expect(text.indexOf("Thành viên")).toBeLessThan(text.indexOf("Bài đang bán"));
    expect(text).not.toContain("Cửa hàng bị từ chối");
  });

  test("says an admin blocked a store and why (AD-DS7)", () => {
    const text = overview(store("Tiệm bánh Pháp", "blocked"), [owner, staff], {
      reason: "bán bánh đã quá hạn sử dụng",
      blockedBy: "admin",
    });
    expect(text).toContain("Cửa hàng đang bị chặn");
    expect(text).toContain("Lý do: bán bánh đã quá hạn sử dụng");
    expect(text).toContain("Bài đăng và nhân viên vẫn được giữ");
    expect(text).not.toContain("Không đăng hay sửa bài được");
  });

  test("says a store's owner deleted their account and nobody is left (AD-DS6)", () => {
    const text = overview(store("Chè Thái Lan", "blocked"), [], { blockedBy: "owner_deleted" });
    expect(text).toContain("Lý do: chủ cửa hàng đã xoá tài khoản");
    expect(text).toContain("Bài đăng vẫn được giữ");
    expect(text).not.toContain("Bài đăng và nhân viên vẫn được giữ");
    expect(text).toContain("Không còn thành viên");
  });

  test("stays as today while the flag is off", () => {
    const text = overview(store("Tiệm bánh Pháp", "blocked"), [owner]);
    expect(text).toContain("Cửa hàng đang bị chặn");
    expect(text).toContain("Không đăng hay sửa bài được");
    expect(text).toContain("Bài đăng và nhân viên vẫn được giữ");
    expect(text).not.toContain("Lý do");
  });
});

describe("a pending store that matches a blocked one (AD-DS2)", () => {
  test("says on what, in one line, with the blocked store a press away", () => {
    const html = renderAdmin(
      createElement(DuplicateAlert, {
        duplicate: { sellerId: "se-9", name: "Chè Thái Lan", match: "phone" },
      }),
    );
    expect(textOf(html)).toBe(
      "Trùng số điện thoại với Chè Thái Lan (đang bị chặn) Xem Chè Thái Lan",
    );
    expect(html).toContain('href="/admin/sellers/se-9"');
    expect(html).toContain('role="alert"');

    const address = renderAdmin(
      createElement(DuplicateAlert, {
        duplicate: { sellerId: "se-9", name: "Chè Thái Lan", match: "address" },
      }),
    );
    expect(textOf(address)).toContain("Trùng địa chỉ với Chè Thái Lan (đang bị chặn)");
  });
});

describe("the reason dialogs (AD-DS3, AD-DS4)", () => {
  test("asks why a store is rejected, then says what follows", () => {
    const html = renderAdmin(
      createElement(ReasonBody, { kind: "reject", reason: "", onReason: () => {} }),
    );
    const text = textOf(html);
    expect(text.indexOf("Lý do từ chối")).toBeLessThan(text.indexOf("Khi bị từ chối:"));
    expect(text).toContain("Cửa hàng không hiện với khách và không đăng bài được.");
    expect(text).toContain("Chủ cửa hàng nhận email kèm lý do.");
    expect(text).toContain("Chủ cửa hàng sửa thông tin rồi gửi lại được.");
    expect(html).toMatch(/<textarea[^>]*required=""[^>]*maxLength="500"/);
  });

  test("asks why a store is blocked, then says what follows and that it can be undone", () => {
    const text = textOf(
      renderAdmin(
        createElement(ReasonBody, {
          kind: "block",
          reason: "Bán bánh đã quá hạn sử dụng cho khách ngày 19/10/2026.",
          onReason: () => {},
        }),
      ),
    );
    expect(text).toContain("Lý do chặn");
    expect(text).toContain("Bán bánh đã quá hạn sử dụng cho khách ngày 19/10/2026.");
    expect(text).toContain("Khi bị chặn:");
    expect(text).toContain("Cửa hàng vẫn gỡ bài và quản lý nhân viên được.");
    expect(text).toContain("Chủ cửa hàng nhận email kèm lý do.");
    expect(text).toContain("Có thể gỡ chặn bất cứ lúc nào.");
  });
});
