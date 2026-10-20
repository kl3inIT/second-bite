"use client";

import { BanIcon, CheckIcon, CircleXIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";

import { Textarea } from "@/components/ui/textarea";

import { ConfirmDialog, ConsequenceList } from "../ui/confirm-dialog";

/**
 * Locking an account (Figma AD-TK3): what follows (no more sign-in and its sessions end, the orders it holds are
 * cancelled and the customers told, its history kept and it can be unlocked; admin-qa, awaiting the founder), and
 * a reason only admins read. Locking waits for its backend, so the action stays off ("Sắp có") while the reason
 * can be written.
 */
export function LockAccountDialog({
  name,
  heldOrders,
  open,
  onOpenChange,
}: {
  name: string;
  heldOrders: { code: string; sellerName: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("admin.accounts.lockDialog");
  const soon = useTranslations("admin.accounts")("soon");
  const reasonId = useId();
  const held = heldOrders
    .map((order) => t("heldOrder", { code: order.code, seller: order.sellerName }))
    .join("; ");

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("title", { name })}
      confirmLabel={t("confirm")}
      confirmIcon={BanIcon}
      destructive
      confirmDisabled
      confirmTitle={soon}
      onConfirm={() => undefined}
      form={
        <div className="flex flex-col gap-2">
          <label htmlFor={reasonId} className="text-label-strong text-foreground">
            {t("reason")}
          </label>
          <Textarea id={reasonId} rows={3} />
        </div>
      }
    >
      <ConsequenceList
        title={t("after")}
        items={[
          { icon: BanIcon, text: t("consequences.signIn") },
          {
            icon: CircleXIcon,
            text: held ? t("consequences.heldOrders", { orders: held }) : t("consequences.orders"),
          },
          { icon: CheckIcon, text: t("consequences.history") },
        ]}
      />
    </ConfirmDialog>
  );
}
