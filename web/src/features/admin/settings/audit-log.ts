import { CircleCheckIcon, CircleXIcon, InfoIcon, type LucideIcon, MinusIcon } from "lucide-react";

import { first, oneOf, type SearchParams } from "../list-query";
import { adminHref } from "../pages";
import type { BadgeTone } from "../ui/badge";

// The audit log as SEC-75 decided it (decisions 1, 5, 6 and 7): an append-only table written in the change's own
// transaction, a closed catalog of `subject.verb` actions each with the detail it may carry, the actor and the
// resource labelled as they were, and the request's id. These are the types `GET /admin/audit-events` is expected
// to answer; the web reads nothing else.

/**
 * An account as the audit keeps it: its id, and its label (its email) as it was, or none once the account was
 * deleted (SEC-75 decision 6), which reads "Tài khoản đã xoá".
 */
export type AuditActor = { id: string; label: string | null };

/** The closed catalog of what the audit records, as `subject.verb`. */
export const auditActions = [
  "store.approve",
  "store.reject",
  "store.block",
  "store.unblock",
  "offer_settings.change",
  "email_settings.change",
  "admin.grant",
  "admin.revoke",
] as const;

export type AuditAction = (typeof auditActions)[number];

/**
 * What an action was done to: a store, one of the two settings, or an admin's account. `label` is the store's
 * name or the account's email as it was; none for the settings, whose name the page gives, and none for an
 * account since deleted.
 */
export type AuditResource =
  | { type: "store"; id: string; label: string | null }
  | { type: "offer_settings" | "email_settings"; id: string; label: null }
  | { type: "admin"; id: string; label: string | null };

/** The offer settings a change can name (`OfferSettingsBody`). */
export const offerSettingFields = [
  "minDiscountPercent",
  "windowMinMinutes",
  "windowMaxMinutes",
  "startsWithinHours",
  "defaultRadiusKm",
  "maxRadiusKm",
] as const;
export type OfferSettingField = (typeof offerSettingFields)[number];

/** The email settings a change can name with their values (`EmailSettingsBody`, without its secrets). */
export type EmailSettingField =
  | "provider"
  | "senderAddress"
  | "senderName"
  | "smtpHost"
  | "smtpPort"
  | "smtpSecurity"
  | "smtpUsername";

/** The sealed email secrets: a change says that one was replaced or removed, never its value. */
export type EmailSecretField = "smtpPassword" | "brevoApiKey";

/** One setting before and after; none on a side where it was empty. */
export type SettingChange<Field extends string, Value> = {
  field: Field;
  before: Value | null;
  after: Value | null;
};

export type EmailSettingChange =
  | SettingChange<EmailSettingField, string | number>
  | { field: EmailSecretField; before?: never; after?: never };

type AuditCommon = {
  id: string;
  /** When it happened (RFC 3339). */
  occurredAt: string;
  actor: AuditActor;
  /** The request that made the change, as `X-Request-Id` answered it, for finding it in the logs. */
  requestId: string;
};

/** One entry of the audit log: each action with the detail its catalog entry allows, and nothing else. */
export type AuditEntry = AuditCommon &
  (
    | { action: "store.approve" | "store.unblock"; resource: AuditResource & { type: "store" } }
    | {
        action: "store.reject" | "store.block";
        resource: AuditResource & { type: "store" };
        /** The reason the store's owner reads. */
        detail: { reason: string };
      }
    | {
        action: "offer_settings.change";
        resource: AuditResource & { type: "offer_settings" };
        detail: { changes: SettingChange<OfferSettingField, number>[] };
      }
    | {
        action: "email_settings.change";
        resource: AuditResource & { type: "email_settings" };
        detail: { changes: EmailSettingChange[] };
      }
    | { action: "admin.grant" | "admin.revoke"; resource: AuditResource & { type: "admin" } }
  );

/**
 * Where the next page starts: after the entry with this time and id. The log is newest first, ordered by
 * `(occurredAt, id)` descending, so a page is the entries strictly before the cursor (SEC-75 decision 7).
 */
export type AuditCursor = { occurredAt: string; id: string };

/** A page of the log, and where the next one starts; none on the last page. */
export type AuditPage = { items: AuditEntry[]; next: AuditCursor | null };

/** How an action is named in the page's words, and how its badge looks (Figma AD-AL1). */
export const auditActionLooks: Record<
  AuditAction,
  {
    key:
      | "storeApprove"
      | "storeReject"
      | "storeBlock"
      | "storeUnblock"
      | "offerSettingsChange"
      | "emailSettingsChange"
      | "adminGrant"
      | "adminRevoke";
    tone: BadgeTone;
    icon: LucideIcon;
  }
> = {
  "store.approve": { key: "storeApprove", tone: "success", icon: CircleCheckIcon },
  "store.reject": { key: "storeReject", tone: "neutral", icon: CircleXIcon },
  "store.block": { key: "storeBlock", tone: "error", icon: CircleXIcon },
  "store.unblock": { key: "storeUnblock", tone: "success", icon: CircleCheckIcon },
  "offer_settings.change": { key: "offerSettingsChange", tone: "info", icon: InfoIcon },
  "email_settings.change": { key: "emailSettingsChange", tone: "info", icon: InfoIcon },
  "admin.grant": { key: "adminGrant", tone: "info", icon: InfoIcon },
  "admin.revoke": { key: "adminRevoke", tone: "neutral", icon: MinusIcon },
};

/** The page an entry's resource opens: the store, the settings, or the admins. */
export function auditResourceHref(resource: AuditResource): string {
  switch (resource.type) {
    case "store":
      return adminHref("sellerDetail", { sellerId: resource.id });
    case "offer_settings":
      return adminHref("settingsOffers");
    case "email_settings":
      return adminHref("settingsEmail");
    case "admin":
      return adminHref("settingsAdmins");
  }
}

/** The audit log's filters, kept in the address so a filtered view can be shared: an action and a range of days. */
export type AuditQuery = { action: AuditAction | "all"; from: string; to: string };

export const auditDefaults: AuditQuery = { action: "all", from: "", to: "" };

const day = /^\d{4}-\d{2}-\d{2}$/;

/** The filters an address holds; an unknown action or a malformed day falls back to no filter. */
export function readAuditQuery(params: SearchParams): AuditQuery {
  const from = first(params, "from") ?? "";
  const to = first(params, "to") ?? "";
  return {
    action: oneOf(first(params, "action"), ["all", ...auditActions], "all"),
    from: day.test(from) ? from : "",
    to: day.test(to) ? to : "",
  };
}

/** The rows after "Tải thêm": the next page under the ones shown, any entry already shown left out. */
export function appendAuditPage(shown: readonly AuditEntry[], page: AuditPage): AuditPage {
  const ids = new Set(shown.map((entry) => entry.id));
  return {
    items: [...shown, ...page.items.filter((entry) => !ids.has(entry.id))],
    next: page.next,
  };
}
