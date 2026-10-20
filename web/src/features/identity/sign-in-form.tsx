"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CircleAlertIcon, MailWarningIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { requestSignInCode, signIn, signInWithGoogle } from "@/lib/api/generated";

import { emailInToken, GoogleButton } from "./google-button";

const CODE_LENGTH = 6;
/** How long "Gửi lại mã" waits after a code is sent: the server refuses a new code for a minute
 * (server/internal/identity, codeCooldown), so the button never offers what would be refused. */
const RESEND_AFTER_SECONDS = 60;

/**
 * What the screen shows after a failure. The server's code decides it only where the screen does something
 * different (web guideline › Data and the backend): a field turns red, a new code is offered, or Google gives
 * way to the emailed code. Everything else is "failed", with the request's reference.
 */
type Problem =
  | { kind: "emailInvalid" }
  | { kind: "codeLimit" }
  | { kind: "codeIncorrect" }
  | { kind: "codeGone" }
  | { kind: "googleUnverified" }
  | { kind: "failed"; reference?: string };

function problemOf(error: unknown): Problem {
  const code = error instanceof ApiError ? error.code : undefined;
  switch (code) {
    case "IDENTITY_EMAIL_INVALID":
      return { kind: "emailInvalid" };
    case "IDENTITY_CODE_LIMIT_EXCEEDED":
      return { kind: "codeLimit" };
    case "IDENTITY_CODE_INCORRECT":
      return { kind: "codeIncorrect" };
    case "IDENTITY_CHALLENGE_GONE":
    case "IDENTITY_CODE_ATTEMPTS_EXHAUSTED":
      return { kind: "codeGone" };
    case "IDENTITY_EMAIL_NOT_VERIFIED":
      return { kind: "googleUnverified" };
    default:
      return { kind: "failed", reference: error instanceof ApiError ? error.requestId : undefined };
  }
}

type Step =
  | { name: "email"; googleNeedsCode?: string }
  | { name: "code"; challengeId: string; resendAt: number };

