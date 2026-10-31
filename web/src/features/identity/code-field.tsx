"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { z } from "zod";

import { useFieldValidity } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export const CODE_LENGTH = 6;
/** How long "Gửi lại mã" waits after a code is sent: the server refuses a new code for a minute
 * (server/internal/identity, codeCooldown), so the button never offers what would be refused. */
export const RESEND_AFTER_SECONDS = 60;

/** The codes a refused code answers with, all said under the code's field. */
export const codeRefusals = {
  IDENTITY_CODE_INCORRECT: "code",
  IDENTITY_CHALLENGE_GONE: "code",
  IDENTITY_CODE_ATTEMPTS_EXHAUSTED: "code",
} as const;

/** Whether a refusal means the code can no longer be used, so a new one is offered at once. */
export function codeIsGone(code: string | undefined) {
  return code === "IDENTITY_CHALLENGE_GONE" || code === "IDENTITY_CODE_ATTEMPTS_EXHAUSTED";
}

/** The rule of an emailed code: its six digits. */
export function codeRule(message: string) {
  return z.string().length(CODE_LENGTH, message);
}

/**
 * The six digits of an emailed code, as a field of `useAppForm` (docs/guidelines/web.md › Forms). The label is
 * for a screen reader only, as the heading above says what is asked. `onComplete` is given the sixth digit, for
 * a form that sends itself then. What goes under the field (`children`) follows its error.
 */
export function CodeField({
  label,
  disabled,
  onComplete,
  children,
}: {
  label: string;
  disabled?: boolean;
  onComplete?: () => void;
  children?: React.ReactNode;
}) {
  const { field, invalid, errors, ids } = useFieldValidity<string>();

  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={ids.control} className="sr-only">
        {label}
      </FieldLabel>
      <InputOTP
        id={ids.control}
        maxLength={CODE_LENGTH}
        pattern={REGEXP_ONLY_DIGITS}
        // A code copied from a mail app often carries spaces or a line break; keep its digits, as GOV.UK asks,
        // rather than drop the paste (WCAG 2.2, 3.3.8).
        pasteTransformer={(pasted: string) => pasted.replace(/\D/g, "")}
        inputMode="numeric"
        autoComplete="one-time-code"
        value={field.state.value}
        onChange={(value: string) => field.handleChange(value)}
        onBlur={field.handleBlur}
        onComplete={onComplete}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? ids.error : undefined}
        containerClassName="w-full"
      >
        {/* Six 56 px boxes and their gaps need 386 px; on a narrower phone they share the width (SEC-188). */}
        <InputOTPGroup className="w-full">
          {Array.from({ length: CODE_LENGTH }, (_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              aria-invalid={invalid || undefined}
              className="w-auto max-w-14 min-w-0 flex-1"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {invalid && <FieldError id={ids.error} errors={errors} />}
      {children}
    </Field>
  );
}

/** "Gửi lại mã sau 0:28", then the button itself once the wait is over. */
export function ResendCode({
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
