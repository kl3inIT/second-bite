import {
  CircleCheckIcon,
  CircleXIcon,
  EyeOffIcon,
  InfoIcon,
  type LucideIcon,
  TriangleAlertIcon,
} from "lucide-react";

import type { BadgeTone } from "../ui/badge";

/** What an admin did, as the audit log names it (Figma AD-CD5). */
export const auditActions = [
  "sellerBlocked",
  "sellerUnblocked",
  "offerRemoved",
  "offerSettingsChanged",
  "emailSettingsChanged",
  "categoryChanged",
  "reviewHidden",
  "adminInvited",
] as const;

export type AuditAction = (typeof auditActions)[number];

const looks: Record<AuditAction, { tone: BadgeTone; icon: LucideIcon }> = {
  sellerBlocked: { tone: "error", icon: CircleXIcon },
  sellerUnblocked: { tone: "success", icon: CircleCheckIcon },
  offerRemoved: { tone: "warning", icon: TriangleAlertIcon },
  offerSettingsChanged: { tone: "info", icon: InfoIcon },
  emailSettingsChanged: { tone: "info", icon: InfoIcon },
  categoryChanged: { tone: "info", icon: InfoIcon },
  reviewHidden: { tone: "neutral", icon: EyeOffIcon },
  adminInvited: { tone: "info", icon: InfoIcon },
};

/** How an action looks: what takes something away in red or amber, what gives it back in green. */
export function auditActionLook(action: AuditAction) {
  return looks[action];
}

/** The audit log's filters, kept in the address so a filtered view can be shared. */
export type AuditQuery = {
  q: string;
  actor: string;
  action: AuditAction | "all";
  from?: string;
  to?: string;
  page: number;
};

type Params = Record<string, string | string[] | undefined>;

const day = /^\d{4}-\d{2}-\d{2}$/;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** The filters an address holds; anything unknown or malformed falls back to no filter. */
export function auditQuery(params: Params): AuditQuery {
  const action = one(params.action);
  const from = one(params.from);
  const to = one(params.to);
  const page = Number(one(params.page));
  return {
    q: one(params.q)?.trim() ?? "",
    actor: one(params.actor) || "all",
    action: auditActions.includes(action as AuditAction) ? (action as AuditAction) : "all",
    from: from && day.test(from) ? from : undefined,
    to: to && day.test(to) ? to : undefined,
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

/** The address's query for some filters: the defaults are left out, and a new filter goes back to page 1. */
export function auditSearch(query: AuditQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.actor !== "all") params.set("actor", query.actor);
  if (query.action !== "all") params.set("action", query.action);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.page > 1) params.set("page", String(query.page));
  const search = params.toString();
  return search ? `?${search}` : "";
}
