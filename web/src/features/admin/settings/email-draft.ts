import type { EmailSettingsBody, SaveEmailSettingsInputBody } from "@/lib/api/generated";

export type EmailProvider = EmailSettingsBody["provider"];
export type SmtpSecurity = EmailSettingsBody["smtpSecurity"];

/** The email form as it is typed: the port as written, the secrets empty unless a new one is entered. */
export type EmailDraft = {
  provider: EmailProvider;
  senderAddress: string;
  senderName: string;
  smtpHost: string;
  smtpPort: string;
  smtpSecurity: SmtpSecurity;
  smtpUsername: string;
  smtpPassword: string;
  brevoApiKey: string;
};

export const emailFields = [
  "provider",
  "senderAddress",
  "senderName",
  "smtpHost",
  "smtpPort",
  "smtpSecurity",
  "smtpUsername",
  "smtpPassword",
  "brevoApiKey",
] as const satisfies readonly (keyof EmailDraft)[];

export type EmailField = (typeof emailFields)[number];

/** The form for the saved settings, or an empty SMTP form when none are saved yet (Figma AD-CS6). */
export function emailDraft(saved: EmailSettingsBody | null): EmailDraft {
  return {
    provider: saved?.provider ?? "smtp",
    senderAddress: saved?.senderAddress ?? "",
    senderName: saved?.senderName ?? "",
    smtpHost: saved?.smtpHost ?? "",
    smtpPort: saved?.smtpPort ? String(saved.smtpPort) : "",
    smtpSecurity: saved?.smtpSecurity ?? "starttls",
    smtpUsername: saved?.smtpUsername ?? "",
    smtpPassword: "",
    brevoApiKey: "",
  };
}

/** A port as it is typed: digits only, never over 65535. */
export function portInput(typed: string): string {
  const digits = typed.replace(/\D/g, "").slice(0, 5);
  return digits === "" ? "" : String(Math.min(Number(digits), 65535));
}

/**
 * Whether the password is locked (docs: admin-web-flow › Sửa cài đặt email): with no encryption the backend never
 * sends a password, so the user and the password are locked and the user goes out empty (decided 21 October 2026).
 */
export function signInLocked(draft: EmailDraft): boolean {
  return draft.smtpSecurity === "none";
}

/** What Lưu sends: an empty secret keeps the stored one, and no encryption sends no user. */
export function emailBody(draft: EmailDraft): SaveEmailSettingsInputBody {
  const locked = signInLocked(draft);
  return {
    provider: draft.provider,
    senderAddress: draft.senderAddress.trim(),
    senderName: draft.senderName.trim(),
    smtpHost: draft.smtpHost.trim(),
    smtpPort: draft.smtpPort === "" ? 0 : Number(draft.smtpPort),
    smtpSecurity: draft.smtpSecurity,
    smtpUsername: locked ? "" : draft.smtpUsername.trim(),
    smtpPassword: locked || draft.smtpPassword === "" ? undefined : draft.smtpPassword,
    brevoApiKey: draft.brevoApiKey === "" ? undefined : draft.brevoApiKey,
  };
}

/** Whether the form says something other than what is saved, a new secret included. */
export function emailChanged(draft: EmailDraft, saved: EmailSettingsBody | null): boolean {
  const before = emailDraft(saved);
  return emailFields.some((field) => draft[field] !== before[field]);
}

/** Whether the SMTP server, port, security or user differ from those saved. */
function serverChanged(draft: EmailDraft, saved: EmailSettingsBody): boolean {
  const body = emailBody(draft);
  return (
    body.smtpHost !== saved.smtpHost ||
    body.smtpPort !== saved.smtpPort ||
    body.smtpSecurity !== saved.smtpSecurity ||
    body.smtpUsername !== saved.smtpUsername
  );
}

/**
 * Whether saving would drop the stored password while the server still needs one (Figma AD-CS7): the backend
 * keeps a password only for the server it was entered for, so a new host, port, security or user with no new
 * password leaves an SMTP user without one.
 */
export function passwordWillBeLost(draft: EmailDraft, saved: EmailSettingsBody | null): boolean {
  if (!saved?.smtpPasswordSet || draft.provider !== "smtp") return false;
  const body = emailBody(draft);
  return body.smtpUsername !== "" && body.smtpPassword === undefined && serverChanged(draft, saved);
}

/** Whether the saved settings can send: a server for SMTP, a key for Brevo. Nothing saved cannot. */
export function emailConnected(saved: EmailSettingsBody | null): boolean {
  if (!saved) return false;
  return saved.provider === "brevo" ? saved.brevoApiKeySet : saved.smtpHost !== "";
}
