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
import { revalidateLogic } from "@tanstack/react-form";
import { useState, useTransition } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { useFieldValidity } from "@/components/form/form-context";

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
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
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
 * Every action on a store, in one menu: a row's "⋯" (Figma AD-Q2, AD-Q8, AD-Q10), which also opens the store's
 * page, and the "⋯" on that page (`onPage`). What the store's status allows. Blocking and rejecting ask a reason
 * the owner is emailed (AD-Q5, AD-Q10c); unblocking and approving ask first, since they email the owner too
 * (AD-Q8b, AD-Q10b). Each ends in a notice and the list read again (AD-Q6, AD-Q9, AD-Q11).
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

/** Says how an action went, in a toast, and reads the list again. */
function useStoreAction(seller: Store, action: Action) {
  const t = useTranslations("Admin.sellers");
  const router = useRouter();

  const succeeded = () => {
    toast.add({ type: "success", title: t(`${action}.done`, { name: seller.name }) });
    router.refresh();
  };
  const failed = (error: unknown) => {
    const { detail, reference } = failureOf(error);
    toast.add({
      type: "error",
      title: [detail ?? t("unreachable"), reference && `(${reference})`].filter(Boolean).join(" "),
    });
    router.refresh();
  };

  return { succeeded, failed };
}

/** The server's rule for a reason (server/internal/seller, minReasonRunes and maxReasonRunes). */
const REASON_MIN = 10;
const REASON_MAX = 500;

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-120">
        {open && <ReasonForm action={action} seller={seller} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

// Blocking and rejecting ask the owner a reason (docs/guidelines/web.md › Forms), under the server's rule. A reason
// the server refuses stays at its field; any other failure is said in a toast, and the dialog closes.
function ReasonForm({
  action,
  seller,
  onDone,
}: {
  action: "block" | "reject";
  seller: Store;
  onDone: () => void;
}) {
  const t = useTranslations("Admin.sellers");
  const { succeeded, failed } = useStoreAction(seller, action);
  const Icon = actionIcon[action];

  const form = useAppForm({
    defaultValues: { reason: "" },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        reason: z
          .string()
          .trim()
          .refine(
            (reason) =>
              Array.from(reason).length >= REASON_MIN && Array.from(reason).length <= REASON_MAX,
            t("reasonInvalid"),
          ),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      const path = { sellerId: seller.id };
      const body = { reason: value.reason.trim() };
      try {
        if (action === "block") await blockSeller({ path, body });
        else await rejectSeller({ path, body });
      } catch (error) {
        if (error instanceof ApiError && error.code === "SELLER_REASON_INVALID") {
          refuse(formApi, error, { SELLER_REASON_INVALID: "reason" });
          return;
        }
        failed(error);
        onDone();
        return;
      }
      succeeded();
      onDone();
    },
  });

  return (
    <form
      id={form.formId}
      noValidate
      className="contents"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <DialogHeader>
        <DialogTitle>{t(`${action}.title`, { name: seller.name })}</DialogTitle>
      </DialogHeader>
      <form.AppField name="reason">
        {() => <ReasonField label={t(`${action}.reason`)} />}
      </form.AppField>
      <form.AppForm>
        <DialogFooter>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(submitting) => (
              <DialogClose
                render={<Button type="button" variant="outline" disabled={submitting} />}
              >
                {t("cancel")}
              </DialogClose>
            )}
          </form.Subscribe>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(submitting) => (
              <Button type="submit" variant="danger" disabled={submitting}>
                {submitting ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <Icon data-icon="inline-start" aria-hidden />
                )}
                {t(`${action}.confirm`)}
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </form.AppForm>
    </form>
  );
}

/** The reason, with how long it may be and how long it is, or why it is refused. */
function ReasonField({ label }: { label: string }) {
  const t = useTranslations("Admin.sellers");
  const { field, invalid, errors, ids } = useFieldValidity<string>();
  const reason = field.state.value;
  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={ids.control}>{label}</FieldLabel>
      <Textarea
        id={ids.control}
        name={field.name}
        value={reason}
        maxLength={REASON_MAX}
        aria-required
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? ids.error : ids.hint}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      {invalid ? (
        <FieldError id={ids.error} errors={errors} />
      ) : (
        <FieldDescription id={ids.hint} className="flex justify-between">
          <span>{t("reasonHint")}</span>
          <span className="tabular-nums">{t("reasonLength", { length: reason.length })}</span>
        </FieldDescription>
      )}
    </Field>
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
  const { succeeded, failed } = useStoreAction(seller, action);
  const [busy, startTransition] = useTransition();

  // Unblocking sets the store active again, as approving does.
  const run = () =>
    startTransition(async () => {
      try {
        await approveSeller({ path: { sellerId: seller.id } });
        succeeded();
      } catch (error) {
        failed(error);
      }
      onOpenChange(false);
    });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t(`${action}.title`, { name: seller.name })}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction disabled={busy} onClick={run}>
            {busy && <Spinner data-icon="inline-start" />}
            {t(`${action}.confirm`)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
