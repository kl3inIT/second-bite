import { describe, expect, it } from "vitest";

import type { EmailSettingsBody } from "@/lib/api/generated";

import {
  bodyOf,
  emailSettingsSchema,
  valuesOf,
  type EmailSettingsMessages,
  type EmailSettingsValues,
} from "./email-settings-schema";

const messages: EmailSettingsMessages = {
  senderAddress: "senderAddress",
  senderName: "senderName",
  smtpHost: "smtpHost",
  smtpPort: "smtpPort",
  passwordNeeded: "passwordNeeded",
  passwordDropped: "passwordDropped",
  noTls: "noTls",
  brevoKey: "brevoKey",
};

const saved: EmailSettingsBody = {
  provider: "smtp",
  senderAddress: "noreply@example.com",
  senderName: "Second Bite",
  smtpHost: "smtp.example.com",
  smtpPort: 587,
  smtpSecurity: "starttls",
  smtpUsername: "mailer@example.com",
  smtpPasswordSet: true,
  brevoApiKeySet: false,
  updatedAt: "2026-10-19T07:20:00Z",
};

/** The message of each field the rules refuse, by field. */
function refused(values: EmailSettingsValues, against: EmailSettingsBody | undefined) {
  const result = emailSettingsSchema(messages, against).safeParse(values);
  return Object.fromEntries(
    (result.error?.issues ?? []).map((i) => [String(i.path[0]), i.message]),
  );
}

describe("the email settings' rules", () => {
  it("accept the settings saved, the stored password kept", () => {
    expect(refused(valuesOf(saved), saved)).toEqual({});
  });

  it("say what an empty form lacks", () => {
    expect(
      refused({ ...valuesOf(undefined), smtpUsername: "mailer@example.com" }, undefined),
    ).toEqual({
      senderAddress: "senderAddress",
      senderName: "senderName",
      smtpHost: "smtpHost",
      smtpPassword: "passwordNeeded",
    });
  });

  it("warn that a change of server drops the stored password", () => {
    expect(refused({ ...valuesOf(saved), smtpHost: "smtp2.example.com" }, saved)).toEqual({
      smtpPassword: "passwordDropped",
    });
    expect(
      refused({ ...valuesOf(saved), smtpHost: "smtp2.example.com", smtpPassword: "new" }, saved),
    ).toEqual({});
  });

  it("refuse a password sent without TLS, and a port out of range", () => {
    expect(
      refused({ ...valuesOf(saved), smtpSecurity: "none", smtpPort: "70000" }, saved),
    ).toMatchObject({
      smtpSecurity: "noTls",
      smtpPort: "smtpPort",
    });
  });

  it("ask Brevo for a key only when none is stored", () => {
    const brevo = { ...valuesOf(saved), provider: "brevo" as const };
    expect(refused(brevo, saved)).toEqual({ brevoApiKey: "brevoKey" });
    expect(refused(brevo, { ...saved, brevoApiKeySet: true })).toEqual({});
  });

  it("send only the chosen provider's fields, and a secret only when entered", () => {
    expect(bodyOf(valuesOf(saved))).toEqual({
      provider: "smtp",
      senderAddress: "noreply@example.com",
      senderName: "Second Bite",
      smtpHost: "smtp.example.com",
      smtpPort: 587,
      smtpSecurity: "starttls",
      smtpUsername: "mailer@example.com",
      smtpPassword: undefined,
    });
    expect(bodyOf({ ...valuesOf(saved), provider: "brevo", brevoApiKey: " key " })).toEqual({
      provider: "brevo",
      senderAddress: "noreply@example.com",
      senderName: "Second Bite",
      brevoApiKey: "key",
    });
  });
});
