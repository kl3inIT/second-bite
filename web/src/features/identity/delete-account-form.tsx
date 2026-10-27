"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { CircleCheckIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { deleteMyAccount, requestAccountDeletionCode } from "@/lib/api/generated";

import {
  CodeField,
  codeIsGone,
  codeRefusals,
  codeRule,
  RESEND_AFTER_SECONDS,
  ResendCode,
} from "./code-field";

type Code = { challengeId: string; resendAt: number };

// Deleting the signed-in account (SEC-37): a code emailed to the account's address, then the code. The server
// ends the session and clears its cookie, and the page is read again at `?done=1`: the confirmation is the
// server's, so it stays while the header and the rest of the page turn signed out (SEC-69). Each step is a form
// of its own (docs/guidelines/web.md › Forms).
export function DeleteAccountForm({ email }: { email: string }) {
  const [code, setCode] = useState<Code>();

  function sent(challengeId: string) {
    setCode({ challengeId, resendAt: Date.now() + RESEND_AFTER_SECONDS * 1000 });
  }

  return code ? (
    <CodeStep email={email} code={code} onResent={sent} />
  ) : (
    <ConfirmStep email={email} onSent={sent} />
  );
}

/** What the deletion does, and the button that sends the code. */
function ConfirmStep({ email, onSent }: { email: string; onSent: (challengeId: string) => void }) {
  const t = useTranslations("DeleteAccount");

  const form = useAppForm({
    defaultValues: {},
    onSubmit: async ({ formApi }) => {
      try {
        const { data } = await requestAccountDeletionCode();
        onSent(data.challengeId);
      } catch (error) {
        refuse(formApi, error);
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
        <p className="text-body-sm">
          {t.rich("confirmBody", {
            email,
            strong: (chunks) => <strong className="text-body-sm-strong">{chunks}</strong>,
          })}
        </p>
        <p className="text-body-sm-strong">{t("final")}</p>
        <form.AppForm>
          <form.FormError fallback={t("failed")} />
          <div className="flex flex-col gap-2">
            <form.SubmitButton size="lg" variant="danger" pendingLabel={t("sending")}>
              {t("sendCode")}
            </form.SubmitButton>
            <Link
              href="/account/settings"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              {t("cancel")}
            </Link>
          </div>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}

// The code's step. The deletion is final, so it waits for the button, not the sixth digit. A code that can no
// longer be used offers a new one at once.
function CodeStep({
  email,
  code,
  onResent,
}: {
  email: string;
  code: Code;
  onResent: (challengeId: string) => void;
}) {
  const t = useTranslations("DeleteAccount");
  const router = useRouter();
  const [gone, setGone] = useState(false);
  const [resending, startResending] = useTransition();

  const form = useAppForm({
    defaultValues: { code: "" },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: z.object({ code: codeRule(t("errors.code")) }) },
    onSubmit: async ({ value, formApi }) => {
      try {
        await deleteMyAccount({ body: { challengeId: code.challengeId, code: value.code } });
      } catch (error) {
        formApi.setFieldValue("code", "");
        setGone(codeIsGone(error instanceof ApiError ? error.code : undefined));
        refuse(formApi, error, codeRefusals);
        return;
      }
      router.replace({ pathname: "/delete-account", query: { done: "1" } });
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
        const { data } = await requestAccountDeletionCode();
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
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(submitting) => (
            <>
              <form.AppField name="code">
                {() => (
                  <CodeField label={t("codeLabel")} disabled={submitting || resending}>
                    <ResendCode
                      key={code.resendAt}
                      resendAt={gone ? 0 : code.resendAt}
                      disabled={submitting || resending}
                      onResend={resend}
                    />
                  </CodeField>
                )}
              </form.AppField>
              <form.AppForm>
                <form.FormError fallback={t("failed")} />
              </form.AppForm>
              <div className="flex flex-col gap-2">
                <Button type="submit" size="lg" variant="danger" disabled={submitting || resending}>
                  {submitting ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <Trash2Icon data-icon="inline-start" />
                  )}
                  {submitting ? t("deleting") : t("confirm")}
                </Button>
                <Link
                  href="/account/settings"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  {t("cancel")}
                </Link>
              </div>
            </>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}

// The confirmation after the deletion, rendered by the page at `?done=1` once no one is signed in. Focus moves to
// it, so a keyboard or a screen reader starts at the outcome.
export function DeleteAccountDone() {
  const t = useTranslations("DeleteAccount");
  useEffect(() => {
    document.getElementById("delete-account-done")?.focus();
  }, []);

  return (
    // Figma Q5: the tick on its own line, the title, what it means, and the way home across the card.
    <div className="flex flex-col gap-3" aria-live="polite">
      <CircleCheckIcon aria-hidden className="size-7 text-success" />
      <h2 id="delete-account-done" tabIndex={-1} className="text-title outline-none">
        {t("doneTitle")}
      </h2>
      <p className="text-body-sm">{t("doneBody")}</p>
      <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
        {t("home")}
      </Link>
    </div>
  );
}
