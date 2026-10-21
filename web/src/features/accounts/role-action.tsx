"use client";

import { ShieldMinusIcon, ShieldPlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useRouter } from "@/i18n/navigation";
import { failureOf } from "@/lib/api/client";
import { grantAdmin, revokeAdmin, type RecordBody } from "@/lib/api/generated";

import { nameOf } from "./account-parts";

/**
 * What an admin can do to an account's role (SEC-75): make a customer an admin, or make an admin a customer
 * again, each after asking. The caller's own account and the last admin say in text why they cannot be
 * revoked, as the server refuses both. No email is sent: the person sees the admin pages at their next visit.
 */
export function RoleAction({
  account,
  myId,
  adminCount,
}: {
  account: RecordBody;
  myId: string;
  adminCount: number;
}) {
  const t = useTranslations("Admin.admins.revoke");

  if (account.role === "customer") return <ChangeRole account={account} change="grant" />;
  if (account.id === myId)
    return <span className="text-label text-muted-foreground">{t("self")}</span>;
  if (adminCount <= 1) return <span className="text-label text-muted-foreground">{t("last")}</span>;
  return <ChangeRole account={account} change="revoke" />;
}

function ChangeRole({ account, change }: { account: RecordBody; change: "grant" | "revoke" }) {
  const promote = useTranslations("Admin.admins.promote");
  const revoke = useTranslations("Admin.admins.revoke");
  const t = change === "grant" ? promote : revoke;
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const name = nameOf(account);
  const Icon = change === "grant" ? ShieldPlusIcon : ShieldMinusIcon;

  const confirm = async () => {
    setBusy(true);
    try {
      if (change === "grant") await grantAdmin({ body: { email: account.email } });
      else await revokeAdmin({ path: { accountId: account.id } });
      toast.add({ type: "success", title: t("done", { name, email: account.email }) });
      router.refresh();
    } catch (error) {
      const { detail, reference } = failureOf(error);
      toast.add({
        type: "error",
        title: t("failed", { name }),
        description: [detail ?? t("unreachable"), reference && `(${reference})`]
          .filter(Boolean)
          .join(" "),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        <Icon data-icon="inline-start" aria-hidden />
        {t("open")}
        <span className="sr-only"> {name}</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title", { name })}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            variant={change === "revoke" ? "destructive" : "default"}
            disabled={busy}
            onClick={() => void confirm()}
          >
            {busy && <Spinner data-icon="inline-start" />}
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
