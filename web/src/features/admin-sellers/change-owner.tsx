"use client";

import { revalidateLogic } from "@tanstack/react-form";
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
import { changeSellerOwner } from "@/lib/api/generated";

/**
 * Hands a store to the account of an address (SEC-162, Figma AD-QD4b, AD-QD4c), so a store the team opened is run
 * by its owner: an address that never signed in gets its account at once, and the previous owner stays on as
 * staff. The server's refusal of the address stays under it.
 */
export function ChangeOwner({ sellerId, storeName }: { sellerId: string; storeName: string }) {
  const t = useTranslations("Admin.sellers.detail.changeOwner");
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
          .pipe(z.email({ message: t("errors.email") })),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      const email = value.email.trim();
      try {
        await changeSellerOwner({ path: { sellerId }, body: { email } });
      } catch (error) {
        refuse(formApi, error, {
          IDENTITY_EMAIL_INVALID: "email",
          IDENTITY_ADDRESS_UNPROVEN: "email",
          SELLER_ALREADY_OWNER: "email",
          SELLER_NEW_OWNER_LIMIT_REACHED: "email",
        });
        return;
      }
      toast.add({ type: "success", title: t("done", { email, store: storeName }) });
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
      <DialogTrigger render={<Button variant="outline" size="sm" className="self-start" />}>
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
            <DialogTitle>{t("title", { store: storeName })}</DialogTitle>
            <DialogDescription>{t("body")}</DialogDescription>
          </DialogHeader>
          <form.AppField name="email">
            {(field) => (
              <field.TextField
                label={t("email")}
                required
                type="email"
                autoComplete="off"
                inputMode="email"
              />
            )}
          </form.AppField>
          <form.AppForm>
            <form.FormError fallback={t("failed")} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t("cancel")}
              </Button>
              <form.SubmitButton>{t("confirm")}</form.SubmitButton>
            </DialogFooter>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
}
