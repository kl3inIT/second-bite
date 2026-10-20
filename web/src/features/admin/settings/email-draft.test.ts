import { describe, expect, it } from "vitest";

import type { EmailSettingsBody } from "@/lib/api/generated";

import {
  emailBody,
  emailChanged,
  emailConnected,
  emailDraft,
  passwordWillBeLost,
  portInput,
  signInLocked,
} from "./email-draft";

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

describe("the email form", () => {
  it("starts from the saved settings with no secret in it", () => {
    expect(emailDraft(saved)).toEqual({
      provider: "smtp",
      senderAddress: "noreply@example.com",
      senderName: "Second Bite",
      smtpHost: "smtp.example.com",
      smtpPort: "587",
      smtpSecurity: "starttls",
      smtpUsername: "mailer@example.com",
      smtpPassword: "",
      brevoApiKey: "",
    });
  });

  it("starts empty on SMTP with STARTTLS when nothing is saved (AD-CS6)", () => {
    const draft = emailDraft(null);
    expect(draft.provider).toBe("smtp");
    expect(draft.smtpPort).toBe("");
    expect(draft.smtpSecurity).toBe("starttls");
    expect(emailChanged(draft, null)).toBe(false);
  });

  it("is changed by a new secret, and not by nothing", () => {
    expect(emailChanged(emailDraft(saved), saved)).toBe(false);
    expect(emailChanged({ ...emailDraft(saved), smtpPassword: "x" }, saved)).toBe(true);
    expect(emailChanged({ ...emailDraft(saved), provider: "brevo" }, saved)).toBe(true);
  });
});

describe("a port as it is typed", () => {
  it("keeps digits only and never goes over 65535", () => {
    expect(portInput("58a7")).toBe("587");
    expect(portInput("99999")).toBe("65535");
    expect(portInput("")).toBe("");
  });
});

describe("what Lưu sends", () => {
  it("leaves a secret out when none is typed, so the saved one is kept", () => {
    const body = emailBody(emailDraft(saved));
    expect(body.smtpPassword).toBeUndefined();
    expect(body.brevoApiKey).toBeUndefined();
    expect(body.smtpPort).toBe(587);
  });

  it("sends a new password and trims the words", () => {
    const body = emailBody({
      ...emailDraft(saved),
      smtpHost: " smtp2.example.com ",
      smtpPassword: "s",
    });
    expect(body.smtpHost).toBe("smtp2.example.com");
    expect(body.smtpPassword).toBe("s");
  });

  it("with no encryption locks the sign-in and sends no user or password", () => {
    const draft = { ...emailDraft(saved), smtpSecurity: "none" as const, smtpPassword: "s" };
    expect(signInLocked(draft)).toBe(true);
    expect(emailBody(draft).smtpUsername).toBe("");
    expect(emailBody(draft).smtpPassword).toBeUndefined();
  });
});

describe("the saved password", () => {
  it("is lost when the server, port, security or user change with no new password (AD-CS7)", () => {
    const draft = emailDraft(saved);
    expect(passwordWillBeLost(draft, saved)).toBe(false);
    expect(passwordWillBeLost({ ...draft, smtpHost: "smtp2.example.com" }, saved)).toBe(true);
    expect(passwordWillBeLost({ ...draft, smtpPort: "465" }, saved)).toBe(true);
    expect(passwordWillBeLost({ ...draft, smtpSecurity: "tls" }, saved)).toBe(true);
    expect(passwordWillBeLost({ ...draft, smtpUsername: "other@example.com" }, saved)).toBe(true);
  });

  it("is not lost with a new password, without a user, or without one saved", () => {
    const moved = { ...emailDraft(saved), smtpHost: "smtp2.example.com" };
    expect(passwordWillBeLost({ ...moved, smtpPassword: "s" }, saved)).toBe(false);
    expect(passwordWillBeLost({ ...moved, smtpUsername: "" }, saved)).toBe(false);
    expect(passwordWillBeLost({ ...moved, smtpSecurity: "none" }, saved)).toBe(false);
    expect(passwordWillBeLost(moved, { ...saved, smtpPasswordSet: false })).toBe(false);
    expect(passwordWillBeLost(moved, null)).toBe(false);
  });

  it("does not matter on Brevo", () => {
    const brevo = {
      ...emailDraft(saved),
      provider: "brevo" as const,
      smtpHost: "smtp2.example.com",
    };
    expect(passwordWillBeLost(brevo, saved)).toBe(false);
  });
});

describe("whether email is connected", () => {
  it("needs a server for SMTP and a key for Brevo", () => {
    expect(emailConnected(saved)).toBe(true);
    expect(emailConnected({ ...saved, provider: "brevo" })).toBe(false);
    expect(emailConnected({ ...saved, provider: "brevo", brevoApiKeySet: true })).toBe(true);
    expect(emailConnected(null)).toBe(false);
  });
});
