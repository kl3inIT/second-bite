"use client";

import { revalidateLogic, useForm, type AnyFieldApi } from "@tanstack/react-form";
import { CircleAlertIcon, CircleCheckIcon, TriangleAlertIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { z } from "zod";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRouter } from "@/i18n/navigation";
import { ApiError, failureOf } from "@/lib/api/client";
import { saveEmailSettings, sendTestEmail, type EmailSettingsBody } from "@/lib/api/generated";

import {
  bodyOf,
  dropsPassword,
  emailSettingsSchema,
  valuesOf,
  type EmailSettingsValues,
} from "./email-settings-schema";

type FieldName = keyof EmailSettingsValues;

/** The fields in the order the page shows them. */
const fieldOrder: FieldName[] = [
  "senderAddress",
  "senderName",
  "smtpHost",
  "smtpPort",
  "smtpSecurity",
  "smtpUsername",
  "smtpPassword",
  "brevoApiKey",
];

/** The field a body member the server refused names (`#/senderAddress`), when the form has it. */
function fieldOfPointer(pointer: string | undefined): FieldName | undefined {
  const name = pointer?.replace(/^#\//, "");
  const names: readonly string[] = Object.keys(valuesOf(undefined));
  return name && names.includes(name) ? (name as FieldName) : undefined;
}

// Who delivers the email that signs people in and tells owners about their stores (SEC-75, Figma AD-E1…E4,
// AD-CS4…CS7): the provider, the sender, the provider's own settings, then a test email. The saved settings
// come from the server with their version; a save carries it (If-Match), or If-None-Match: * when none are
// saved, so two admins never overwrite each other. A secret is never shown: empty keeps the stored one.
export function EmailSettingsForm({
  saved,
  version,
  adminEmail,
}: {
  saved: EmailSettingsBody | undefined;
  version: string | undefined;
  adminEmail: string;
}) {
  const t = useTranslations("Admin.email");
  const format = useFormatter();
  const router = useRouter();
  const [conflict, setConflict] = useState(false);
  const [refusal, setRefusal] = useState<{ detail?: string; reference?: string }>();

  const form = useForm({
    defaultValues: valuesOf(saved),
    // Checked when saved, then again on each change, so a fixed field clears at once.
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: emailSettingsSchema(
        {
          senderAddress: t("errors.senderAddress"),
          senderName: t("errors.senderName"),
          smtpHost: t("errors.smtpHost"),
          smtpPort: t("errors.smtpPort"),
          passwordNeeded: t("errors.passwordNeeded"),
          passwordDropped: t("errors.passwordDropped"),
          noTls: t("errors.noTls"),
          brevoKey: t("errors.brevoKey"),
        },
        saved,
      ),
    },
    // The first field the rules refuse takes the focus, so a keyboard or screen reader lands on it.
    onSubmitInvalid: ({ formApi }) => {
      const first = fieldOrder.find((name) => !formApi.getFieldMeta(name)?.isValid);
      if (first) document.getElementById(`email-${first}`)?.focus();
    },
    onSubmit: async ({ value }) => {
      setConflict(false);
      setRefusal(undefined);
      try {
        await saveEmailSettings({
          body: bodyOf(value),
          headers: version ? { "If-Match": version } : { "If-None-Match": "*" },
        });
      } catch (error) {
        if (error instanceof ApiError && error.code === "PLATFORM_CHANGED_SINCE_READ") {
          setConflict(true);
          return;
        }
        const named = error instanceof ApiError ? error.violations : [];
        for (const violation of named) {
          const field = fieldOfPointer(violation.pointer);
          if (field) {
            form.setFieldMeta(field, (meta) => ({
              ...meta,
              errorMap: { ...meta.errorMap, onServer: { message: violation.detail } },
            }));
          }
        }
        setRefusal(failureOf(error));
        return;
      }
      toast.add({ type: "success", title: t("footer.saved"), description: t("footer.savedHint") });
      // The page reads the settings again with their new version; the form starts over from them.
      router.refresh();
    },
  });

  return (
    <form
      noValidate
      aria-labelledby="email-settings-title"
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <h2 id="email-settings-title" className="text-headline text-foreground">
        {t("title")}
      </h2>

      {conflict && (
        <Alert variant="warning">
          <TriangleAlertIcon />
          <AlertTitle>{t("conflict.title")}</AlertTitle>
          <AlertDescription>{t("conflict.body")}</AlertDescription>
          <AlertAction>
            <Button type="button" variant="secondary" size="sm" onClick={() => router.refresh()}>
              {t("conflict.reload")}
            </Button>
          </AlertAction>
        </Alert>
      )}

      {refusal && (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>{t("refused")}</AlertTitle>
          <AlertDescription>
            {refusal.detail ?? t("failed")}
            {refusal.reference && ` (${t("reference", { reference: refusal.reference })})`}
          </AlertDescription>
        </Alert>
      )}

      <Card size="lg">
        <CardHeader>
          <CardTitle>{t("provider.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <form.Field name="provider">
              {(field) => (
                <ToggleGroup
                  variant="segment"
                  aria-label={t("provider.label")}
                  value={[field.state.value]}
                  onValueChange={(chosen: string[]) => {
                    const next = chosen[0];
                    if (next === "smtp" || next === "brevo") field.handleChange(next);
                  }}
                >
                  <ToggleGroupItem value="smtp">{t("provider.smtp")}</ToggleGroupItem>
                  <ToggleGroupItem value="brevo">{t("provider.brevo")}</ToggleGroupItem>
                </ToggleGroup>
              )}
            </form.Field>
            {saved ? (
              <Badge variant="success">
                <CircleCheckIcon data-icon="inline-start" />
                {t("provider.using", { provider: t(`provider.${saved.provider}`) })}
              </Badge>
            ) : (
              <Badge variant="warning">
                <TriangleAlertIcon data-icon="inline-start" />
                {t("provider.notConfigured")}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card size="lg">
        <CardHeader>
          <CardTitle>{t("sender.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <form.Field name="senderAddress">
                {(field) => (
                  <TextField
                    field={field}
                    label={t("sender.address")}
                    type="email"
                    autoComplete="off"
                  />
                )}
              </form.Field>
              <form.Field name="senderName">
                {(field) => <TextField field={field} label={t("sender.name")} autoComplete="off" />}
              </form.Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <form.Subscribe selector={(state) => state.values.provider}>
        {(provider) =>
          provider === "smtp" ? (
            <Card size="lg">
              <CardHeader>
                <CardTitle>{t("smtp.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <div className="grid gap-4 md:grid-cols-2">
                    <form.Field name="smtpHost">
                      {(field) => (
                        <TextField field={field} label={t("smtp.host")} autoComplete="off" />
                      )}
                    </form.Field>
                    <form.Field name="smtpPort">
                      {(field) => (
                        <TextField
                          field={field}
                          label={t("smtp.port")}
                          inputMode="numeric"
                          autoComplete="off"
                        />
                      )}
                    </form.Field>
                    <form.Field name="smtpSecurity">
                      {(field) => (
                        <Field
                          className="md:col-span-2"
                          data-invalid={!field.state.meta.isValid || undefined}
                        >
                          <FieldLabel id="smtp-security-label">{t("smtp.security")}</FieldLabel>
                          <ToggleGroup
                            id="email-smtpSecurity"
                            variant="segment"
                            aria-labelledby="smtp-security-label"
                            value={[field.state.value]}
                            onValueChange={(chosen: string[]) => {
                              const next = chosen[0];
                              if (next === "starttls" || next === "tls" || next === "none")
                                field.handleChange(next);
                            }}
                          >
                            <ToggleGroupItem value="none">{t("smtp.none")}</ToggleGroupItem>
                            <ToggleGroupItem value="starttls">{t("smtp.starttls")}</ToggleGroupItem>
                            <ToggleGroupItem value="tls">{t("smtp.tls")}</ToggleGroupItem>
                          </ToggleGroup>
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    </form.Field>
                    <form.Field name="smtpUsername">
                      {(field) => (
                        <TextField field={field} label={t("smtp.user")} autoComplete="off" />
                      )}
                    </form.Field>
                    <form.Subscribe selector={(state) => dropsPassword(state.values, saved)}>
                      {(drops) => (
                        <form.Field name="smtpPassword">
                          {(field) => (
                            <TextField
                              field={field}
                              label={t("smtp.password")}
                              type="password"
                              autoComplete="new-password"
                              placeholder={
                                saved?.smtpPasswordSet && !drops ? t("kept") : t("smtp.passwordNew")
                              }
                              warning={drops ? t("errors.passwordDropped") : undefined}
                            />
                          )}
                        </form.Field>
                      )}
                    </form.Subscribe>
                  </div>
                </FieldGroup>
              </CardContent>
            </Card>
          ) : (
            <Card size="lg">
              <CardHeader>
                <CardTitle>{t("brevo.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <form.Field name="brevoApiKey">
                    {(field) => (
                      <TextField
                        field={field}
                        label={t("brevo.key")}
                        type="password"
                        autoComplete="off"
                        placeholder={saved?.brevoApiKeySet ? t("kept") : t("brevo.keyNew")}
                      />
                    )}
                  </form.Field>
                </FieldGroup>
              </CardContent>
            </Card>
          )
        }
      </form.Subscribe>

      <form.Subscribe selector={(state) => state.isDirty}>
        {(dirty) => <TestEmail configured={Boolean(saved)} dirty={dirty} adminEmail={adminEmail} />}
      </form.Subscribe>

      <form.Subscribe selector={(state) => [state.isDirty, state.isSubmitting] as const}>
        {([dirty, submitting]) => (
          <Card size="lg">
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <p className="flex-1 text-label text-muted-foreground" aria-live="polite">
                  {dirty
                    ? t("footer.dirty")
                    : saved
                      ? t("footer.updated", {
                          time: format.dateTime(new Date(saved.updatedAt), "time"),
                          day: format.dateTime(new Date(saved.updatedAt), "day"),
                        })
                      : t("footer.never")}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!dirty || submitting}
                  onClick={() => form.reset()}
                >
                  {t("footer.cancel")}
                </Button>
                <Button type="submit" disabled={(saved !== undefined && !dirty) || submitting}>
                  {submitting && <Spinner data-icon="inline-start" />}
                  {saved ? t("footer.save") : t("footer.create")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form.Subscribe>
    </form>
  );
}

/** One text field of the form, its label, its errors (the schema's and the server's), and a warning before them. */
function TextField({
  field,
  label,
  warning,
  ...input
}: {
  field: AnyFieldApi;
  label: string;
  warning?: string;
} & Pick<React.ComponentProps<"input">, "type" | "autoComplete" | "inputMode" | "placeholder">) {
  const meta = field.state.meta;
  const invalid = !meta.isValid || warning !== undefined;
  const id = `email-${field.name}`;
  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={field.name}
        value={String(field.state.value)}
        aria-invalid={invalid || undefined}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        {...input}
      />
      {meta.isValid && warning ? (
        <FieldError>{warning}</FieldError>
      ) : (
        <FieldError errors={meta.errors} />
      )}
    </Field>
  );
}

// The test email (Figma AD-E1…E3): through the settings saved, to the admin's own address or one typed, so an
// admin sees a mailbox elsewhere receive it. It waits while the form has changes, which it would not use.
function TestEmail({
  configured,
  dirty,
  adminEmail,
}: {
  configured: boolean;
  dirty: boolean;
  adminEmail: string;
}) {
  const t = useTranslations("Admin.email.test");
  const [to, setTo] = useState(adminEmail);
  const [invalid, setInvalid] = useState(false);
  const [failure, setFailure] = useState<{ to: string; detail?: string; reference?: string }>();
  const [sending, startSending] = useTransition();
  const blocked = !configured || dirty;

  function send() {
    const address = to.trim();
    if (!z.email().safeParse(address).success) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setFailure(undefined);
    startSending(async () => {
      try {
        await sendTestEmail({ body: { to: address } });
        toast.add({
          type: "success",
          title: t("sent", { to: address }),
          description: t("sentHint"),
        });
      } catch (error) {
        setFailure({ to: address, ...failureOf(error) });
      }
    });
  }

  return (
    <Card size="lg">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start">
            <Field className="flex-1" data-invalid={invalid || undefined}>
              <FieldLabel htmlFor="email-test-to">{t("to")}</FieldLabel>
              <Input
                id="email-test-to"
                type="email"
                autoComplete="email"
                value={to}
                aria-invalid={invalid || undefined}
                aria-describedby="email-test-hint"
                onChange={(event) => setTo(event.target.value)}
                onKeyDown={(event) => {
                  // Enter here sends the test, not the settings form around it.
                  if (event.key === "Enter") {
                    event.preventDefault();
                    if (!blocked) send();
                  }
                }}
              />
              {invalid ? (
                <FieldError>{t("invalid")}</FieldError>
              ) : (
                <FieldDescription id="email-test-hint">
                  {!configured ? t("notConfigured") : dirty ? t("saveFirst") : t("hint")}
                </FieldDescription>
              )}
            </Field>
            <Button
              type="button"
              variant="outline"
              className="md:mt-6"
              disabled={blocked || sending}
              onClick={send}
            >
              {sending && <Spinner data-icon="inline-start" />}
              {t("send")}
            </Button>
          </div>
          {failure && (
            <Alert variant="destructive">
              <CircleAlertIcon />
              <AlertTitle>{t("failed", { to: failure.to })}</AlertTitle>
              <AlertDescription>
                {failure.detail ?? t("unknown")}
                {failure.reference && ` (${t("reference", { reference: failure.reference })})`}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
