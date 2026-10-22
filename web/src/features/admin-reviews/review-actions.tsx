"use client";

import { BanIcon, EllipsisIcon, EyeIcon, ReceiptTextIcon } from "lucide-react";
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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { Link, useRouter } from "@/i18n/navigation";
import { failureOf } from "@/lib/api/client";
import { hideReview, showReview, type AdminReviewBody } from "@/lib/api/generated";

/**
 * A review row's "⋯" (Figma AD-DG1, AD-DG2): open its order, and hide the review with an optional reason or
 * show it again after asking. Each ends in a notice and the list read again (AD-DG3).
 */
export function ReviewActions({ review }: { review: AdminReviewBody }) {
  const t = useTranslations("Admin.reviews");
  const [open, setOpen] = useState<"hide" | "show" | null>(null);
  const close = (next: boolean) => !next && setOpen(null);
  const hidden = review.hiddenAt !== undefined;

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("actions", { name: review.customerName })}
            />
          }
        >
          <EllipsisIcon aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link href={`/admin/orders/${review.orderId}`} />}>
              <ReceiptTextIcon aria-hidden />
              {t("viewOrder")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {hidden ? (
              <DropdownMenuItem onClick={() => setOpen("show")}>
                <EyeIcon aria-hidden />
                {t("show.menu")}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem variant="destructive" onClick={() => setOpen("hide")}>
                <BanIcon aria-hidden />
                {t("hide.menu")}
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <HideDialog review={review} open={open === "hide"} onOpenChange={close} />
      <ShowDialog review={review} open={open === "show"} onOpenChange={close} />
    </div>
  );
}

/** Runs hide or show, then tells how it went and reads the list again. */
function useReviewAction(review: AdminReviewBody, action: "hide" | "show") {
  const t = useTranslations("Admin.reviews");
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const run = async (reason: string, done: () => void) => {
    setBusy(true);
    try {
      const path = { orderId: review.orderId };
      if (action === "hide") await hideReview({ path, body: reason ? { reason } : {} });
      else await showReview({ path });
      toast.add({ type: "success", title: t(`${action}.done`, { name: review.customerName }) });
    } catch (error) {
      const { detail, reference } = failureOf(error);
      toast.add({
        type: "error",
        title: [detail ?? t("unreachable"), reference && `(${reference})`]
          .filter(Boolean)
          .join(" "),
      });
    } finally {
      setBusy(false);
      done();
      router.refresh();
    }
  };

  return { busy, run };
}

function HideDialog({
  review,
  open,
  onOpenChange,
}: {
  review: AdminReviewBody;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Admin.reviews");
  const id = useId();
  const [reason, setReason] = useState("");
  const { busy, run } = useReviewAction(review, "hide");

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
            <DialogTitle>{t("hide.title", { name: review.customerName })}</DialogTitle>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor={id}>{t("hide.reason")}</FieldLabel>
            <Textarea
              id={id}
              value={reason}
              maxLength={500}
              aria-describedby={`${id}-hint`}
              onChange={(event) => setReason(event.target.value)}
            />
            <FieldDescription id={`${id}-hint`} className="flex justify-between">
              <span>{t("hide.hint")}</span>
              <span className="tabular-nums">{t("hide.length", { length: reason.length })}</span>
            </FieldDescription>
          </Field>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              {t("cancel")}
            </DialogClose>
            <Button type="submit" variant="danger" disabled={busy}>
              {busy ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <BanIcon data-icon="inline-start" aria-hidden />
              )}
              {t("hide.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ShowDialog({
  review,
  open,
  onOpenChange,
}: {
  review: AdminReviewBody;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Admin.reviews");
  const { busy, run } = useReviewAction(review, "show");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("show.title", { name: review.customerName })}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            onClick={() => void run("", () => onOpenChange(false))}
          >
            {busy && <Spinner data-icon="inline-start" />}
            {t("show.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
