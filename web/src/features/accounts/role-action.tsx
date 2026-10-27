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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useRouter } from "@/i18n/navigation";
import { failureOf } from "@/lib/api/client";
import { grantAdmin, revokeAdmin, type RecordBody } from "@/lib/api/generated";

import { nameOf } from "./account-parts";

export type RoleChange = "grant" | "revoke";

/**
 * The change an admin may make to the account's role, or why there is none: the caller's own account and
 * the last admin cannot be revoked, as the server refuses both.
 */
export function roleChangeOf(
  account: RecordBody,
  myId: string,
  adminCount: number,
): { change: RoleChange } | { refused: "self" | "last" } {
  if (account.role === "customer") return { change: "grant" };
  if (account.id === myId) return { refused: "self" };
  if (adminCount <= 1) return { refused: "last" };
  return { change: "revoke" };
}

/**
 * The account page's role action (SEC-75): a labelled button that makes a customer an admin, or an admin a
 * customer again, after asking; or the reason in text when there is none. No email is sent: the person
 * sees the admin pages at their next visit.
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
  const t = useTranslations("Admin.admins");
  const [open, setOpen] = useState(false);
  const role = roleChangeOf(account, myId, adminCount);

  if ("refused" in role)
    return <span className="text-label text-muted-foreground">{t(`revoke.${role.refused}`)}</span>;

  const Icon = role.change === "grant" ? ShieldPlusIcon : ShieldMinusIcon;
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Icon data-icon="inline-start" aria-hidden />
        {t(role.change === "grant" ? "promote.open" : "revoke.open")}
        <span className="sr-only"> {nameOf(account)}</span>
      </Button>
      {/* Keyed by the change, so a grant that turns the account into an admin asks the revoke afresh. */}
      <ChangeRoleDialog
        key={role.change}
        account={account}
        change={role.change}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

/** Asks before the change, makes it, and reads the page again; a refusal stays in a toast. */
export function ChangeRoleDialog({
  account,
  change,
  open,
  onOpenChange,
}: {
  account: RecordBody;
  change: RoleChange;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const promote = useTranslations("Admin.admins.promote");
  const revoke = useTranslations("Admin.admins.revoke");
  const t = change === "grant" ? promote : revoke;
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const name = nameOf(account);

  const confirm = async () => {
    setBusy(true);
    try {
      if (change === "grant") await grantAdmin({ body: { email: account.email } });
      else await revokeAdmin({ path: { accountId: account.id } });
      toast.add({ type: "success", title: t("done", { name, email: account.email }) });
      onOpenChange(false);
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
