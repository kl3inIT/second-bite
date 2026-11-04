"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { requestSignInCode, signIn } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import {
  CodeField,
  codeIsGone,
  codeRefusals,
  codeRule,
  RESEND_AFTER_SECONDS,
  ResendCode,
} from "./code-field";

/** One plain address, as the server's rule reads it (server/internal/identity, normalizeEmail) at its simplest. */
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Step =
  { name: "email" } | { name: "code"; email: string; challengeId: string; resendAt: number };

// The emailed-code sign-in (SEC-29, Figma "Đăng nhập bằng email" L12 and "Nhập mã" L9, from shadcn's login-05
// block), on a screen of its own since SEC-193 made the username and the password the way in the sign-in screen
// opens on: an address and the six-digit code emailed to it. The session arrives as the httpOnly cookie, and the
// person goes back to the page that sent them. Each step is a form of its own (docs/guidelines/web.md › Forms); the
// server's words for a refusal go under the field they concern, or above the button (SEC-28).
export function SignInForm({ returnTo }: { returnTo: string }) {
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
  return <EmailStep email={email} returnTo={returnTo} onSent={sent} />;
}

function EmailStep({
  email,
  returnTo,
  onSent,
}: {
  email: string;
  returnTo: string;
  onSent: (email: string, challengeId: string) => void;
}) {
  const t = useTranslations("SignIn");

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
        <h1 className="text-page-title text-foreground">{t("emailHeading")}</h1>
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
          <form.SubmitButton size="lg" pendingLabel={t("sending")}>
            {t("sendCode")}
          </form.SubmitButton>
        </form.AppForm>
        <Link
          href={{ pathname: "/sign-in", query: { returnTo } }}
          className={cn(buttonVariants({ variant: "link", size: "inline" }), "self-center")}
        >
          {t("usePassword")}
        </Link>
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
