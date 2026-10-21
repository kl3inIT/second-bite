import { useTranslations } from "next-intl";

import type { AuditEntry, EmailSettingChange, OfferSettingField, SettingChange } from "./audit-log";

const offerUnits: Record<OfferSettingField, "percent" | "minutes" | "hours" | "km"> = {
  minDiscountPercent: "percent",
  windowMinMinutes: "minutes",
  windowMaxMinutes: "minutes",
  startsWithinHours: "hours",
  defaultRadiusKm: "km",
  maxRadiusKm: "km",
};

const emailChoices = ["smtp", "brevo", "none", "starttls", "tls"] as const;

/**
 * An entry's detail in the page's words, one line each (Figma AD-AL1 "Chi tiết"): "Lý do: …" for a refusal or a
 * block, "Giảm tối thiểu: 20% → 30%" for each setting changed, "Mật khẩu SMTP: đã đổi" for a secret; none for an
 * action without detail.
 */
export function useAuditDetail(): (entry: AuditEntry) => string[] {
  const t = useTranslations("admin.settings.auditLog");
  const email = useTranslations("admin.settings.email");

  function offerValue(field: OfferSettingField, value: number | null) {
    return value === null ? t("blank") : t(`values.${offerUnits[field]}`, { value });
  }

  function emailValue(value: string | number | null) {
    if (value === null || value === "") return t("blank");
    const choice = emailChoices.find((each) => each === value);
    return choice ? email(choice) : String(value);
  }

  function offerLine({ field, before, after }: SettingChange<OfferSettingField, number>) {
    return t("change", {
      field: t(`fields.${field}`),
      before: offerValue(field, before),
      after: offerValue(field, after),
    });
  }

  function emailLine(change: EmailSettingChange) {
    if (change.field === "smtpPassword" || change.field === "brevoApiKey") {
      return t("secretChanged", { field: t(`fields.${change.field}`) });
    }
    return t("change", {
      field: t(`fields.${change.field}`),
      before: emailValue(change.before ?? null),
      after: emailValue(change.after ?? null),
    });
  }

  return (entry) => {
    switch (entry.action) {
      case "store.reject":
      case "store.block":
        return [t("reason", { reason: entry.detail.reason })];
      case "offer_settings.change":
        return entry.detail.changes.map(offerLine);
      case "email_settings.change":
        return entry.detail.changes.map(emailLine);
      default:
        return [];
    }
  };
}
