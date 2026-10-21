"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CircleAlertIcon, CircleCheckIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError, failureOf } from "@/lib/api/client";
import { deleteMyAccount, requestAccountDeletionCode } from "@/lib/api/generated";

import { CODE_LENGTH, RESEND_AFTER_SECONDS, ResendCode } from "./sign-in-form";

/**
 * What the form shows after a failure; the server's code decides it only where the form does something
 * different (web guideline › Data and the backend).
 */
type Problem = {
  kind: "codeLimit" | "codeIncorrect" | "codeGone" | "failed";
  detail?: string;
  reference?: string;
};

function problemOf(error: unknown): Problem {
  const failure = failureOf(error);
  switch (error instanceof ApiError ? error.code : undefined) {
    case "IDENTITY_CODE_LIMIT_EXCEEDED":
      return { kind: "codeLimit", ...failure };
    case "IDENTITY_CODE_INCORRECT":
      return { kind: "codeIncorrect", ...failure };
    case "IDENTITY_CHALLENGE_GONE":
    case "IDENTITY_CODE_ATTEMPTS_EXHAUSTED":
      return { kind: "codeGone", ...failure };
    default:
      return { kind: "failed", ...failure };
  }
}

type Step =
  { name: "confirm" } | { name: "code"; challengeId: string; resendAt: number } | { name: "done" };

// Deleting the signed-in account (SEC-37): a code emailed to the account's address, then the code, then the
// confirmation. The server ends the session and clears its cookie; the page then shows the person signed out.
export function DeleteAccountForm({ email }: { email: string }) {
  const t = useTranslations("DeleteAccount");
  const router = useRouter();
  const [step, setStep] = useState<Step>({ name: "confirm" });
  const [code, setCode] = useState("");
  const [problem, setProblem] = useState<Problem>();
  const [pending, startTransition] = useTransition();

  function sendCode() {
    setProblem(undefined);
    startTransition(async () => {
      try {
        const { data } = await requestAccountDeletionCode();
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
        await deleteMyAccount({ body: { challengeId, code: value } });
        setStep({ name: "done" });
        router.refresh();
      } catch (error) {
        setProblem(problemOf(error));
        setCode("");
      }
    });
  }

  // A new step moves focus to what it asks for, so a keyboard or a screen reader starts there.
  const stepName = step.name;
  useEffect(() => {
    if (stepName === "code") document.getElementById("delete-account-code")?.focus();
    if (stepName === "done") document.getElementById("delete-account-done")?.focus();
  }, [stepName]);

  const problemLine = problem && (
    <FieldError id="delete-account-problem">
      <span className="flex items-start gap-1.5">
        <CircleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
        <span>
          {!problem.detail
            ? t("failed")
            : problem.kind === "failed" && problem.reference
              ? `${problem.detail} ${t("reference", { reference: problem.reference })}`
              : problem.detail}
        </span>
      </span>
    </FieldError>
  );

  if (step.name === "done") {
    return (
      <div className="flex flex-col items-start gap-3" aria-live="polite">
        <h2
          id="delete-account-done"
          tabIndex={-1}
          className="flex items-center gap-2 text-title outline-none"
        >
          <CircleCheckIcon aria-hidden className="size-5 text-success" />
          {t("doneTitle")}
        </h2>
        <p className="text-body-sm">{t("doneBody")}</p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          {t("home")}
        </Link>
      </div>
    );
  }

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
            <h2 className="text-title">{t("codeHeading")}</h2>
            <p className="text-body-sm text-muted-foreground">
              {t.rich("codeSent", {
                email,
                strong: (chunks) => (
                  <strong className="text-body-sm-strong text-foreground">{chunks}</strong>
                ),
              })}
            </p>
          </header>
          <Field data-invalid={invalid || undefined}>
            <FieldLabel htmlFor="delete-account-code" className="sr-only">
              {t("codeLabel")}
            </FieldLabel>
            <InputOTP
              id="delete-account-code"
              maxLength={CODE_LENGTH}
              pattern={REGEXP_ONLY_DIGITS}
              pasteTransformer={(pasted: string) => pasted.replace(/\D/g, "")}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={setCode}
              disabled={pending}
              aria-invalid={invalid || undefined}
              aria-describedby={problem ? "delete-account-problem" : undefined}
            >
              <InputOTPGroup>
                {Array.from({ length: CODE_LENGTH }, (_, index) => (
                  <InputOTPSlot key={index} index={index} aria-invalid={invalid || undefined} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {problemLine}
            <ResendCode
              key={step.resendAt}
              resendAt={problem?.kind === "codeGone" ? 0 : step.resendAt}
              disabled={pending}
              onResend={sendCode}
            />
          </Field>
          {/* The deletion is final, so it waits for the button, not the sixth digit. */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="submit"
              size="lg"
              variant="destructive"
              disabled={pending || code.length < CODE_LENGTH}
            >
              {pending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Trash2Icon data-icon="inline-start" />
              )}
              {pending ? t("deleting") : t("confirm")}
            </Button>
            <Link
              href="/account/settings"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              {t("cancel")}
            </Link>
          </div>
        </FieldGroup>
      </form>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendCode();
      }}
    >
      <FieldGroup>
        <p className="text-body-sm">
          {t.rich("confirmBody", {
            email,
            strong: (chunks) => <strong className="text-body-sm-strong">{chunks}</strong>,
          })}
        </p>
        {problemLine}
        <Button type="submit" size="lg" variant="destructive" disabled={pending}>
          {pending && <Spinner data-icon="inline-start" />}
          {pending ? t("sending") : t("sendCode")}
        </Button>
      </FieldGroup>
    </form>
  );
}
