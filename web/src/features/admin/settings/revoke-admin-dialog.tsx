"use client";

import { BanIcon, InfoIcon, RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { revokeAdmin } from "@/lib/api/generated";

import { showAdminToast } from "../lib/toast";
import { ConfirmDialog, ConsequenceList } from "../ui/confirm-dialog";
import { adminRefusal } from "./admins";

/**
 * Revoking an admin (Figma AD-AM3): what follows (the admin pages refuse them from their next request, the audit
 * log records it, and the role can be granted again), then `POST /admin/admins/{accountId}/revoke`. A refusal,
 * such as the last admin, is said in a one-line toast.
 */
export function RevokeAdminDialog({
  admin,
  open,
  onOpenChange,
}: {
  admin: { id: string; email: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("admin.settings.admins");
  const router = useRouter();
  const [pending, startRevoking] = useTransition();
  const email = admin?.email ?? "";

  function revoke() {
    if (!admin || pending) return;
    startRevoking(async () => {
      try {
        await revokeAdmin({ path: { accountId: admin.id } });
        showAdminToast(t("revoked", { email }));
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        const code = error instanceof ApiError ? error.code : undefined;
        showAdminToast(t(`refusals.${adminRefusal(code)}`, { email }), "error");
      }
    });
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("revokeDialog.title")}
      confirmLabel={t("revokeDialog.confirm")}
      destructive
      pending={pending}
      onConfirm={revoke}
    >
      <ConsequenceList
        title={t("revokeDialog.after")}
        items={[
          { icon: BanIcon, text: t("revokeDialog.access", { email }) },
          { icon: InfoIcon, text: t("revokeDialog.logged") },
          { icon: RotateCcwIcon, text: t("revokeDialog.regrant") },
        ]}
      />
    </ConfirmDialog>
  );
}
