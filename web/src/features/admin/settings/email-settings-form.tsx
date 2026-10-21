"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";

import { useRouter } from "@/i18n/navigation";
import { type EmailSettingsBody, getEmailSettings, saveEmailSettings } from "@/lib/api/generated";

import { showAdminToast } from "../admin-toast";
import { AdminBadge } from "../ui/badge";
import { SegmentedControl } from "../ui/segmented-control";
import { FormFooter, SettingsCard } from "../ui/settings";
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
import { TextField } from "./text-field";
import { changedSinceRead, etagOf } from "./version";

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
    const timer = setTimeout(() => showAdminToast(t("email.notConfigured"), "warning"));
    return () => clearTimeout(timer);
  }, [settings, t]);

  const passwordLost = t("email.passwordLost");
  const locked = signInLocked(draft);

  function change(field: Exclude<EmailField, "provider" | "smtpSecurity">, value: string) {
    edit({ [field]: value });
  }

  function edit(next: Partial<EmailDraft>) {
    const changed = { ...draft, ...next };
    if (!passwordWillBeLost(draft, saved) && passwordWillBeLost(changed, saved)) {
      showAdminToast(passwordLost, "warning");
    }
    setDraft(changed);
    setRefused((current) => current.filter((field) => !(field in next)));
  }

  function save() {
    if (passwordWillBeLost(draft, saved)) {
      showAdminToast(passwordLost, "warning");
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
        showAdminToast(t("email.saved"));
        router.refresh();
      } catch (error) {
        if (changedSinceRead(error)) {
          showAdminToast(t("form.changedSinceRead"), "warning");
          return;
        }
        const fields = refusedFields(error, "NOTIFICATION_EMAIL_SETTINGS_INVALID", emailFields);
        setRefused(fields);
        if (fields.length === 0) {
          showAdminToast(
            refusalSentence(error, {
              failed: t("form.failed"),
              failedWithReference: (reference) => t("form.failedWithReference", { reference }),
              reference: (reference) => t("form.reference", { reference }),
            }),
            "error",
          );
        }
      }
    });
  }

  function errorOf(field: EmailField) {
    return refused.includes(field) ? t("form.refused") : undefined;
  }

  const keptPlaceholder = t("email.kept");

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <SettingsCard title={t("email.provider")}>
        <div className="flex flex-wrap items-center gap-4">
          <SegmentedControl<EmailProvider>
            label={t("email.provider")}
            value={draft.provider}
            disabled={saving}
            segments={[
              { value: "smtp", label: t("email.smtp") },
              { value: "brevo", label: t("email.brevo") },
            ]}
            onChange={(provider) => edit({ provider })}
          />
          {saved ? (
            <AdminBadge tone="success">
              {t("email.using", { provider: t(`email.${saved.provider}`) })}
            </AdminBadge>
          ) : (
            <AdminBadge tone="warning">{t("email.notSet")}</AdminBadge>
          )}
        </div>
      </SettingsCard>

      <SettingsCard title={t("email.sender")}>
        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <TextField
            id="email-senderAddress"
            label={t("email.senderAddress")}
            type="email"
            autoComplete="off"
            maxLength={254}
            value={draft.senderAddress}
            onChange={(value) => change("senderAddress", value)}
            disabled={saving}
            error={errorOf("senderAddress")}
          />
          <TextField
            id="email-senderName"
            label={t("email.senderName")}
            autoComplete="off"
            maxLength={100}
            value={draft.senderName}
            onChange={(value) => change("senderName", value)}
            disabled={saving}
            error={errorOf("senderName")}
          />
        </div>
      </SettingsCard>

      {draft.provider === "smtp" ? (
        <SettingsCard title={t("email.server")}>
          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            <TextField
              id="email-smtpHost"
              label={t("email.host")}
              autoComplete="off"
              maxLength={253}
              value={draft.smtpHost}
              onChange={(value) => change("smtpHost", value)}
              disabled={saving}
              error={errorOf("smtpHost")}
            />
            <TextField
              id="email-smtpPort"
              label={t("email.port")}
              inputMode="numeric"
              autoComplete="off"
              value={draft.smtpPort}
              onChange={(value) => change("smtpPort", portInput(value))}
              disabled={saving}
              error={errorOf("smtpPort")}
            />
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <span aria-hidden className="text-label-strong text-foreground">
                {t("email.security")}
              </span>
              <SegmentedControl<SmtpSecurity>
                label={t("email.security")}
                value={draft.smtpSecurity}
                disabled={saving}
                segments={[
                  { value: "none", label: t("email.none") },
                  { value: "starttls", label: t("email.starttls") },
                  { value: "tls", label: t("email.tls") },
                ]}
                onChange={(smtpSecurity) => edit({ smtpSecurity })}
              />
            </div>
            <TextField
              id="email-smtpUsername"
              label={t("email.user")}
              autoComplete="off"
              maxLength={254}
              value={draft.smtpUsername}
              onChange={(value) => change("smtpUsername", value)}
              disabled={saving || locked}
              error={errorOf("smtpUsername")}
            />
            <TextField
              id="email-smtpPassword"
              label={t("email.password")}
              type="password"
              autoComplete="new-password"
              maxLength={1024}
              placeholder={saved?.smtpPasswordSet && !locked ? keptPlaceholder : undefined}
              value={locked ? "" : draft.smtpPassword}
              onChange={(value) => change("smtpPassword", value)}
              disabled={saving || locked}
              error={errorOf("smtpPassword")}
            />
          </div>
        </SettingsCard>
      ) : (
        <SettingsCard title={t("email.brevo")}>
          <div className="flex flex-col gap-4">
            {saved?.brevoApiKeySet ? (
              <AdminBadge tone="success">{t("email.keySaved")}</AdminBadge>
            ) : (
              <AdminBadge tone="warning">{t("email.keyMissing")}</AdminBadge>
            )}
            <TextField
              id="email-brevoApiKey"
              label={t("email.apiKey")}
              type="password"
              autoComplete="new-password"
              maxLength={1024}
              placeholder={saved?.brevoApiKeySet ? keptPlaceholder : undefined}
              value={draft.brevoApiKey}
              onChange={(value) => change("brevoApiKey", value)}
              disabled={saving}
              error={errorOf("brevoApiKey")}
            />
          </div>
        </SettingsCard>
      )}

      <FormFooter
        dirty={emailChanged(draft, saved)}
        saving={saving}
        savedStatus={savedStatus}
        onCancel={() => {
          setDraft(emailDraft(saved));
          setRefused([]);
        }}
      />
    </form>
  );
}
