"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { CircleCheckIcon, TriangleAlertIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { useFieldValidity } from "@/components/form/form-context";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { saveEmailSettings, sendTestEmail, type EmailSettingsBody } from "@/lib/api/generated";

import { bodyOf, dropsPassword, emailSettingsSchema, valuesOf } from "./email-settings-schema";

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

  const form = useAppForm({
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
    onSubmit: async ({ value, formApi }) => {
      setConflict(false);
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
        refuse(formApi, error);
        return;
      }
      toast.add({ type: "success", title: t("footer.saved"), description: t("footer.savedHint") });
      // The page reads the settings again with their new version; the form starts over from them.
      router.refresh();
    },
  });

  // The settings are one form and the test email another, so Enter in the test address sends the test; the
  // save at the foot names the settings' form (`form` attribute), as it sits after the test.
  return (
    <div className="flex flex-col gap-5">
      <form
        id={form.formId}
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

        <form.AppForm>
          <form.FormError title={t("refused")} fallback={t("failed")} />
        </form.AppForm>

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
                <form.AppField name="senderAddress">
                  {(field) => (
                    <field.TextField label={t("sender.address")} type="email" autoComplete="off" />
                  )}
                </form.AppField>
                <form.AppField name="senderName">
                  {(field) => <field.TextField label={t("sender.name")} autoComplete="off" />}
                </form.AppField>
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
                      <form.AppField name="smtpHost">
                        {(field) => <field.TextField label={t("smtp.host")} autoComplete="off" />}
                      </form.AppField>
                      <form.AppField name="smtpPort">
                        {(field) => (
                          <field.TextField
                            label={t("smtp.port")}
                            inputMode="numeric"
                            autoComplete="off"
                          />
                        )}
                      </form.AppField>
                      <form.AppField name="smtpSecurity">
                        {() => <SecurityField label={t("smtp.security")} />}
                      </form.AppField>
                      <form.AppField name="smtpUsername">
                        {(field) => <field.TextField label={t("smtp.user")} autoComplete="off" />}
                      </form.AppField>
                      <form.Subscribe selector={(state) => dropsPassword(state.values, saved)}>
                        {(drops) => (
                          <form.AppField name="smtpPassword">
                            {() => (
                              <PasswordField
                                label={t("smtp.password")}
                                placeholder={
                                  saved?.smtpPasswordSet && !drops
                                    ? t("kept")
                                    : t("smtp.passwordNew")
                                }
                                warning={drops ? t("errors.passwordDropped") : undefined}
                              />
                            )}
                          </form.AppField>
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
                    <form.AppField name="brevoApiKey">
                      {(field) => (
                        <field.TextField
                          label={t("brevo.key")}
                          type="password"
                          autoComplete="off"
                          placeholder={saved?.brevoApiKeySet ? t("kept") : t("brevo.keyNew")}
                        />
                      )}
                    </form.AppField>
                  </FieldGroup>
                </CardContent>
              </Card>
            )
          }
        </form.Subscribe>
      </form>

      <form.Subscribe selector={(state) => state.isDirty}>
        {(dirty) => <TestEmail configured={Boolean(saved)} dirty={dirty} adminEmail={adminEmail} />}
      </form.Subscribe>

      <form.AppForm>
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
                  <form.SubmitButton disabled={saved !== undefined && !dirty}>
                    {saved ? t("footer.save") : t("footer.create")}
                  </form.SubmitButton>
                </div>
              </CardContent>
            </Card>
          )}
        </form.Subscribe>
      </form.AppForm>
    </div>
  );
}

/** How the SMTP connection is secured: a choice of three composed from the `field` parts. */
function SecurityField({ label }: { label: string }) {
  const { field, invalid, errors, ids } = useFieldValidity<"starttls" | "tls" | "none">();
  const t = useTranslations("Admin.email.smtp");
  return (
    <Field className="md:col-span-2" data-invalid={invalid || undefined}>
      <FieldLabel id={`${ids.control}-label`}>{label}</FieldLabel>
      <ToggleGroup
        id={ids.control}
        variant="segment"
        aria-labelledby={`${ids.control}-label`}
        value={[field.state.value]}
        onValueChange={(chosen: string[]) => {
          const next = chosen[0];
          if (next === "starttls" || next === "tls" || next === "none") field.handleChange(next);
        }}
      >
        <ToggleGroupItem value="none">{t("none")}</ToggleGroupItem>
        <ToggleGroupItem value="starttls">{t("starttls")}</ToggleGroupItem>
        <ToggleGroupItem value="tls">{t("tls")}</ToggleGroupItem>
      </ToggleGroup>
      {invalid && <FieldError id={ids.error} errors={errors} />}
    </Field>
  );
}

/**
 * The SMTP password, which also warns before a save that the stored one would be dropped: the server keeps
 * it only for the server it was entered for (`dropsPassword`).
 */
function PasswordField({
  label,
  placeholder,
  warning,
}: {
  label: string;
  placeholder: string;
  warning?: string;
}) {
  const { field, invalid, errors, ids } = useFieldValidity<string>();
  const marked = invalid || warning !== undefined;
  return (
    <Field data-invalid={marked || undefined}>
      <FieldLabel htmlFor={ids.control}>{label}</FieldLabel>
      <Input
        id={ids.control}
        name={field.name}
        type="password"
        autoComplete="new-password"
        placeholder={placeholder}
        value={field.state.value}
        aria-invalid={marked || undefined}
        aria-describedby={marked ? ids.error : undefined}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      {invalid ? (
        <FieldError id={ids.error} errors={errors} />
      ) : (
        warning && <FieldError id={ids.error}>{warning}</FieldError>
      )}
    </Field>
  );
}

// The test email (Figma AD-E1…E3): through the settings saved, to the admin's own address or one typed, so an
// admin sees a mailbox elsewhere receive it. It waits while the settings have changes, which it would not use.
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
  const blocked = !configured || dirty;

  const form = useAppForm({
    defaultValues: { to: adminEmail },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        to: z
          .string()
          .trim()
          .pipe(z.email({ message: t("invalid") })),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      const to = value.to.trim();
      try {
        await sendTestEmail({ body: { to } });
      } catch (error) {
        refuse(formApi, error);
        return;
      }
      toast.add({ type: "success", title: t("sent", { to }), description: t("sentHint") });
    },
  });

  return (
    <Card size="lg">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id={form.formId}
          noValidate
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!blocked) void form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start">
            <div className="flex-1">
              <form.AppField name="to">
                {(field) => (
                  <field.TextField
                    label={t("to")}
                    type="email"
                    autoComplete="email"
                    description={
                      !configured ? t("notConfigured") : dirty ? t("saveFirst") : t("hint")
                    }
                  />
                )}
              </form.AppField>
            </div>
            <form.AppForm>
              <form.SubmitButton variant="outline" className="md:mt-6" disabled={blocked}>
                {t("send")}
              </form.SubmitButton>
            </form.AppForm>
          </div>
          <form.Subscribe selector={(state) => state.values.to.trim()}>
            {(to) => (
              <form.AppForm>
                <form.FormError title={t("failed", { to })} fallback={t("unknown")} />
              </form.AppForm>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
