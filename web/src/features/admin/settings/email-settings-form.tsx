"use client";

import { CircleCheckIcon, TriangleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ComponentProps, type ReactNode, useEffect, useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRouter } from "@/i18n/navigation";
import { type EmailSettingsBody, getEmailSettings, saveEmailSettings } from "@/lib/api/generated";

import { toast } from "@/components/ui/toast";
import {
  type EmailDraft,
  type EmailField,
  emailBody,
  emailChanged,
  emailDraft,
  emailFields,
  type EmailProvider,
  passwordWillBeLost,
  portInput,
  signInLocked,
  type SmtpSecurity,
} from "./email-draft";
import { refusalSentence, refusedFields } from "./field-errors";
import { useSavedStatus } from "./saved-status";
import { changedSinceRead, etagOf } from "./version";

type TextFieldKey = Exclude<EmailField, "provider" | "smtpSecurity">;

/**
 * The email settings (Figma AD-CS4 to AD-CS7; docs: admin-web-flow › Sửa cài đặt email): SMTP or Brevo, the
 * sender, then the SMTP server or Brevo's key. A secret is never shown: its field says whether one is saved, and
 * left empty keeps it. With no provider saved, a toast says no one can sign in by code yet. Changing the server
 * without a new password warns, in a toast, that the saved password will go.
 */
