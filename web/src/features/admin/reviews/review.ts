import { BanIcon, EyeIcon, type LucideIcon, TriangleAlertIcon } from "lucide-react";

import type { BadgeTone } from "../ui/badge";

// A customer's review of a store, as the admin moderates it (docs: admin-web-flow › Đánh giá, Figma AD-DG1 to
// AD-DG3). No module keeps reviews yet; these are the shapes the screens are drawn for.

export const reviewStatuses = ["shown", "reported", "hidden"] as const;
export type ReviewStatus = (typeof reviewStatuses)[number];

/** The tabs: every review, the ones someone reported, the ones an admin hid. */
export const reviewTabs = ["all", "reported", "hidden"] as const;
export type ReviewTab = (typeof reviewTabs)[number];

export type AdminReviewRow = {
  id: string;
  /** 1 to 5. */
  stars: number;
  sellerId: string;
  sellerName: string;
  customerName: string;
  body: string;
  status: ReviewStatus;
  createdAt: string;
};

export type ReviewSeller = { id: string; name: string };

/** Why an admin hides a review (Figma AD-DG2 › Lý do ẩn). */
export const hideReasons = ["language", "off_topic", "spam"] as const;
export type HideReason = (typeof hideReasons)[number];

type BadgeLook = { tone: BadgeTone; icon: LucideIcon };

const statusLooks: Record<ReviewStatus, BadgeLook> = {
  shown: { tone: "success", icon: EyeIcon },
  reported: { tone: "warning", icon: TriangleAlertIcon },
  hidden: { tone: "neutral", icon: BanIcon },
};

/** A review's status as Figma AD-DG1 draws it: "Hiển thị", "Bị báo cáo", "Đã ẩn". */
export function statusLook(status: ReviewStatus): BadgeLook {
  return statusLooks[status];
}

export const pageSizes = [10, 20, 50] as const;
export const starChoices = [5, 4, 3, 2, 1] as const;

export type ReviewQuery = {
  tab: ReviewTab;
  page: number;
  size: (typeof pageSizes)[number];
  q: string;
  stars?: (typeof starChoices)[number];
  /** A store's id. */
  seller?: string;
  sort: "asc" | "desc";
};

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/** The list's state from its address: `?tab=reported&stars=1&seller=…&q=…&size=20&page=2&sort=asc`. */
export function readReviewQuery(params: SearchParams): ReviewQuery {
  const page = Number(one(params.page));
  const size = Number(one(params.size));
  const stars = Number(one(params.stars));
  return {
    tab: reviewTabs.find((tab) => tab === one(params.tab)) ?? "all",
    page: Number.isInteger(page) && page > 1 ? page : 1,
    size: pageSizes.find((each) => each === size) ?? 10,
    q: one(params.q)?.trim() ?? "",
    stars: starChoices.find((each) => each === stars),
    seller: one(params.seller) || undefined,
    sort: one(params.sort) === "asc" ? "asc" : "desc",
  };
}

/** The list's address for a state, leaving out what is as it is by default. */
export function reviewsHref(query: ReviewQuery): string {
  const params = new URLSearchParams();
  if (query.tab !== "all") params.set("tab", query.tab);
  if (query.q) params.set("q", query.q);
  if (query.stars) params.set("stars", String(query.stars));
  if (query.seller) params.set("seller", query.seller);
  if (query.size !== 10) params.set("size", String(query.size));
  if (query.sort !== "desc") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  const search = params.toString();
  return `/admin/reviews${search ? `?${search}` : ""}`;
}
