"use client";

import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

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

/**
 * A question before an action that cannot be taken lightly (Figma Admin/Dialog 238:47513, AD-Q5): its title,
 * what it will do in `children` (a ConsequenceList, a line), then Huỷ and the action, red when `destructive`
 * (docs: admin-web-flow › Hộp chặn). While `pending` the action shows its spinner and cannot be pressed
 * twice. The page owns `open`, opening it from a row's menu or a button, and closes it when the action is done.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  confirmLabel,
  confirmIcon: ConfirmIcon,
  onConfirm,
  destructive = false,
  pending = false,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  confirmLabel: string;
  confirmIcon?: LucideIcon;
  onConfirm: () => void;
  destructive?: boolean;
  pending?: boolean;
  children?: ReactNode;
}) {
  const t = useTranslations("admin.shell.confirm");

  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <AlertDialogContent size="admin">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        {children && <AlertDialogDescription render={<div />}>{children}</AlertDialogDescription>}
        <AlertDialogFooter>
          <AlertDialogCancel variant="neutral" disabled={pending}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "danger" : "default"}
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              ConfirmIcon && <ConfirmIcon data-icon="inline-start" aria-hidden />
            )}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export type Consequence = { icon: LucideIcon; text: string };

/**
 * What an action will do, one line each with its icon, on a pale box (Figma AD-Q5 "Khi bị chặn:"). `title` heads
 * the list.
 */
export function ConsequenceList({ title, items }: { title?: string; items: Consequence[] }) {
  return (
    <div className="flex flex-col gap-2 rounded-md bg-muted p-3 text-left">
      {title && <p className="text-label-strong text-foreground">{title}</p>}
      <ul className="flex flex-col gap-2">
        {items.map(({ icon: Icon, text }) => (
          <li key={text} className="flex gap-2 text-body-sm text-foreground">
            <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
