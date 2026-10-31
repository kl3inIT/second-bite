import { useFormatter, useTranslations } from "next-intl";

import { formatPrice } from "@/features/offers/format";
import type { AuditChangeBody, AuditEventBody } from "@/lib/api/generated";

// The settings the log names, as the API does (server/internal/offer/settings.go, notification/settings.go).
const fields = [
  "minDiscountPercent",
  "defaultRadiusKm",
  "maxRadiusKm",
  "windowMinMinutes",
  "windowMaxMinutes",
  "startsWithinHours",
  "provider",
  "senderAddress",
  "senderName",
  "smtpHost",
  "smtpPort",
  "smtpSecurity",
  "smtpUsername",
  "smtpPassword",
  "brevoApiKey",
  "name",
  "startsAt",
  "endsAt",
  "allSellers",
  "sellerIds",
  "budgetVnd",
  "perPhonePerDay",
  "enabled",
  "rules",
] as const;

function isField(name: string): name is (typeof fields)[number] {
  return (fields as readonly string[]).includes(name);
}

// The settings whose values are figures with a unit; the others are shown as they are.
const units: Record<string, "percent" | "km" | "minutes" | "hours" | "vnd"> = {
  minDiscountPercent: "percent",
  defaultRadiusKm: "km",
  maxRadiusKm: "km",
  windowMinMinutes: "minutes",
  windowMaxMinutes: "minutes",
  startsWithinHours: "hours",
  budgetVnd: "vnd",
};

// A promotion's switches and times (server/internal/order/promotion_admin.go), shown as people read them.
const switches = new Set(["allSellers", "enabled"]);
const times = new Set(["startsAt", "endsAt"]);

// What an event changed (Figma AD-CD5 › "Thay đổi (trước → sau)"): a store's or an account's state before
// and after, read from the action, or each setting with its value before and after. The reason given to an
// owner follows on its own line.
export function AuditChange({ event }: { event: AuditEventBody }) {
  const t = useTranslations("Admin.audit.change");
  const format = useFormatter();
  const { reason, changes, source, name, weekStart, amountVnd } = event.details;

  const transitions: Partial<Record<AuditEventBody["action"], string>> = {
    "seller.approve": t("approved"),
    "seller.reject": t("rejected"),
    "seller.block": t("blocked"),
    "seller.unblock": t("unblocked"),
    "seller.change_owner": t("ownerChanged"),
    "admin.grant": t("granted"),
    "admin.revoke": t("revoked"),
  };
  const transition = transitions[event.action];

  return (
    <div className="flex max-w-64 min-w-48 flex-col gap-0.5 whitespace-normal">
      {transition && <span>{transition}</span>}
      {event.action === "promotion.create" && name && (
        <span>{t("promotionCreated", { name })}</span>
      )}
      {event.action === "seller.mark_payout" && weekStart && (
        <span>
          {t("payoutMarked", {
            week: format.dateTime(new Date(weekStart), "calendarDay"),
            amount: formatPrice(amountVnd ?? 0),
          })}
        </span>
      )}
      {changes?.map((change) => (
        <span key={change.field}>
          <SettingChange change={change} />
        </span>
      ))}
      {source === "command_line" && (
        <span className="text-label text-muted-foreground">{t("fromCommandLine")}</span>
      )}
      {reason && (
        <span className="text-label text-muted-foreground">{t("reason", { reason })}</span>
      )}
    </div>
  );
}

function SettingChange({ change }: { change: AuditChangeBody }) {
  const t = useTranslations("Admin.audit");
  const format = useFormatter();
  const field = isField(change.field) ? t(`field.${change.field}`) : change.field;
  if (change.from === undefined || change.to === undefined) return t("change.secret", { field });

  const unit = units[change.field];
  const value = (v: string) => {
    if (v === "") return t("change.empty");
    if (switches.has(change.field)) return v === "true" ? t("change.yes") : t("change.no");
    if (times.has(change.field)) return format.dateTime(new Date(v), "day");
    return unit ? t(`unit.${unit}`, { value: unit === "vnd" ? format.number(Number(v)) : v }) : v;
  };
  return t("change.value", { field, from: value(change.from), to: value(change.to) });
}
