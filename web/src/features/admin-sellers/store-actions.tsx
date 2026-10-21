"use client";

import {
  BanIcon,
  CircleCheckIcon,
  CircleXIcon,
  EllipsisIcon,
  EyeIcon,
  RotateCcwIcon,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError, failureOf } from "@/lib/api/client";
import {
  approveSeller,
  blockSeller,
  rejectSeller,
  type AdminSellerBody,
} from "@/lib/api/generated";

type Action = "block" | "reject" | "unblock" | "approve";

/** What the actions need of a store: the list's row and the store's page both give it. */
type Store = Pick<AdminSellerBody, "id" | "name" | "status">;

/** What a status allows (SEC-75 › A store's states): the server refuses the rest with a 409. */
const actionsFor: Record<AdminSellerBody["status"], Action[]> = {
  active: ["block"],
  blocked: ["unblock"],
  pending: ["approve", "reject"],
  rejected: ["approve"],
};

const actionIcon: Record<Action, LucideIcon> = {
  block: BanIcon,
  reject: CircleXIcon,
  unblock: RotateCcwIcon,
  approve: CircleCheckIcon,
};

/**
 * Every action on a store, in one menu: a row's "⋯" (Figma AD-Q2, AD-Q8), which also opens the store's page,
 * and the "⋯" on that page (`onPage`). What the store's status allows. Blocking and rejecting ask a reason the
 * owner is emailed (AD-DS4); unblocking and approving ask first, since they email the owner too (SEC-75 ›
 * Lists, forms and actions). Each ends in a notice and the list read again.
 */
export function StoreActions({ seller, onPage = false }: { seller: Store; onPage?: boolean }) {
  const t = useTranslations("Admin.sellers.menu");
  const [open, setOpen] = useState<Action | null>(null);
  const close = (next: boolean) => !next && setOpen(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant={onPage ? "outline" : "ghost"} size="icon" />}
          aria-label={t("open", { name: seller.name })}
        >
          <EllipsisIcon aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          {!onPage && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link href={`/admin/sellers/${seller.id}`} />}>
                  <EyeIcon aria-hidden />
                  {t("view")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuGroup>
            {actionsFor[seller.status].map((action) => {
              const Icon = actionIcon[action];
              return (
                <DropdownMenuItem
                  key={action}
                  variant={action === "block" || action === "reject" ? "destructive" : "default"}
                  onClick={() => setOpen(action)}
                >
                  <Icon aria-hidden />
                  {t(action)}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ReasonDialog action="block" seller={seller} open={open === "block"} onOpenChange={close} />
      <ReasonDialog action="reject" seller={seller} open={open === "reject"} onOpenChange={close} />
      <ConfirmDialog
        action="unblock"
        seller={seller}
        open={open === "unblock"}
        onOpenChange={close}
      />
      <ConfirmDialog
        action="approve"
        seller={seller}
        open={open === "approve"}
        onOpenChange={close}
      />
    </>
  );
}

/** Runs one action, then tells how it went and reads the list again; a refused reason stays at its field. */
function useStoreAction(seller: Store, action: Action) {
  const t = useTranslations("Admin.sellers");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [reasonError, setReasonError] = useState<string>();

  const run = async (reason: string, done: () => void) => {
    setBusy(true);
    setReasonError(undefined);
    try {
      const path = { sellerId: seller.id };
      if (action === "block") await blockSeller({ path, body: { reason } });
      else if (action === "reject") await rejectSeller({ path, body: { reason } });
      else await approveSeller({ path });
      toast.add({ type: "success", title: t(`${action}.done`, { name: seller.name }) });
      done();
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.code === "SELLER_REASON_INVALID") {
        setReasonError(error.detail);
        return;
      }
      const { detail, reference } = failureOf(error);
      toast.add({
        type: "error",
        title: [detail ?? t("unreachable"), reference && `(${reference})`]
          .filter(Boolean)
          .join(" "),
      });
      done();
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return { busy, reasonError, run };
}

/** What follows each action, as Figma AD-DS4 lists it under "Khi bị chặn:". */
const effects = {
  block: ["block.noPosting", "block.hidden", "block.stillManage", "block.emailed"],
  reject: ["reject.hidden", "reject.emailed"],
  unblock: ["unblock.shown", "unblock.emailed"],
  approve: ["approve.shown", "approve.emailed"],
} as const;

function Effects({ action }: { action: Action }) {
  const t = useTranslations("Admin.sellers");

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-muted p-3 text-body-sm text-foreground">
      <p className="text-body-sm-strong">{t(`${action}.effects`)}</p>
      <ul className="flex list-disc flex-col gap-1 ps-5">
        {effects[action].map((line) => (
          <li key={line}>{t(line)}</li>
        ))}
      </ul>
    </div>
  );
}

function ReasonDialog({
  action,
  seller,
  open,
  onOpenChange,
}: {
  action: "block" | "reject";
  seller: Store;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Admin.sellers");
  const id = useId();
  const [reason, setReason] = useState("");
  const { busy, reasonError, run } = useStoreAction(seller, action);
  const Icon = actionIcon[action];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-120">
        <form
          className="contents"
          onSubmit={(event) => {
            event.preventDefault();
            void run(reason.trim(), () => {
              setReason("");
              onOpenChange(false);
            });
          }}
        >
          <DialogHeader>
            <DialogTitle>{t(`${action}.title`, { name: seller.name })}</DialogTitle>
          </DialogHeader>
          <Field data-invalid={reasonError ? true : undefined}>
            <FieldLabel htmlFor={id}>{t(`${action}.reason`)}</FieldLabel>
            <Textarea
              id={id}
              value={reason}
              required
              maxLength={500}
              aria-invalid={reasonError ? true : undefined}
              onChange={(event) => setReason(event.target.value)}
            />
            {reasonError && <FieldError>{reasonError}</FieldError>}
          </Field>
          <Effects action={action} />
          {action === "block" && (
            <p className="flex items-center gap-2 text-body-sm text-muted-foreground">
              <RotateCcwIcon aria-hidden className="size-4" />
              {t("block.undo")}
            </p>
          )}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              {t("cancel")}
            </DialogClose>
            <Button type="submit" variant="danger" disabled={busy}>
              {busy ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Icon data-icon="inline-start" aria-hidden />
              )}
              {t(`${action}.confirm`)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmDialog({
  action,
  seller,
  open,
  onOpenChange,
}: {
  action: "unblock" | "approve";
  seller: Store;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Admin.sellers");
  const { busy, run } = useStoreAction(seller, action);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(`${action}.title`, { name: seller.name })}</AlertDialogTitle>
        </AlertDialogHeader>
        <Effects action={action} />
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            onClick={() => void run("", () => onOpenChange(false))}
          >
            {busy && <Spinner data-icon="inline-start" />}
            {t(`${action}.confirm`)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
