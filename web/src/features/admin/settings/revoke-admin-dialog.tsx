"use client";

import { BanIcon, InfoIcon, RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { ConfirmDialog, ConsequenceList } from "../ui/confirm-dialog";

/**
 * Revoking an admin (Figma AD-AM3): what follows (the admin pages refuse them from their next request, the audit
 * log records it, and the role can be granted again). SEC-75 has not built revoking from the web yet, so the
 * action stays off with "Sắp có".
 */
export function RevokeAdminDialog({
  email,
  open,
  onOpenChange,
}: {
  email: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("admin.settings.admins.revokeDialog");
  const soon = useTranslations("admin.shell")("soon");

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("title")}
      confirmLabel={t("confirm")}
      destructive
      confirmDisabled
      confirmTitle={soon}
      onConfirm={() => undefined}
    >
      <ConsequenceList
        title={t("after")}
        items={[
          { icon: BanIcon, text: t("access", { email }) },
          { icon: InfoIcon, text: t("logged") },
          { icon: RotateCcwIcon, text: t("regrant") },
        ]}
      />
    </ConfirmDialog>
  );
}