export function EmailSettingsForm({
  settings,
  etag,
}: {
  settings: EmailSettingsBody | null;
  /** The settings' version as read, sent back in If-Match (SEC-75); "" when none is saved. */
  etag: string;
}) {
  const t = useTranslations("admin.settings");
  const foot = useTranslations("admin.shell.form");
  const router = useRouter();
  const [saved, setSaved] = useState(settings);
  const [version, setVersion] = useState(etag);
  const [draft, setDraft] = useState(() => emailDraft(settings));
  const [refused, setRefused] = useState<EmailField[]>([]);
  const [saving, startSaving] = useTransition();
  const savedStatus = useSavedStatus(saved?.updatedAt);

  useEffect(() => {
    if (settings) return;
    // Once, when the page opens, after the layout's effects, so the toaster around the page already listens.
    const timer = setTimeout(() =>
      toast.add({ title: t("email.notConfigured"), type: "warning", timeout: 5000 }),
    );
    return () => clearTimeout(timer);
  }, [settings, t]);

  const passwordLost = t("email.passwordLost");
  const locked = signInLocked(draft);
  const dirty = emailChanged(draft, saved);

  function edit(next: Partial<EmailDraft>) {
    const changed = { ...draft, ...next };
    if (!passwordWillBeLost(draft, saved) && passwordWillBeLost(changed, saved)) {
      toast.add({ title: passwordLost, type: "warning", timeout: 5000 });
    }
    setDraft(changed);
    setRefused((current) => current.filter((field) => !(field in next)));
  }

  function save() {
    if (passwordWillBeLost(draft, saved)) {
      toast.add({ title: passwordLost, type: "warning", timeout: 5000 });
      document.getElementById("email-smtpPassword")?.focus();
      return;
    }
    startSaving(async () => {
      try {
        await saveEmailSettings({ body: emailBody(draft), headers: { "If-Match": version } });
        // The save answers nothing; the read gives the settings as saved and their new version.
        const { data, response } = await getEmailSettings();
        setSaved(data);
        setVersion(etagOf(response));
        setDraft(emailDraft(data));
        setRefused([]);
        toast.add({ title: t("email.saved"), type: "success", timeout: 5000 });
        router.refresh();
      } catch (error) {
        if (changedSinceRead(error)) {
          toast.add({ title: t("form.changedSinceRead"), type: "warning", timeout: 5000 });
          return;
        }
        const fields = refusedFields(error, "NOTIFICATION_EMAIL_SETTINGS_INVALID", emailFields);
        setRefused(fields);
        if (fields.length === 0) {
          toast.add({
            title: refusalSentence(error, {
              failed: t("form.failed"),
              failedWithReference: (reference) => t("form.failedWithReference", { reference }),
              reference: (reference) => t("form.reference", { reference }),
            }),
            type: "error",
            timeout: 5000,
          });
        }
      }
    });
  }

  const keptPlaceholder = t("email.kept");

  // A line of words with its label over it (Figma Admin/FormField, AD-CS4): no helper line; the backend's refusal
  // of the field, when it names it, under it.
  function textField(
    key: TextFieldKey,
    label: string,
    input: Pick<
      ComponentProps<"input">,
      "type" | "autoComplete" | "inputMode" | "maxLength" | "placeholder" | "disabled"
    > & { value?: string; onChange?: (value: string) => void } = {},
  ) {
    const id = `email-${key}`;
    const error = refused.includes(key) ? t("form.refused") : undefined;
    const {
      value = draft[key],
      onChange = (next: string) => edit({ [key]: next }),
      ...rest
    } = input;
    return (
      <Field data-invalid={error ? true : undefined}>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Input
          id={id}
          autoComplete="off"
          disabled={saving}
          {...rest}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
      </Field>
    );
  }

  // One choice of two or three (Figma Admin/SegmentedControl): SMTP | Brevo, Không mã hoá | STARTTLS | TLS. One
  // always stays chosen. It scrolls sideways on a phone rather than breaking a choice over two lines.
  function choice<Value extends string>(
    labelledBy: string,
    value: Value,
    options: { value: Value; label: string }[],
    onChange: (value: Value) => void,
  ) {
    return (
      <div className="max-w-full overflow-x-auto">
        <ToggleGroup
          aria-labelledby={labelledBy}
          variant="outline"
          disabled={saving}
          value={[value]}
          onValueChange={(next) => {
            const chosen = next.find((each) => each !== value) ?? next[0];
            if (chosen) onChange(chosen as Value);
          }}
        >
          {options.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    );
  }

  function card(title: string, body: ReactNode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <h3>{title}</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>{body}</CardContent>
      </Card>
    );
  }

  const providerBadge = saved ? (
    <Badge variant="fresh">
      <CircleCheckIcon aria-hidden />
      {t("email.using", { provider: t(`email.${saved.provider}`) })}
    </Badge>
  ) : (
    <Badge variant="outline">
      <TriangleAlertIcon aria-hidden />
      {t("email.notSet")}
    </Badge>
  );

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      {card(
        t("email.provider"),
        <div className="flex flex-wrap items-center gap-4">
          <span id="email-provider-label" className="sr-only">
            {t("email.provider")}
          </span>
          {choice<EmailProvider>(
            "email-provider-label",
            draft.provider,
            [
              { value: "smtp", label: t("email.smtp") },
              { value: "brevo", label: t("email.brevo") },
            ],
            (provider) => edit({ provider }),
          )}
          {providerBadge}
        </div>,
      )}

      {card(
        t("email.sender"),
        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          {textField("senderAddress", t("email.senderAddress"), { type: "email", maxLength: 254 })}
          {textField("senderName", t("email.senderName"), { maxLength: 100 })}
        </div>,
      )}

      {draft.provider === "smtp"
        ? card(
            t("email.server"),
            <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
              {textField("smtpHost", t("email.host"), { maxLength: 253 })}
              {textField("smtpPort", t("email.port"), {
                inputMode: "numeric",
                onChange: (value) => edit({ smtpPort: portInput(value) }),
              })}
              <Field className="sm:col-span-2">
                <FieldTitle id="email-security-label">{t("email.security")}</FieldTitle>
                {choice<SmtpSecurity>(
                  "email-security-label",
                  draft.smtpSecurity,
                  [
                    { value: "none", label: t("email.none") },
                    { value: "starttls", label: t("email.starttls") },
                    { value: "tls", label: t("email.tls") },
                  ],
                  (smtpSecurity) => edit({ smtpSecurity }),
                )}
              </Field>
              {textField("smtpUsername", t("email.user"), {
                maxLength: 254,
                disabled: saving || locked,
              })}
              {textField("smtpPassword", t("email.password"), {
                type: "password",
                autoComplete: "new-password",
                maxLength: 1024,
                placeholder: saved?.smtpPasswordSet && !locked ? keptPlaceholder : undefined,
                value: locked ? "" : draft.smtpPassword,
                disabled: saving || locked,
              })}
            </div>,
          )
        : card(
            t("email.brevo"),
            <div className="flex flex-col gap-4">
              {saved?.brevoApiKeySet ? (
                <Badge variant="fresh">
                  <CircleCheckIcon aria-hidden />
                  {t("email.keySaved")}
                </Badge>
              ) : (
                <Badge variant="outline">
                  <TriangleAlertIcon aria-hidden />
                  {t("email.keyMissing")}
                </Badge>
              )}
              {textField("brevoApiKey", t("email.apiKey"), {
                type: "password",
                autoComplete: "new-password",
                maxLength: 1024,
                placeholder: saved?.brevoApiKeySet ? keptPlaceholder : undefined,
              })}
            </div>,
          )}

      {/* The foot (Figma Admin/FormFooter): when it was saved or that it is changed, Huỷ and Lưu thay đổi. */}
      <Card size="sm">
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <output
              className={
                dirty && !saving
                  ? "min-w-0 flex-1 text-label-strong text-warning-foreground"
                  : "min-w-0 flex-1 text-label text-muted-foreground"
              }
            >
              {saving ? foot("saving") : dirty ? foot("dirty") : savedStatus}
            </output>
            <Button
              variant="outline"
              type="button"
              disabled={!dirty || saving}
              onClick={() => {
                setDraft(emailDraft(saved));
                setRefused([]);
              }}
            >
              {foot("cancel")}
            </Button>
            <Button type="submit" disabled={!dirty || saving}>
              {saving && <Spinner data-icon="inline-start" />}
              {saving ? foot("savingButton") : foot("save")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
