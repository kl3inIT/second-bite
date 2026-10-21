"use client";

import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

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
 * the sheet.
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
  const [step, setStep] = useState<"contact" | "check">();
  const [contact, setContact] = useState(readContact);
  const [shown, setShown] = useState<{ name?: true; phone?: true }>({});
  const checked = { name: contact.name.trim(), phone: normalizedPhone(contact.phone) };

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const problems = contactProblems(contact);
    setShown(problems);
    if (!problems.name && !problems.phone) setStep("check");
  }

  function confirm() {
    setStep(undefined);
    saveContact(checked);
    onConfirmed(checked);
  }

  return (
    <>
      <Button size="lg" onClick={() => setStep("contact")} disabled={pending}>
        {pending && <Spinner data-icon="inline-start" />}
        {t("order", { orders })}
      </Button>
      <Drawer open={step === "contact"} onOpenChange={(open) => !open && setStep(undefined)}>
        <DrawerContent>
          <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-5 pb-6">
            <div className="flex items-center justify-between gap-3">
              <DrawerTitle>{t("contactTitle")}</DrawerTitle>
              <DrawerClose render={<Button variant="ghost" size="icon" aria-label={t("close")} />}>
                <XIcon aria-hidden className="size-5" />
              </DrawerClose>
            </div>
            <DrawerDescription>{t("contactHint")}</DrawerDescription>
            <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
              <Field data-invalid={shown.name}>
                <FieldLabel htmlFor="order-name">{t("nameLabel")}</FieldLabel>
                <Input
                  id="order-name"
                  variant="pill"
                  value={contact.name}
                  onChange={(event) => setContact({ ...contact, name: event.target.value })}
                  maxLength={MAX_NAME_LENGTH}
                  autoComplete="name"
                  required
                  aria-invalid={shown.name}
                  aria-describedby={shown.name ? "order-name-problem" : undefined}
                />
                {shown.name && <FieldError id="order-name-problem">{t("nameInvalid")}</FieldError>}
              </Field>
              <Field data-invalid={shown.phone}>
                <FieldLabel htmlFor="order-phone">{t("phoneLabel")}</FieldLabel>
                <Input
                  id="order-phone"
                  variant="pill"
                  type="tel"
                  inputMode="tel"
                  value={contact.phone}
                  onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                  maxLength={20}
                  autoComplete="tel-national"
                  required
                  aria-invalid={shown.phone}
                  aria-describedby={shown.phone ? "order-phone-problem" : undefined}
                />
                {shown.phone && (
                  <FieldError id="order-phone-problem">{t("phoneInvalid")}</FieldError>
                )}
              </Field>
              <Button type="submit" size="lg">
                {t("contactSubmit")}
              </Button>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
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
