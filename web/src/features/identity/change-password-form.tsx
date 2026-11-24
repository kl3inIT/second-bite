"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { CircleCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

import { refuse, submitAction, useAppForm } from "@/components/form/app-form";
import { FieldGroup } from "@/components/ui/field";
import { changeMyPassword } from "@/lib/api/generated";

/** The length of a password as the server counts it (server/internal/identity, minPasswordLength, maxPasswordLength). */
const PASSWORD_LENGTH = { min: 8, max: 128 } as const;

// Changing the password of an account made with a username (SEC-208): the password it has now is the only proof, as
// the account has no address to email a code to. The server's words for a refusal go under the field they concern,
// and its limit on wrong tries (shared with signing in) shows in the form's error. The account stays signed in here
// and ends its other sessions; the form clears itself and says so once the password is changed. It holds passwords, so
// it submits through `submitAction` (docs/guidelines/web.md › Forms): a press before the page hydrates is kept and
// sent once, never as a GET with the passwords in the address.
export function ChangePasswordForm() {
  const t = useTranslations("ChangePassword");
  const [done, setDone] = useState(false);

  const form = useAppForm({
    defaultValues: { currentPassword: "", newPassword: "", confirm: "" },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z
        .object({
          currentPassword: z.string().min(1, t("errors.current")),
          newPassword: z
            .string()
            .min(PASSWORD_LENGTH.min, t("errors.password"))
            .max(PASSWORD_LENGTH.max, t("errors.password")),
          confirm: z.string(),
        })
        .refine((value) => value.newPassword === value.confirm, {
          path: ["confirm"],
          message: t("errors.mismatch"),
        }),
    },
    onSubmit: async ({ value, formApi }) => {
      setDone(false);
      try {
        await changeMyPassword({
          body: { currentPassword: value.currentPassword, newPassword: value.newPassword },
        });
      } catch (error) {
        formApi.setFieldValue("currentPassword", "");
        refuse(formApi, error, {
          IDENTITY_PASSWORD_INCORRECT: "currentPassword",
          IDENTITY_PASSWORD_INVALID: "newPassword",
        });
        return;
      }
      formApi.reset();
      setDone(true);
    },
  });

  return (
    <form id={form.formId} noValidate action={submitAction(form)}>
      <FieldGroup>
        <form.AppField name="currentPassword">
          {(field) => (
            <field.TextField
              label={t("currentLabel")}
              type="password"
              autoComplete="current-password"
              required
              placeholder={t("currentPlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppField name="newPassword">
          {(field) => (
            <field.TextField
              label={t("newLabel")}
              type="password"
              autoComplete="new-password"
              required
              placeholder={t("newPlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppField name="confirm">
          {(field) => (
            <field.TextField
              label={t("confirmLabel")}
              type="password"
              autoComplete="new-password"
              required
              placeholder={t("confirmPlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.FormError fallback={t("failed")} />
          {done && (
            <output className="flex items-center gap-2 text-body-sm-strong">
              <CircleCheckIcon aria-hidden className="size-5 shrink-0 text-success" />
              {t("done")}
            </output>
          )}
          <form.SubmitButton size="lg" pendingLabel={t("saving")}>
            {t("submit")}
          </form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
