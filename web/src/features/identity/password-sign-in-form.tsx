"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { MailIcon, MailWarningIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { signInWithGoogle, signInWithPassword } from "@/lib/api/generated";

import { emailInToken, GoogleButton } from "./google-button";

// The sign-in screen's form (SEC-193, Figma "Đăng nhập" L11): a username and a password, then the other ways in under
// the button, the emailed code on a screen of its own (L12) and Google, and the way to register. Either way the
// session arrives as the httpOnly cookie, and the person goes back to the page that sent them. The server's words
// for a refusal go above the button, or under the field they concern (SEC-28); an unknown username and a wrong
// password are one refusal there, so the form does not say which it was.
export function PasswordSignInForm({
  returnTo,
  googleClientId,
}: {
  returnTo: string;
  googleClientId?: string;
}) {
  const t = useTranslations("SignIn");
  const router = useRouter();
  const [google, startGoogle] = useTransition();
  // The address Google named when it already has an account Google does not speak for ("" when unknown): the
  // emailed code proves it today (SEC-29 › decision 4).
  const [needsCode, setNeedsCode] = useState<string>();

  function signedIn() {
    router.replace(returnTo);
    router.refresh();
  }

  const form = useAppForm({
    defaultValues: { username: "", password: "" },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z.object({
        username: z.string().trim().min(1, t("errors.username")),
        password: z.string().min(1, t("errors.password")),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await signInWithPassword({
          body: { username: value.username.trim(), password: value.password, session: "cookie" },
        });
      } catch (error) {
        // A password that was refused is not kept in the form.
        formApi.setFieldValue("password", "");
        refuse(formApi, error);
        return;
      }
      signedIn();
    },
  });

  function continueWithGoogle(idToken: string, nonce: string) {
    startGoogle(async () => {
      try {
        await signInWithGoogle({ body: { idToken, nonce, session: "cookie" } });
        signedIn();
      } catch (error) {
        if (error instanceof ApiError && error.code === "IDENTITY_GOOGLE_LINK_REQUIRED") {
          setNeedsCode(emailInToken(idToken) ?? "");
          return;
        }
        refuse(form, error);
      }
    });
  }

  const emailHref = { pathname: "/sign-in/email", query: { returnTo } } as const;

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
        {needsCode !== undefined && (
          <Alert variant="warning">
            <MailWarningIcon aria-hidden />
            <AlertTitle>{t("googleNeedsCodeTitle")}</AlertTitle>
            <AlertDescription>
              {needsCode
                ? t("googleNeedsCodeBody", { email: needsCode })
                : t("googleNeedsCodeBodyNoAddress")}
            </AlertDescription>
          </Alert>
        )}
        <form.AppField name="username">
          {(field) => (
            <field.TextField
              label={t("usernameLabel")}
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              variant="pill"
              placeholder={t("usernamePlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField
              label={t("passwordLabel")}
              type="password"
              autoComplete="current-password"
              required
              variant="pill"
              placeholder={t("passwordPlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.FormError fallback={t("failed")} />
          <form.SubmitButton size="lg" disabled={google} pendingLabel={t("signingIn")}>
            {t("signIn")}
          </form.SubmitButton>
        </form.AppForm>
        <div className="flex items-center gap-3 text-label text-muted-foreground">
          <span aria-hidden className="h-px flex-1 bg-border" />
          {t("or")}
          <span aria-hidden className="h-px flex-1 bg-border" />
        </div>
        <Link href={emailHref} className={buttonVariants({ variant: "outline", size: "lg" })}>
          <MailIcon aria-hidden data-icon="inline-start" />
          {t("emailSignIn")}
        </Link>
        {googleClientId && (
          <GoogleButton clientId={googleClientId} onCredential={continueWithGoogle} />
        )}
        <p className="text-center text-body-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link
            href={{ pathname: "/register", query: { returnTo } }}
            className={buttonVariants({ variant: "link", size: "inline" })}
          >
            {t("register")}
          </Link>
        </p>
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
