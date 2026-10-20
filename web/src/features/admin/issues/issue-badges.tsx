import { useTranslations } from "next-intl";

import { initials } from "@/features/offers/seller";

import { AdminBadge } from "../ui/badge";
import { type IssueKind, type IssuePerson, type IssueStatus, kindLook, statusLook } from "./issue";

/** A report's type in words with its icon (Figma AD-BL1): "Món có vấn đề", "Xin hoàn tiền". */
export function IssueKindBadge({ kind }: { kind: IssueKind }) {
  const t = useTranslations("admin.issues.kind");
  const { tone, icon } = kindLook(kind);
  return (
    <AdminBadge tone={tone} icon={icon}>
      {t(kind)}
    </AdminBadge>
  );
}

/** A report's status (Figma AD-BL2): "Mới", "Đang xử lý", "Đã xong". */
export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  const t = useTranslations("admin.issues.status");
  const { tone, icon } = statusLook(status);
  return (
    <AdminBadge tone={tone} icon={icon}>
      {t(status)}
    </AdminBadge>
  );
}

/**
 * Who handles a report (Figma AD-BL1 › Cell/Người xử lý): their initials on the sky wash and their name, or a
 * dashed "?" and "Chưa nhận" while nobody has taken it.
 */
export function HandlerCell({ handler }: { handler?: IssuePerson }) {
  const t = useTranslations("admin.issues");
  return (
    <span className="flex items-center gap-2">
      {handler ? (
        <span
          aria-hidden
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-label-strong text-primary"
        >
          {initials(handler.name)}
        </span>
      ) : (
        <span
          aria-hidden
          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-dashed border-input bg-card text-label-strong text-muted-foreground"
        >
          ?
        </span>
      )}
      <span
        className={
          handler
            ? "truncate text-body-sm text-foreground"
            : "truncate text-body-sm text-muted-foreground"
        }
      >
        {handler?.name ?? t("unassigned")}
      </span>
    </span>
  );
}
