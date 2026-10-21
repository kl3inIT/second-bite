"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { useFieldValidity } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { setMyDisplayName } from "@/lib/api/generated";

/** As the server keeps it (server/internal/identity, maxDisplayNameLength). */
const MAX_LENGTH = 50;

/**
 * The display-name row of account settings (SEC-61): the name and "Sửa", then a field with "Lưu" and "Huỷ".
 * The rule is the server's (normalizeDisplayName), which trims the name and says in its own words when it refuses
 * one (SEC-28); the page reads the account again after saving, so the header and the account tab show the new
 * name. The label stays the row's term, so the field is composed by hand (docs/guidelines/web.md › Forms).
 */
export function DisplayNameRow({ name }: { name: string }) {
  const t = useTranslations("AccountSettings");
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <div className="flex min-h-12 items-center justify-between gap-4 px-3 py-2">
        <dt className="shrink-0 text-body-sm">{t("displayName")}</dt>
        <dd className="flex min-w-0 items-center gap-1">
          <span className="truncate text-body-sm text-muted-foreground">
            {name || t("noDisplayName")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(true)}
            aria-label={t("editName")}
          >
            <PencilIcon data-icon="inline-start" />
            {t("edit")}
          </Button>
        </dd>
      </div>
    );
  }
  return <NameForm name={name} onDone={() => setEditing(false)} />;
}

function NameForm({ name, onDone }: { name: string; onDone: () => void }) {
  const t = useTranslations("AccountSettings");
  const router = useRouter();

  const form = useAppForm({
    defaultValues: { displayName: name },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        displayName: z.string().trim().min(1, t("nameInvalid")).max(MAX_LENGTH, t("nameInvalid")),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await setMyDisplayName({ body: { displayName: value.displayName } });
      } catch (error) {
        refuse(formApi, error, { IDENTITY_DISPLAY_NAME_INVALID: "displayName" });
        return;
      }
      onDone();
      router.refresh();
    },
  });
  const control = `${form.formId}-name`;

  // The field takes the focus the person gave "Sửa", so typing goes straight into it.
  useEffect(() => {
    document.getElementById(control)?.focus();
  }, [control]);

  return (
    <div className="flex flex-col gap-2 px-3 py-3">
      <dt>
        <label htmlFor={control} className="text-body-sm">
          {t("displayName")}
        </label>
      </dt>
      <dd>
        <form
          id={form.formId}
          noValidate
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <form.AppField name="displayName">{() => <NameInput id={control} />}</form.AppField>
          <form.AppForm>
            <form.FormError fallback={t("nameFailed")} />
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(submitting) => (
                <div className="flex gap-2">
                  <form.SubmitButton pendingLabel={t("saving")}>{t("save")}</form.SubmitButton>
                  <Button type="button" variant="outline" disabled={submitting} onClick={onDone}>
                    {t("cancel")}
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </form.AppForm>
        </form>
      </dd>
    </div>
  );
}

/** The name's input, labelled by the row's term. */
function NameInput({ id }: { id: string }) {
  const { field, invalid, errors, ids } = useFieldValidity<string>();
  return (
    <>
      <Input
        id={id}
        name={field.name}
        value={field.state.value}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        maxLength={MAX_LENGTH}
        autoComplete="name"
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? ids.error : undefined}
      />
      {invalid && <FieldError id={ids.error} errors={errors} />}
    </>
  );
}
