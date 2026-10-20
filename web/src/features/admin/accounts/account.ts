import {
  BanIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  type LucideIcon,
  TriangleAlertIcon,
} from "lucide-react";

import type { BadgeTone } from "../ui/badge";

// An account as the admin looks it up and locks it (docs: admin-web-flow › Tài khoản, Figma AD-TK1 to AD-TK4).
// The identity module has no admin list of accounts and no locking yet; these are the shapes the screens are
// drawn for.

/** What an account is to Second Bite: a customer, a store's owner or staff, an admin. */
export const accountRoles = ["customer", "owner", "staff", "admin"] as const;
export type AccountRole = (typeof accountRoles)[number];

export const accountStatuses = ["active", "locked"] as const;
export type AccountStatus = (typeof accountStatuses)[number];

/** The tabs: every account, customers, the people of stores (owners and staff), admins. */
export const accountTabs = ["all", "customer", "seller", "admin"] as const;
export type AccountTab = (typeof accountTabs)[number];

export type AccountSeller = { id: string; name: string };

export type AdminAccountRow = {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
  /** The stores the account owns or works at. */
  sellers: AccountSeller[];
  orders: number;
  createdAt: string;
  status: AccountStatus;
};

export const orderStatuses = ["held", "collected", "no_show", "cancelled"] as const;
export type AccountOrderStatus = (typeof orderStatuses)[number];

export type AccountOrder = {
  id: string;
  code: string;
  /** "Trà sữa trân châu, size M × 2". */
  item: string;
  sellerName: string;
  amountVnd: number;
  status: AccountOrderStatus;
  photoUrl?: string;
};

export type AccountIssue = { id: string; code: string; title: string };

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
  status: AccountStatus;
  createdAt: string;
  lastActiveAt?: string;
  signIn: "email_code" | "google";
  /** How many orders it placed, and how many of those it collected out of those that ended. */
  orders: number;
  pickupRate?: number;
  issues: AccountIssue[];
  recentOrders: AccountOrder[];
  sellers: (AccountSeller & { role: "owner" | "staff" })[];
  /** The orders it holds now, which locking it cancels. */
  heldOrders: { code: string; sellerName: string }[];
  /** Where it sits in the list, for ‹ 1 / 214 › in the top bar. */
  position?: { index: number; total: number; previousId?: string; nextId?: string };
};

type BadgeLook = { tone: BadgeTone; icon: LucideIcon | null };

const roleLooks: Record<AccountRole, BadgeLook> = {
  customer: { tone: "neutral", icon: null },
  owner: { tone: "info", icon: null },
  staff: { tone: "info", icon: null },
  admin: { tone: "info", icon: null },
};

/** A role as Figma AD-TK1 draws it: words alone, grey for a customer, blue for the others. */
export function roleLook(role: AccountRole): BadgeLook {
  return roleLooks[role];
}

const statusLooks: Record<AccountStatus, BadgeLook> = {
  active: { tone: "success", icon: CircleCheckIcon },
  locked: { tone: "error", icon: BanIcon },
};

/** An account's status: "Hoạt động", "Đã khoá". */
export function statusLook(status: AccountStatus): BadgeLook {
  return statusLooks[status];
}

const orderLooks: Record<AccountOrderStatus, BadgeLook> = {
  held: { tone: "info", icon: ClockIcon },
  collected: { tone: "success", icon: CircleCheckIcon },
  no_show: { tone: "warning", icon: TriangleAlertIcon },
  cancelled: { tone: "neutral", icon: CircleXIcon },
};

/** An order's status in the account's recent orders (Figma AD-TK2): "Đang giữ", "Đã lấy", "Không đến", "Đã huỷ". */
export function orderLook(status: AccountOrderStatus): BadgeLook {
  return orderLooks[status];
}

/** Which tab an account sits under. */
export function tabOf(role: AccountRole): Exclude<AccountTab, "all"> {
  return role === "owner" || role === "staff" ? "seller" : role;
}

/** "Trà sữa Mây +1": the first store and how many more. */
export function sellersLabel(sellers: AccountSeller[]): string | undefined {
  if (sellers.length === 0) return undefined;
  return sellers.length === 1 ? sellers[0].name : `${sellers[0].name} +${sellers.length - 1}`;
}

export const pageSizes = [10, 20, 50] as const;

export type AccountSortKey = "name" | "orders" | "createdAt";

export type AccountQuery = {
  tab: AccountTab;
  page: number;
  size: (typeof pageSizes)[number];
  q: string;
  status?: AccountStatus;
  /** Created from and to, days as YYYY-MM-DD. */
  from?: string;
  to?: string;
  sort: AccountSortKey;
  direction: "asc" | "desc";
};

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

const day = /^\d{4}-\d{2}-\d{2}$/;
const sortKeys: readonly AccountSortKey[] = ["name", "orders", "createdAt"];

/** The list's state from its address: `?tab=customer&status=locked&from=…&to=…&q=…&sort=orders&dir=asc`. */
export function readAccountQuery(params: SearchParams): AccountQuery {
  const page = Number(one(params.page));
  const size = Number(one(params.size));
  const from = one(params.from);
  const to = one(params.to);
  return {
    tab: accountTabs.find((tab) => tab === one(params.tab)) ?? "all",
    page: Number.isInteger(page) && page > 1 ? page : 1,
    size: pageSizes.find((each) => each === size) ?? 10,
    q: one(params.q)?.trim() ?? "",
    status: accountStatuses.find((status) => status === one(params.status)),
    from: from && day.test(from) ? from : undefined,
    to: to && day.test(to) ? to : undefined,
    sort: sortKeys.find((key) => key === one(params.sort)) ?? "createdAt",
    direction: one(params.dir) === "asc" ? "asc" : "desc",
  };
}

/** The list's address for a state, leaving out what is as it is by default. */
export function accountsHref(query: AccountQuery): string {
  const params = new URLSearchParams();
  if (query.tab !== "all") params.set("tab", query.tab);
  if (query.q) params.set("q", query.q);
  if (query.status) params.set("status", query.status);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.size !== 10) params.set("size", String(query.size));
  if (query.sort !== "createdAt") params.set("sort", query.sort);
  if (query.direction !== "desc") params.set("dir", query.direction);
  if (query.page > 1) params.set("page", String(query.page));
  const search = params.toString();
  return `/admin/accounts${search ? `?${search}` : ""}`;
}

/** Pressing a sortable heading: the column sorted another way round, or a new column sorted down first. */
export function toggleSort(query: AccountQuery, key: AccountSortKey): AccountQuery {
  const direction = query.sort === key && query.direction === "desc" ? "asc" : "desc";
  return { ...query, sort: key, direction, page: 1 };
}

/** The tabs of an account's page (Figma AD-TK2): its recent orders, its stores, its reports. */
export const detailTabs = ["orders", "stores", "issues"] as const;
export type AccountDetailTab = (typeof detailTabs)[number];

export function readDetailTab(value: string | string[] | undefined): AccountDetailTab {
  return detailTabs.find((tab) => tab === value) ?? "orders";
}
