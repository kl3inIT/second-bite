"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { type AccountBody, grantAdmin } from "@/lib/api/generated";

import { toast } from "@/components/ui/toast";
import { addAdminProblem, adminRefusal } from "./admins";

/**
 * "Thêm quản trị viên" and its dialog (Figma AD-AM2): one email, checked once the field is left (an address, and
 * not an admin already), then `POST /admin/admins`. The address must have signed in once with a code; the backend
 * refuses one that has not (`IDENTITY_ADDRESS_UNPROVEN`), which a one-line toast says.
 */
export function AddAdmin({ admins }: { admins: readonly AccountBody[] }) {
  const t = useTranslations("admin.settings.admins");
  const cancel = useTranslations("admin.shell.confirm")("cancel");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [left, setLeft] = useState(false);
  const [pending, startGranting] = useTransition();
  const problem = email.trim() ? addAdminProblem(email, admins) : null;
  const error = left && problem ? t(`problems.${problem}`) : undefined;

  function openChange(next: boolean) {
    if (pending) return;
    setOpen(next);
    if (!next) {
      setEmail("");
      setLeft(false);
    }
  }

  function grant() {
    const address = email.trim();
    if (!address || problem) {
      setLeft(true);
      return;
    }
    if (pending) return;
    startGranting(async () => {
      try {
        await grantAdmin({ body: { email: address } });
        toast.add({ title: t("granted", { email: address }), type: "success", timeout: 5000 });
        setOpen(false);
        setEmail("");
        setLeft(false);
        router.refresh();
      } catch (error) {
        const code = error instanceof ApiError ? error.code : undefined;
        toast.add({
          title: t(`refusals.${adminRefusal(code)}`, { email: address }),
          type: "error",
          timeout: 5000,
        });
      }
    });
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t("add")}</Button>
      <Dialog open={open} onOpenChange={openChange}>
        <DialogContent>
          <form
            noValidate
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              grant();
            }}
          >
            <DialogHeader>
              <DialogTitle>{t("add")}</DialogTitle>
            </DialogHeader>
            <Field data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor="add-admin-email">{t("email")}</FieldLabel>
              <Input
                id="add-admin-email"
                type="email"
                autoComplete="off"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setLeft(true)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "add-admin-email-error" : undefined}
              />
              {error && <FieldError id="add-admin-email-error">{error}</FieldError>}
              <FieldDescription>{t("takesEffect")}</FieldDescription>
            </Field>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" disabled={pending} />}>
                {cancel}
              </DialogClose>
              <Button type="submit" disabled={pending || !email.trim() || problem !== null}>
                {pending && <Spinner data-icon="inline-start" />}
                {t("add")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
