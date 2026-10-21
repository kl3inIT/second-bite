"use client";

import { BanIcon, InfoIcon, RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { revokeAdmin } from "@/lib/api/generated";

import { toast } from "@/components/ui/toast";
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
  const cancel = useTranslations("admin.shell.confirm")("cancel");
  const router = useRouter();
  const [pending, startRevoking] = useTransition();
  const email = admin?.email ?? "";
  const after = [
    { icon: BanIcon, text: t("revokeDialog.access", { email }) },
    { icon: InfoIcon, text: t("revokeDialog.logged") },
    { icon: RotateCcwIcon, text: t("revokeDialog.regrant") },
  ];

  function revoke() {
    if (!admin || pending) return;
    startRevoking(async () => {
      try {
        await revokeAdmin({ path: { accountId: admin.id } });
        toast.add({ title: t("revoked", { email }), type: "success", timeout: 5000 });
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        const code = error instanceof ApiError ? error.code : undefined;
        toast.add({
          title: t(`refusals.${adminRefusal(code)}`, { email }),
          type: "error",
          timeout: 5000,
        });
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("revokeDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription render={<div />}>
            <p>{t("revokeDialog.after")}</p>
            <ul className="mt-2 flex flex-col gap-2">
              {after.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-2">
                  <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancel}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={pending} onClick={revoke}>
            {pending && <Spinner data-icon="inline-start" />}
            {t("revokeDialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
