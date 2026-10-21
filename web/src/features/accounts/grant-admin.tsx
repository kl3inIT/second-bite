"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { useRouter } from "@/i18n/navigation";
import { grantAdmin } from "@/lib/api/generated";

/**
 * Makes an address an admin (SEC-75), from the head of the accounts: the one way to name someone who has
 * never signed in, as an account exists only from its first sign-in. The address is checked as it is
 * typed once sent; the server's refusal of the address stays under it. An account already listed is made
 * an admin from its row's menu instead.
 */
export function GrantAdmin() {
  const t = useTranslations("Admin.admins.grant");
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useAppForm({
    defaultValues: { email: "" },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        email: z
          .string()
          .trim()
          .pipe(z.email({ message: t("invalid") })),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      const email = value.email.trim();
      try {
        await grantAdmin({ body: { email } });
      } catch (error) {
        refuse(formApi, error, { IDENTITY_EMAIL_INVALID: "email" });
        return;
      }
      toast.add({ type: "success", title: t("done", { email }) });
      setOpen(false);
      formApi.reset();
      router.refresh();
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
      }}
    >
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" aria-hidden />
        {t("open")}
      </DialogTrigger>
      <DialogContent>
        <form
          id={form.formId}
          noValidate
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>
          <form.AppField name="email">
            {(field) => (
              <field.TextField
                label={t("email")}
                required
                type="email"
                autoComplete="off"
                inputMode="email"
                placeholder={t("placeholder")}
              />
            )}
          </form.AppField>
          <form.AppForm>
            <form.FormError title={t("failed")} fallback={t("unreachable")} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t("cancel")}
              </Button>
              <form.SubmitButton>{t("submit")}</form.SubmitButton>
            </DialogFooter>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
}
