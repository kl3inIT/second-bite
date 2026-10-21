"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { MailWarningIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { requestSignInCode, signIn, signInWithGoogle } from "@/lib/api/generated";

import {
  CodeField,
  codeIsGone,
  codeRefusals,
  codeRule,
  RESEND_AFTER_SECONDS,
  ResendCode,
} from "./code-field";
import { emailInToken, GoogleButton } from "./google-button";

/** One plain address, as the server's rule reads it (server/internal/identity, normalizeEmail) at its simplest. */
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Step =
  | { name: "email"; googleNeedsCode?: string }
  | { name: "code"; email: string; challengeId: string; resendAt: number };

// The sign-in screen's form (SEC-29, Figma "Đăng nhập" L1–L4, from shadcn's login-05 block): Google's button, or
// an address and the six-digit code emailed to it. Either way the session arrives as the httpOnly cookie, and the
// person goes back to the page that sent them. Each step is a form of its own (docs/guidelines/web.md › Forms); the
// server's words for a refusal go under the field they concern, or above the button (SEC-28).
export function SignInForm({
  returnTo,
  googleClientId,
}: {
  returnTo: string;
  googleClientId?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>({ name: "email" });
  const [email, setEmail] = useState("");

  function signedIn() {
    router.replace(returnTo);
    router.refresh();
  }

  function sent(to: string, challengeId: string) {
    setEmail(to);
    setStep({
      name: "code",
      email: to,
      challengeId,
      resendAt: Date.now() + RESEND_AFTER_SECONDS * 1000,
    });
  }

  if (step.name === "code") {
    return (
      <CodeStep
        step={step}
        onResent={(challengeId) => sent(step.email, challengeId)}
        onChangeEmail={() => setStep({ name: "email" })}
        onSignedIn={signedIn}
      />
    );
  }
  return (
    <EmailStep
      // An address Google named starts the form again with it.
      key={step.googleNeedsCode ?? ""}
      email={step.googleNeedsCode || email}
      googleNeedsCode={step.googleNeedsCode}
      googleClientId={googleClientId}
      onSent={sent}
      onGoogleNeedsCode={(address) => setStep({ name: "email", googleNeedsCode: address })}
      onSignedIn={signedIn}
    />
  );
}

function EmailStep({
  email,
  googleNeedsCode,
  googleClientId,
  onSent,
  onGoogleNeedsCode,
  onSignedIn,
}: {
  email: string;
  googleNeedsCode?: string;
  googleClientId?: string;
  onSent: (email: string, challengeId: string) => void;
  onGoogleNeedsCode: (address: string) => void;
  onSignedIn: () => void;
}) {
  const t = useTranslations("SignIn");
  const [google, startGoogle] = useTransition();

  const form = useAppForm({
    defaultValues: { email },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        email: z.string().refine((value) => EMAIL.test(value.trim()), t("errors.email")),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      const to = value.email.trim();
      try {
        const { data } = await requestSignInCode({ body: { email: to } });
        onSent(to, data.challengeId);
      } catch (error) {
        refuse(formApi, error, { IDENTITY_EMAIL_INVALID: "email" });
      }
    },
  });

  function continueWithGoogle(idToken: string, nonce: string) {
    startGoogle(async () => {
      try {
        await signInWithGoogle({ body: { idToken, nonce, session: "cookie" } });
        onSignedIn();
      } catch (error) {
        if (error instanceof ApiError && error.code === "IDENTITY_GOOGLE_LINK_REQUIRED") {
          // The address already has an account and Google does not speak for it: the emailed code proves it
          // today (SEC-29 › decision 4).
          onGoogleNeedsCode(emailInToken(idToken) ?? "");
          return;
        }
        refuse(form, error);
      }
    });
  }

  return (
    <form
      id={form.formId}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <h1 className="text-page-title text-foreground">{t("heading")}</h1>
        {googleNeedsCode !== undefined && (
          <Alert variant="warning">
            <MailWarningIcon aria-hidden />
            <AlertTitle>{t("googleNeedsCodeTitle")}</AlertTitle>
            <AlertDescription>
              {googleNeedsCode
                ? t("googleNeedsCodeBody", { email: googleNeedsCode })
                : t("googleNeedsCodeBodyNoAddress")}
            </AlertDescription>
          </Alert>
        )}
        {googleClientId && googleNeedsCode === undefined && (
          <>
            <GoogleButton clientId={googleClientId} onCredential={continueWithGoogle} />
            <div className="flex items-center gap-3 text-label text-muted-foreground">
              <span aria-hidden className="h-px flex-1 bg-border" />
              {t("or")}
              <span aria-hidden className="h-px flex-1 bg-border" />
            </div>
          </>
        )}
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label={t("emailLabel")}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              variant="pill"
              placeholder={t("emailPlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.FormError fallback={t("failed")} />
          <form.SubmitButton size="lg" disabled={google} pendingLabel={t("sending")}>
            {googleNeedsCode !== undefined ? t("sendCodeHere") : t("sendCode")}
          </form.SubmitButton>
        </form.AppForm>
        <FieldDescription className="text-center">
          {t.rich("legal", {
            terms: (chunks) => (
              <Link href="/terms" className="text-link">
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link href="/privacy" className="text-link">
                {chunks}
              </Link>
            ),
            br: () => <br />,
          })}
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

// The code's step: the sixth digit sends it, and a code refused says why under it. A code that can no longer be
// used offers a new one at once.
function CodeStep({
  step,
  onResent,
  onChangeEmail,
  onSignedIn,
}: {
  step: Extract<Step, { name: "code" }>;
  onResent: (challengeId: string) => void;
  onChangeEmail: () => void;
  onSignedIn: () => void;
}) {
  const t = useTranslations("SignIn");
  const [gone, setGone] = useState(false);
  const [resending, startResending] = useTransition();

  const form = useAppForm({
    defaultValues: { code: "" },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: z.object({ code: codeRule(t("errors.code")) }) },
    onSubmit: async ({ value, formApi }) => {
      try {
        await signIn({
          body: { challengeId: step.challengeId, code: value.code, session: "cookie" },
        });
        onSignedIn();
      } catch (error) {
        formApi.setFieldValue("code", "");
        setGone(codeIsGone(error instanceof ApiError ? error.code : undefined));
        refuse(formApi, error, codeRefusals);
      }
    },
  });

  // The step moves focus to the code, so a keyboard or a screen reader starts there.
  const formId = form.formId;
  useEffect(() => {
    document.getElementById(formId)?.querySelector<HTMLInputElement>("input")?.focus();
  }, [formId]);

  function resend() {
    startResending(async () => {
      try {
        const { data } = await requestSignInCode({ body: { email: step.email } });
        form.reset();
        setGone(false);
        onResent(data.challengeId);
      } catch (error) {
        refuse(form, error);
      }
    });
  }

  return (
    <form
      id={form.formId}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <header className="flex flex-col gap-1">
          <h1 className="text-page-title text-foreground">{t("codeHeading")}</h1>
          <p className="text-body-sm text-muted-foreground">
            {t.rich("codeSent", {
              email: step.email,
              strong: (chunks) => (
                <strong className="text-body-sm-strong text-foreground">{chunks}</strong>
              ),
            })}{" "}
            <Button type="button" variant="link" size="inline" onClick={onChangeEmail}>
              {t("changeEmail")}
            </Button>
          </p>
        </header>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(submitting) => (
            <form.AppField name="code">
              {() => (
                <CodeField
                  label={t("codeLabel")}
                  disabled={submitting || resending}
                  onComplete={() => void form.handleSubmit()}
                >
                  <FieldDescription>{t("notArrived")}</FieldDescription>
                  <ResendCode
                    key={step.resendAt}
                    resendAt={gone ? 0 : step.resendAt}
                    disabled={submitting || resending}
                    onResend={resend}
                  />
                </CodeField>
              )}
            </form.AppField>
          )}
        </form.Subscribe>
        <form.AppForm>
          <form.FormError fallback={t("failed")} />
          <form.SubmitButton size="lg" disabled={resending} pendingLabel={t("confirming")}>
            {t("confirm")}
          </form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
