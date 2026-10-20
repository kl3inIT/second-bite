import { first, oneOf, type SearchParams } from "../list-query";
import type { CampaignStatus } from "../promotions/promotion";
import { addDays, endAfter, vietnamDateTime, vietnamDay } from "../promotions/schedule";

/** Where a banner shows in the app (Figma AD-MK3 › Trang chủ, Tìm kiếm, Trang đơn). */
export const bannerPlacements = ["home", "search", "orders"] as const;
export type BannerPlacement = (typeof bannerPlacements)[number];

/** What pressing a banner opens: a store, a collection or an address. `target` is its id or the address. */
export const bannerLinkKinds = ["store", "collection", "url"] as const;
export type BannerLinkKind = (typeof bannerLinkKinds)[number];

/** A banner as the admin's grid shows it (Figma AD-MK3 › BannerItem). */
export type BannerRow = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  placement: BannerPlacement;
  /** Its place among the placement's banners, from 1. */
  position: number;
  status: CampaignStatus;
  startsAt: string;
  endsAt: string;
  visible: boolean;
  link: { kind: BannerLinkKind; target: string };
};

/** A featured collection (Figma AD-MK3 › Bộ sưu tập nổi bật). */
export type Collection = { id: string; name: string; imageUrl?: string };

export type ContentData = { banners: BannerRow[]; collections: Collection[] };

/** The placement the page shows, from its address; the home page's banners first. */
export function placementOf(params: SearchParams): BannerPlacement {
  return oneOf(first(params, "placement"), bannerPlacements, "home");
}

/** A placement's banners in their order. */
export function bannersIn(banners: BannerRow[], placement: BannerPlacement): BannerRow[] {
  return banners
    .filter((banner) => banner.placement === placement)
    .toSorted((a, b) => a.position - b.position);
}

/** How many banners each placement holds, for "Trang chủ · 4". */
export function placementCounts(banners: BannerRow[]): Record<BannerPlacement, number> {
  const counts = { home: 0, search: 0, orders: 0 };
  for (const banner of banners) counts[banner.placement] += 1;
  return counts;
}

/** What the banner editor holds (Figma AD-MK4). Days and times are Vietnam wall-clock values. */
export type BannerForm = {
  title: string;
  subtitle: string;
  imageUrl?: string;
  placement: BannerPlacement;
  position: number;
  linkKind: BannerLinkKind;
  linkTarget: string;
  startsAt: string;
  endsAt: string;
  visible: boolean;
};

/** A banner's words fit the app's banner: a title of 40 characters, a line under it of 60. */
export const bannerLimits = { title: 40, subtitle: 60 } as const;

/** A new banner: first on the home page, from tomorrow 06:00 for ten days, shown in that time. */
export function blankBanner(now: Date): BannerForm {
  const start = addDays(vietnamDay(now), 1);
  return {
    title: "",
    subtitle: "",
    placement: "home",
    position: 1,
    linkKind: "collection",
    linkTarget: "",
    startsAt: `${start}T06:00`,
    endsAt: `${addDays(start, 10)}T23:00`,
    visible: true,
  };
}

/** A banner in the editor, to change it. */
export function bannerFormOf(banner: BannerRow): BannerForm {
  return {
    title: banner.title,
    subtitle: banner.subtitle,
    imageUrl: banner.imageUrl,
    placement: banner.placement,
    position: banner.position,
    linkKind: banner.link.kind,
    linkTarget: banner.link.target,
    startsAt: vietnamDateTime(banner.startsAt),
    endsAt: vietnamDateTime(banner.endsAt),
    visible: banner.visible,
  };
}

/**
 * The places a banner can take in a placement: after those already there, or, for a banner already in it, any
 * of theirs.
 */
export function positionsIn(
  banners: BannerRow[],
  placement: BannerPlacement,
  editing?: string,
): number[] {
  const others = banners.filter((b) => b.placement === placement && b.id !== editing).length;
  return Array.from({ length: others + 1 }, (_, index) => index + 1);
}

/** The form after the start moved: an end before it moves with it. */
export function withBannerStart(form: BannerForm, startsAt: string): BannerForm {
  return { ...form, startsAt, endsAt: endAfter(startsAt, form.endsAt) };
}

/** The form after the end moved: never before the start. */
export function withBannerEnd(form: BannerForm, endsAt: string): BannerForm {
  return { ...form, endsAt: endAfter(form.startsAt, endsAt) };
}

export type BannerProblem = "title" | "link";

/** What the banner still lacks: a title, and somewhere to go (an http or https address for a link). */
export function bannerProblems(form: BannerForm): BannerProblem[] {
  const problems: BannerProblem[] = [];
  if (form.title.trim() === "") problems.push("title");
  const target = form.linkTarget.trim();
  if (target === "" || (form.linkKind === "url" && !/^https?:\/\/\S+\.\S+/.test(target))) {
    problems.push("link");
  }
  return problems;
}
