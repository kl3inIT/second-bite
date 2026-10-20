import { createElement, type ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";

import reviews from "../../../../messages/admin/reviews.vi.json";
import { renderAdmin } from "../issues/render-for-tests";
import { type AdminReviewRow, readReviewQuery } from "./review";
import { ReviewsList } from "./reviews-list";

// The list with sample reviews, as a backend that keeps reviews will give them; the page itself has none yet.
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) =>
    createElement("a", { href: `/vi${href}`, ...rest }, children),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/admin/reviews",
}));

const rows: AdminReviewRow[] = [
  {
    id: "r-1",
    stars: 5,
    sellerId: "s-1",
    sellerName: "Tiệm bánh Pháp",
    customerName: "Lan Chi",
    body: "Bánh còn ấm, túi đầy hơn mình nghĩ.",
    status: "shown",
    createdAt: "2026-10-20T10:00:00Z",
  },
  {
    id: "r-2",
    stars: 1,
    sellerId: "s-2",
    sellerName: "Cơm nhà Hạnh",
    customerName: "Quốc Bảo",
    body: "Cửa hàng lừa đảo.",
    status: "reported",
    createdAt: "2026-10-20T09:00:00Z",
  },
  {
    id: "r-3",
    stars: 1,
    sellerId: "s-3",
    sellerName: "Cơm tấm Sài Gòn",
    customerName: "Quốc Bảo",
    body: "Hôm nay trời mưa to quá.",
    status: "hidden",
    createdAt: "2026-10-19T09:00:00Z",
  },
];

describe("the reviews (AD-DG1)", () => {
  test("shows each review with its stars, store, customer, words, status and day", () => {
    const html = renderAdmin(
      createElement(ReviewsList, {
        query: readReviewQuery({}),
        rows,
        total: 214,
        counts: { all: 214, reported: 2, hidden: 5 },
        sellers: [{ id: "s-1", name: "Tiệm bánh Pháp" }],
      }),
      { reviews },
    );
    expect(html).toContain("<h1");
    expect(html).toContain("Đánh giá");
    expect(html).toContain(">214<");
    expect(html).toContain("5,0");
    expect(html).toContain("5 trên 5 sao");
    expect(html).toContain("Tiệm bánh Pháp");
    expect(html).toContain("Lan Chi");
    expect(html).toContain("“Bánh còn ấm, túi đầy hơn mình nghĩ.”");
    expect(html).toContain("Hiển thị");
    expect(html).toContain("Bị báo cáo");
    expect(html).toContain("Đã ẩn");
    expect(html).toContain("20/10/2026");
    expect(html).toContain("Thao tác với đánh giá của Quốc Bảo");
    expect(html).toContain("Hiển thị 1–10 trên 214 đánh giá");
  });

  test("says when a tab is empty", () => {
    const html = renderAdmin(
      createElement(ReviewsList, {
        query: readReviewQuery({ tab: "reported" }),
        rows: [],
        total: 0,
        sellers: [],
      }),
      { reviews },
    );
    expect(html).toContain("Không có đánh giá bị báo cáo");
  });
});
