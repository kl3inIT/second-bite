"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

import { useAppForm } from "@/components/form/app-form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  contactProblems,
  groupedPhone,
  MAX_NAME_LENGTH,
  normalizedPhone,
  readContact,
  saveContact,
  type Contact,
} from "./contact";

/**
 * "Đặt món" on the confirmation (Figma K5) and who collects (SEC-76 › decision 7): a sheet over the cart asks
 * a name and a phone number, remembered in this browser, then a dialog checks the number once before
 * `onConfirmed` orders. Nothing is sent to the phone; the seller only calls it if needed. "Sửa" goes back to
 * the sheet. From 768px the same two fields are in a dialog in the middle of the page, not a sheet from the foot.
 * The two fields are a form (docs/guidelines/web.md › Forms) whose rules are `contactProblems`, the server's.
 */
export function OrderButton({
  orders,
  pending,
  onConfirmed,
}: {
  orders: number;
  pending: boolean;
  onConfirmed: (contact: Contact) => void;
}) {
  const t = useTranslations("Cart");
  const phone = useIsMobile();
  const [step, setStep] = useState<"contact" | "check">();
  const [stored] = useState(readContact);
  const [checked, setChecked] = useState<Contact>({ name: "", phone: "" });

  const form = useAppForm({
    defaultValues: stored,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        name: z.string().refine((name) => !contactProblems({ name, phone: "" }).name, {
          message: t("nameInvalid"),
        }),
        phone: z.string().refine((phone) => !contactProblems({ name: "", phone }).phone, {
          message: t("phoneInvalid"),
        }),
      }),
    },
    onSubmit: ({ value }) => {
      setChecked({ name: value.name.trim(), phone: normalizedPhone(value.phone) });
      setStep("check");
    },
  });

  function confirm() {
    setStep(undefined);
    saveContact(checked);
    onConfirmed(checked);
  }

  const contactForm = (
    <form
      id={form.formId}
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.AppField name="name">
        {(field) => (
          <field.TextField
            label={t("nameLabel")}
            variant="pill"
            maxLength={MAX_NAME_LENGTH}
            autoComplete="name"
            required
          />
        )}
      </form.AppField>
      <form.AppField name="phone">
        {(field) => (
          <field.TextField
            label={t("phoneLabel")}
            variant="pill"
            type="tel"
            inputMode="tel"
            maxLength={20}
            autoComplete="tel-national"
            required
          />
        )}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton size="lg">{t("contactSubmit")}</form.SubmitButton>
      </form.AppForm>
    </form>
  );

  return (
    <>
      <Button size="lg" onClick={() => setStep("contact")} disabled={pending}>
        {pending && <Spinner data-icon="inline-start" />}
        {t("order", { orders })}
      </Button>
      {phone ? (
        <Drawer open={step === "contact"} onOpenChange={(open) => !open && setStep(undefined)}>
          <DrawerContent>
            <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-5 pb-6">
              <div className="flex items-center justify-between gap-3">
                <DrawerTitle>{t("contactTitle")}</DrawerTitle>
                <DrawerClose
                  render={<Button variant="ghost" size="icon" aria-label={t("close")} />}
                >
                  <XIcon aria-hidden className="size-5" />
                </DrawerClose>
              </div>
              <DrawerDescription>{t("contactHint")}</DrawerDescription>
              {contactForm}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={step === "contact"} onOpenChange={(open) => !open && setStep(undefined)}>
          <DialogContent>
            <DialogTitle size="headline">{t("contactTitle")}</DialogTitle>
            <DialogDescription>{t("contactHint")}</DialogDescription>
            {contactForm}
          </DialogContent>
        </Dialog>
      )}
      <AlertDialog open={step === "check"} onOpenChange={(open) => !open && setStep(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-display text-page-title text-foreground">
                {groupedPhone(checked.phone)}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="ghost" size="lg" onClick={() => setStep("contact")}>
              {t("confirmEdit")}
            </Button>
            <Button size="lg" onClick={confirm}>
              {t("confirmYes")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
