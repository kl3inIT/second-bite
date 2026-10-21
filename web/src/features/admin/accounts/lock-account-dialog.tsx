"use client";

import { BanIcon, CheckIcon, CircleXIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId } from "react";

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
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  const accounts = useTranslations("admin.accounts");
  const shell = useTranslations("admin.shell");
  const reasonId = useId();
  const held = heldOrders
    .map((order) => t("heldOrder", { code: order.code, seller: order.sellerName }))
    .join("; ");
  const consequences = [
    { icon: BanIcon, text: t("consequences.signIn") },
    {
      icon: CircleXIcon,
      text: held ? t("consequences.heldOrders", { orders: held }) : t("consequences.orders"),
    },
    { icon: CheckIcon, text: t("consequences.history") },
  ];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title", { name })}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription render={<div />}>
          <p>{t("after")}</p>
          <ul className="mt-2 flex flex-col gap-2">
            {consequences.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-2">
                <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </AlertDialogDescription>
        <Field>
          <FieldLabel htmlFor={reasonId}>{t("reason")}</FieldLabel>
          <Textarea id={reasonId} rows={3} />
        </Field>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">{shell("confirm.cancel")}</AlertDialogCancel>
          <Tooltip>
            <TooltipTrigger render={<span className="flex" />}>
              <AlertDialogAction variant="destructive" disabled>
                <BanIcon data-icon="inline-start" aria-hidden />
                {t("confirm")}
              </AlertDialogAction>
            </TooltipTrigger>
            <TooltipContent>{accounts("soon")}</TooltipContent>
          </Tooltip>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