// The sign-in screen's form (SEC-29, Figma "Đăng nhập" L1–L4, from shadcn's login-05 block): Google's
// button, or an address and the six-digit code emailed to it. Either way the session arrives as the
// httpOnly cookie, and the person goes back to the page that sent them.
export function SignInForm({
  returnTo,
  googleClientId,
}: {
  returnTo: string;
  googleClientId?: string;
}) {
  const t = useTranslations("SignIn");
  const router = useRouter();
  const [step, setStep] = useState<Step>({ name: "email" });
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [problem, setProblem] = useState<Problem>();
  const [pending, startTransition] = useTransition();

  function signedIn() {
    router.replace(returnTo);
    router.refresh();
  }

  function sendCode(to: string) {
    setProblem(undefined);
    startTransition(async () => {
      try {
        const { data } = await requestSignInCode({ body: { email: to } });
        setCode("");
        setStep({
          name: "code",
          challengeId: data.challengeId,
          resendAt: Date.now() + RESEND_AFTER_SECONDS * 1000,
        });
      } catch (error) {
        setProblem(problemOf(error));
      }
    });
  }

  function confirm(challengeId: string, value: string) {
    setProblem(undefined);
    startTransition(async () => {
      try {
        await signIn({ body: { challengeId, code: value, session: "cookie" } });
        signedIn();
      } catch (error) {
        setProblem(problemOf(error));
        setCode("");
      }
    });
  }

  function continueWithGoogle(idToken: string, nonce: string) {
    setProblem(undefined);
    startTransition(async () => {
      try {
        await signInWithGoogle({ body: { idToken, nonce, session: "cookie" } });
        signedIn();
      } catch (error) {
        if (error instanceof ApiError && error.code === "IDENTITY_GOOGLE_LINK_REQUIRED") {
          // The address already has an account and Google does not speak for it: the emailed code proves
          // it today (SEC-29 › decision 4).
          const address = emailInToken(idToken) ?? "";
          setEmail(address);
          setStep({ name: "email", googleNeedsCode: address });
          return;
        }
        setProblem(problemOf(error));
      }
    });
  }

  // A new step moves focus to what it asks for, so a keyboard or a screen reader starts there.
  const stepName = step.name;
  useEffect(() => {
    if (stepName === "code") document.getElementById("sign-in-code")?.focus();
  }, [stepName]);

  if (step.name === "code") {
    const invalid = problem?.kind === "codeIncorrect" || problem?.kind === "codeGone";
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          confirm(step.challengeId, code);
        }}
      >
        <FieldGroup>
          <header className="flex flex-col gap-1">
            <h1 className="text-page-title text-foreground">{t("codeHeading")}</h1>
            <p className="text-body-sm text-muted-foreground">
              {t.rich("codeSent", {
                email,
                strong: (chunks) => (
                  <strong className="text-body-sm-strong text-foreground">{chunks}</strong>
                ),
              })}{" "}
              <Button
                type="button"
                variant="link"
                size="inline"
                onClick={() => {
                  setProblem(undefined);
                  setStep({ name: "email" });
                }}
              >
                {t("changeEmail")}
              </Button>
            </p>
          </header>
          <Field data-invalid={invalid || undefined}>
            <FieldLabel htmlFor="sign-in-code" className="sr-only">
              {t("codeLabel")}
            </FieldLabel>
            <InputOTP
              id="sign-in-code"
              maxLength={CODE_LENGTH}
              pattern={REGEXP_ONLY_DIGITS}
              // A code copied from a mail app often carries spaces or a line break; keep its digits, as
              // GOV.UK asks, rather than drop the paste (WCAG 2.2, 3.3.8).
              pasteTransformer={(pasted: string) => pasted.replace(/\D/g, "")}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={setCode}
              onComplete={(value: string) => confirm(step.challengeId, value)}
              disabled={pending}
              aria-invalid={invalid || undefined}
              aria-describedby={problem ? "sign-in-code-problem" : undefined}
            >
              <InputOTPGroup>
                {Array.from({ length: CODE_LENGTH }, (_, index) => (
                  <InputOTPSlot key={index} index={index} aria-invalid={invalid || undefined} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {problem && (
              <FieldError id="sign-in-code-problem">
                <span className="flex items-start gap-1.5">
                  <CircleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                  <span>{problemText(t, problem)}</span>
                </span>
              </FieldError>
            )}
            <FieldDescription>{t("notArrived")}</FieldDescription>
            <ResendCode
              key={step.resendAt}
              resendAt={problem?.kind === "codeGone" ? 0 : step.resendAt}
              disabled={pending}
              onResend={() => sendCode(email)}
            />
          </Field>
          <Button type="submit" size="lg" disabled={pending || code.length < CODE_LENGTH}>
            {pending && <Spinner data-icon="inline-start" />}
            {pending ? t("confirming") : t("confirm")}
          </Button>
        </FieldGroup>
      </form>
    );
  }

  const emailInvalid = problem?.kind === "emailInvalid";
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendCode(email.trim());
      }}
    >
      <FieldGroup>
        <h1 className="text-page-title text-foreground">{t("heading")}</h1>
        {step.googleNeedsCode !== undefined && (
          <Alert variant="warning">
            <MailWarningIcon aria-hidden />
            <AlertTitle>{t("googleNeedsCodeTitle")}</AlertTitle>
            <AlertDescription>
              {step.googleNeedsCode
                ? t("googleNeedsCodeBody", { email: step.googleNeedsCode })
                : t("googleNeedsCodeBodyNoAddress")}
            </AlertDescription>
          </Alert>
        )}
        {googleClientId && step.googleNeedsCode === undefined && (
          <>
            <GoogleButton clientId={googleClientId} onCredential={continueWithGoogle} />
            <div className="flex items-center gap-3 text-label text-muted-foreground">
              <span aria-hidden className="h-px flex-1 bg-border" />
              {t("or")}
              <span aria-hidden className="h-px flex-1 bg-border" />
            </div>
          </>
        )}
        <Field data-invalid={emailInvalid || undefined}>
          <FieldLabel htmlFor="sign-in-email">{t("emailLabel")}</FieldLabel>
          <Input
            id="sign-in-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            variant="pill"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={emailInvalid || undefined}
            aria-describedby={problem ? "sign-in-email-problem" : undefined}
          />
          {problem && (
            <FieldError id="sign-in-email-problem">
              <span className="flex items-start gap-1.5">
                <CircleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                <span>{problemText(t, problem)}</span>
              </span>
            </FieldError>
          )}
        </Field>
        <Button type="submit" size="lg" disabled={pending}>
          {pending && <Spinner data-icon="inline-start" />}
          {pending
            ? t("sending")
            : step.googleNeedsCode !== undefined
              ? t("sendCodeHere")
              : t("sendCode")}
        </Button>
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

function problemText(t: ReturnType<typeof useTranslations<"SignIn">>, problem: Problem): string {
  if (problem.kind === "failed") {
    return problem.reference
      ? t("failedWithReference", { reference: problem.reference })
      : t("failed");
  }
  return t(problem.kind);
}

/** "Gửi lại mã sau 0:28", then the button itself once the wait is over. */
function ResendCode({
  resendAt,
  disabled,
  onResend,
}: {
  resendAt: number;
  disabled: boolean;
  onResend: () => void;
}) {
  const t = useTranslations("SignIn");
  const [now, setNow] = useState(() => Date.now());
  const seconds = Math.max(0, Math.ceil((resendAt - now) / 1000));

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  if (seconds > 0) {
    return (
      <FieldDescription>
        {t("resendIn", {
          time: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`,
        })}
      </FieldDescription>
    );
  }
  return (
    <Button
      type="button"
      variant="link"
      size="inline"
      className="w-fit"
      disabled={disabled}
      onClick={onResend}
    >
      {t("resend")}
    </Button>
  );
}
