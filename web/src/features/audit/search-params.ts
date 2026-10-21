import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import type { AuditEventBody } from "@/lib/api/generated";

export type AuditAction = AuditEventBody["action"];

/** The catalog's actions, in the order the filter lists them (server/internal/audit/catalog.go). */
export const auditActions = [
  "seller.approve",
  "seller.reject",
  "seller.block",
  "seller.unblock",
  "admin.grant",
  "admin.revoke",
  "offer_settings.change",
  "email_settings.change",
] as const satisfies readonly AuditAction[];

/** Each action's name among the messages, which cannot hold its dot. */
export const actionMessage = {
  "seller.approve": "sellerApprove",
  "seller.reject": "sellerReject",
  "seller.block": "sellerBlock",
  "seller.unblock": "sellerUnblock",
  "admin.grant": "adminGrant",
  "admin.revoke": "adminRevoke",
  "offer_settings.change": "offerSettingsChange",
  "email_settings.change": "emailSettingsChange",
} as const satisfies Record<AuditAction, string>;

/** The log's page size: the rows of Figma AD-CD5. */
export const auditPageSize = 25;

/**
 * What the log is filtered by, kept in the address (SEC-75 › Lists, `nuqs`), read by the page on the server
 * and changed by the filters in the browser: words, one action, one admin, a range of days, the page.
 */
export const auditSearchParams = {
  q: parseAsString.withDefault(""),
  action: parseAsStringLiteral(auditActions),
  actor: parseAsString,
  from: parseAsIsoDate,
  to: parseAsIsoDate,
  page: parseAsInteger.withDefault(1),
};

export const loadAuditSearchParams = createLoader(auditSearchParams);
export const serializeAuditSearchParams = createSerializer(auditSearchParams);

/** A day of the range as the API's bound: its midnight in Vietnam, which keeps no summer time. */
export function vietnamMidnight(day: Date, plusDays = 0): string {
  const next = new Date(day.getTime() + plusDays * 24 * 60 * 60 * 1000);
  return `${next.toISOString().slice(0, 10)}T00:00:00+07:00`;
}
