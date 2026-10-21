import {
  BanIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  InfoIcon,
  type LucideIcon,
  RotateCcwIcon,
  SparklesIcon,
  TriangleAlertIcon,
} from "lucide-react";

import type { VariantProps } from "class-variance-authority";

import type { badgeVariants } from "@/components/ui/badge";

import { pageSizes } from "../list-query";

// A problem report as the admin sees it (docs: admin-web-flow › Báo lỗi, Figma AD-BL1 to AD-BL4). SEC-13 has
// not built the reports yet; these are the shapes the screens are drawn for.

export const issueKinds = ["food_problem", "refund", "store_closed", "cancel", "other"] as const;
export type IssueKind = (typeof issueKinds)[number];

export const issueStatuses = ["new", "in_progress", "done"] as const;
export type IssueStatus = (typeof issueStatuses)[number];

export type IssuePerson = { id: string; name: string };

/** What a report is about: an order, or a store when no order is named. */
export type IssueRelated =
  { kind: "order"; id: string; code: string } | { kind: "seller"; id: string; name: string };

export type AdminIssueRow = {
  id: string;
  code: string;
  kind: IssueKind;
  status: IssueStatus;
  senderName: string;
  related?: IssueRelated;
  handler?: IssuePerson;
  updatedAt: string;
  resolvedAt?: string;
};

export type IssueMessage = {
  id: string;
  author: { name: string; role: "customer" | "seller" | "admin" };
  body: string;
  at: string;
  /** A note between admins, which the customer never sees. */
  internal: boolean;
};

export type IssueOrder = {
  id: string;
  code: string;
  sellerId: string;
  sellerName: string;
  /** "Bánh su kem, hộp 6 cái × 1". */
  item: string;
  amountVnd: number;
  payment: { method: "cash" | "vietqr"; paid: boolean };
  collectedAt?: string;
};

export type AdminIssue = {
  id: string;
  code: string;
  title: string;
  kind: IssueKind;
  status: IssueStatus;
  sender: { name: string; role: "customer" | "seller" };
  body: string;
  photos: { id: string; url: string }[];
  messages: IssueMessage[];
  handler?: IssuePerson;
  /** The admins a report can be given to. */
  handlers: IssuePerson[];
  order?: IssueOrder;
};

/** A badge's look: one of the shared Badge's own variants, and the icon that carries the status with its words. */
type BadgeLook = { variant: VariantProps<typeof badgeVariants>["variant"]; icon: LucideIcon };

const kindLooks: Record<IssueKind, BadgeLook> = {
  food_problem: { variant: "outline", icon: TriangleAlertIcon },
  refund: { variant: "secondary", icon: RotateCcwIcon },
  store_closed: { variant: "destructive", icon: BanIcon },
  cancel: { variant: "outline", icon: CircleXIcon },
  other: { variant: "outline", icon: InfoIcon },
};

const statusLooks: Record<IssueStatus, BadgeLook> = {
  new: { variant: "secondary", icon: SparklesIcon },
  in_progress: { variant: "outline", icon: ClockIcon },
  done: { variant: "fresh", icon: CircleCheckIcon },
};

/** A report's type as Figma AD-BL1 draws it: its colour and icon. */
export function kindLook(kind: IssueKind): BadgeLook {
  return kindLooks[kind];
}

/** A report's status as Figma AD-BL2 draws it. */
export function statusLook(status: IssueStatus): BadgeLook {
  return statusLooks[status];
}

export type IssueQuery = {
  tab: IssueStatus;
  page: number;
  size: (typeof pageSizes)[number];
  q: string;
  kind?: IssueKind;
  /** An admin's id, or `none` for the reports nobody has taken. */
  handler?: string;
  sort: "asc" | "desc";
};

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function oneOf<T extends string>(value: string | undefined, values: readonly T[]): T | undefined {
  return values.find((each) => each === value);
}

/** The list's state from its address: `?tab=done&page=2&size=20&q=…&kind=refund&handler=…&sort=asc`. */
export function readIssueQuery(params: SearchParams): IssueQuery {
  const page = Number(one(params.page));
  const size = Number(one(params.size));
  return {
    tab: oneOf(one(params.tab), issueStatuses) ?? "new",
    page: Number.isInteger(page) && page > 1 ? page : 1,
    size: pageSizes.find((each) => each === size) ?? 10,
    q: one(params.q)?.trim() ?? "",
    kind: oneOf(one(params.kind), issueKinds),
    handler: one(params.handler) || undefined,
    sort: one(params.sort) === "asc" ? "asc" : "desc",
  };
}

/** The list's address for a state, leaving out what is as it is by default. */
export function issuesHref(query: IssueQuery): string {
  const params = new URLSearchParams();
  if (query.tab !== "new") params.set("tab", query.tab);
  if (query.q) params.set("q", query.q);
  if (query.kind) params.set("kind", query.kind);
  if (query.handler) params.set("handler", query.handler);
  if (query.size !== 10) params.set("size", String(query.size));
  if (query.sort !== "desc") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  const search = params.toString();
  return `/admin/issues${search ? `?${search}` : ""}`;
}
