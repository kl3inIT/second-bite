import {
  first,
  oneOf,
  type PageSize,
  pageOf,
  pageSizeOf,
  type SearchParams,
  searchOf,
  type SortDirection,
} from "../list-query";
import {
  type CampaignCounts,
  type CampaignFilter,
  campaignFilters,
  type CampaignStatus,
} from "../promotions/promotion";

/** Who a place is sold to (Figma AD-MK7 › Loại): a store pushed up the lists, or a sponsor. */
export const sponsorKinds = ["featuredStore", "sponsor"] as const;
export type SponsorKind = (typeof sponsorKinds)[number];

/** Where the place is in the app (Figma AD-MK7 › Vị trí). */
export const sponsorPlacements = [
  "homeTop",
  "homeBanner",
  "searchSuggest",
  "ordersThanks",
  "collection",
] as const;
export type SponsorPlacement = (typeof sponsorPlacements)[number];

/** A sold place as the admin's list shows it (Figma AD-MK7). */
export type SponsorRow = {
  id: string;
  name: string;
  kind: SponsorKind;
  /** The store pushed up, whose page the row opens; none for a sponsor. */
  sellerId?: string;
  placement: SponsorPlacement;
  startsAt: string;
  endsAt: string;
  /** How many times it was shown, and the share of those pressed (0 to 1); nothing before it runs. */
  impressions: number | null;
  clickRate: number | null;
  status: CampaignStatus;
};

export type SponsorList = { items: SponsorRow[]; total: number; counts?: CampaignCounts };

export type SponsorQuery = {
  q: string;
  status: CampaignFilter;
  kind: "all" | SponsorKind;
  placement: "all" | SponsorPlacement;
  size: PageSize;
  page: number;
  /** The list is sorted by its run only (Figma: "Thời gian ↓"). */
  dir: SortDirection;
};

export const sponsorDefaults: SponsorQuery = {
  q: "",
  status: "all",
  kind: "all",
  placement: "all",
  size: 10,
  page: 1,
  dir: "desc",
};

/** The sponsors list's query from its address; anything unknown falls back to its default. */
export function sponsorQueryOf(params: SearchParams): SponsorQuery {
  return {
    q: searchOf(first(params, "q")),
    status: oneOf(first(params, "status"), campaignFilters, "all"),
    kind: oneOf(first(params, "kind"), ["all", ...sponsorKinds] as const, "all"),
    placement: oneOf(first(params, "placement"), ["all", ...sponsorPlacements] as const, "all"),
    size: pageSizeOf(first(params, "size")),
    page: pageOf(first(params, "page")),
    dir: oneOf(first(params, "dir"), ["asc", "desc"] as const, "desc"),
  };
}

/** A share of the times shown that were pressed, to a tenth of a percent: 0.038 is "3,8%" in Vietnamese. */
export function clickRateText(rate: number, locale: string): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(rate * 100)}%`;
}
