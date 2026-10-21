import { z } from "zod";

import type { EmailSettingsBody } from "@/lib/api/generated";

/** What the form holds: the settings as typed, the port as text so it can be empty, the secrets as entered. */
export type EmailSettingsValues = {
  provider: EmailSettingsBody["provider"];
  senderAddress: string;
  senderName: string;
  smtpHost: string;
  smtpPort: string;
  smtpSecurity: EmailSettingsBody["smtpSecurity"];
  smtpUsername: string;
  smtpPassword: string;
  brevoApiKey: string;
};

/** The saved settings the form starts from, or the empty form when none are saved (Figma AD-CS6). */
export function valuesOf(saved: EmailSettingsBody | undefined): EmailSettingsValues {
  return {
    provider: saved?.provider ?? "smtp",
    senderAddress: saved?.senderAddress ?? "",
    senderName: saved?.senderName ?? "",
    smtpHost: saved?.smtpHost ?? "",
    smtpPort: saved?.smtpPort ? String(saved.smtpPort) : "587",
    smtpSecurity: saved?.smtpSecurity ?? "starttls",
    smtpUsername: saved?.smtpUsername ?? "",
    smtpPassword: "",
    brevoApiKey: "",
  };
}

/**
 * Whether the stored SMTP password is dropped on save: the server keeps it only for the server it was entered
 * for, so a change of host, port, security or user without a new password drops it
 * (server/internal/notification/settings.go › setSecrets).
 */
export function dropsPassword(values: EmailSettingsValues, saved: EmailSettingsBody | undefined) {
  if (!saved?.smtpPasswordSet || values.smtpPassword !== "") return false;
  return (
    values.smtpHost.trim() !== saved.smtpHost ||
    values.smtpPort.trim() !== String(saved.smtpPort) ||
    values.smtpSecurity !== saved.smtpSecurity ||
    values.smtpUsername.trim() !== saved.smtpUsername
  );
}

/** The sentence for each rule broken, in the page's language. */
export type EmailSettingsMessages = Record<
  | "senderAddress"
  | "senderName"
  | "smtpHost"
  | "smtpPort"
  | "passwordNeeded"
  | "passwordDropped"
  | "noTls"
  | "brevoKey",
  string
>;

/**
 * The rules the server holds the settings to (settings.go › validateSettings), checked in the browser first so
 * each one is said beside its field. The server stays the judge: what it refuses is shown too.
 */
export function emailSettingsSchema(
  m: EmailSettingsMessages,
  saved: EmailSettingsBody | undefined,
) {
  return z
    .object({
      provider: z.enum(["smtp", "brevo"]),
      senderAddress: z.string().trim().pipe(z.email(m.senderAddress).max(254, m.senderAddress)),
      senderName: z.string().trim().min(1, m.senderName).max(100, m.senderName),
      smtpHost: z.string(),
      smtpPort: z.string(),
      smtpSecurity: z.enum(["starttls", "tls", "none"]),
      smtpUsername: z.string(),
      smtpPassword: z.string(),
      brevoApiKey: z.string(),
    })
    .superRefine((values, issues) => {
      const fail = (path: keyof EmailSettingsValues, message: string) =>
        issues.addIssue({ code: "custom", path: [path], message });

      if (values.provider === "brevo") {
        if (!saved?.brevoApiKeySet && values.brevoApiKey.trim() === "")
          fail("brevoApiKey", m.brevoKey);
        return;
      }

      if (values.smtpHost.trim() === "") fail("smtpHost", m.smtpHost);

      const port = Number(values.smtpPort.trim());
      if (!/^\d+$/.test(values.smtpPort.trim()) || port < 1 || port > 65535)
        fail("smtpPort", m.smtpPort);

      if (values.smtpUsername.trim() === "") return;
      if (values.smtpSecurity === "none") fail("smtpSecurity", m.noTls);
      if (dropsPassword(values, saved)) fail("smtpPassword", m.passwordDropped);
      else if (!saved?.smtpPasswordSet && values.smtpPassword === "")
        fail("smtpPassword", m.passwordNeeded);
    });
}

/** The body the server saves: only the chosen provider's fields, and a secret only when one was entered. */
export function bodyOf(values: EmailSettingsValues) {
  const sender = {
    provider: values.provider,
    senderAddress: values.senderAddress.trim(),
    senderName: values.senderName.trim(),
  };
  if (values.provider === "brevo") {
    return { ...sender, brevoApiKey: values.brevoApiKey.trim() || undefined };
  }
  return {
    ...sender,
    smtpHost: values.smtpHost.trim(),
    smtpPort: Number(values.smtpPort.trim()),
    smtpSecurity: values.smtpSecurity,
    smtpUsername: values.smtpUsername.trim() || undefined,
    smtpPassword: values.smtpPassword || undefined,
  };
}
