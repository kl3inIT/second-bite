"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { toast } from "@/components/ui/toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { sendSellerFeedback } from "@/lib/api/generated";

/** The server's bound on feedback (server/internal/seller, maxFeedbackLetters). */
const TEXT_LIMIT = 1000;

/**
 * "Góp ý cho Second Bite" (SEC-82, Figma G1): what is hard or missing, told to the team by the store's people, owner
 * or staff; a dialog on a computer and a sheet from the foot on a phone, as the store's other questions. Sent, it
 * closes with a thank-you; the admins read it on the report page.
 */
export function StoreFeedback({
  sellerId,
  open,
  onOpenChange,
}: {
  sellerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("StoreFeedback");
  const phone = useIsMobile();
  const form = open && <FeedbackForm sellerId={sellerId} onDone={() => onOpenChange(false)} />;

  return phone ? (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-xl flex-col gap-3 px-5 pt-2.5 pb-8.5">
          <DrawerTitle>{t("title")}</DrawerTitle>
          <DrawerDescription>{t("body")}</DrawerDescription>
          {form}
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-120">
        <DialogTitle size="headline">{t("title")}</DialogTitle>
        <DialogDescription>{t("body")}</DialogDescription>
        {form}
      </DialogContent>
    </Dialog>
  );
}

function FeedbackForm({ sellerId, onDone }: { sellerId: string; onDone: () => void }) {
  const t = useTranslations("StoreFeedback");

  const form = useAppForm({
    defaultValues: { text: "" },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        text: z.string().trim().min(1, t("errors.text")).max(TEXT_LIMIT, t("errors.text")),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await sendSellerFeedback({ path: { sellerId }, body: { text: value.text.trim() } });
      } catch (error) {
        refuse(formApi, error);
        return;
      }
      toast.add({ type: "success", title: t("thanks") });
      onDone();
    },
  });

  return (
    <form
      id={form.formId}
      noValidate
      className="flex flex-col gap-3.5"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.AppField name="text">
        {(field) => (
          <field.TextareaField
            label={t("label")}
            placeholder={t("placeholder")}
            maxLength={TEXT_LIMIT}
          />
        )}
      </form.AppField>
      <form.AppForm>
        <form.FormError fallback={t("failed")} />
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(submitting) => (
            <div className="flex flex-col gap-2 pt-1.5 md:grid md:grid-cols-2 md:gap-3 md:pt-0">
              <form.SubmitButton size="lg">{t("send")}</form.SubmitButton>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="md:order-first"
                disabled={submitting}
                onClick={onDone}
              >
                {t("later")}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}
