"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { buttonVariants } from "@/components/ui/button";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Link, useRouter } from "@/i18n/navigation";
import { registerWithPassword } from "@/lib/api/generated";

/**
 * A username as the server's rule reads it (server/internal/identity, usernamePattern): 3 to 30 letters without
 * marks, digits, `.`, `_` and `-`, the first and the last a letter or a digit. Capitals count: Lan and lan are two
 * names, and the server keeps what was typed.
 */
const USERNAME = /^[A-Za-z0-9][A-Za-z0-9._-]{1,28}[A-Za-z0-9]$/;

/** The most characters a password has; the server counts them the same way (minPasswordLength, maxPasswordLength). */
const PASSWORD_LENGTH = { min: 8, max: 128 } as const;

// The register screen's form (SEC-193, Figma "Tạo tài khoản" L10): a username, a password and the password again,
// nothing else. The account is made and signed in at once, the session arriving as the httpOnly cookie, and the
// person goes back to the page that sent them. The server's words for a refusal go under the field they concern
// (SEC-28), a username that is taken under the username.
export function RegisterForm({ returnTo }: { returnTo: string }) {
  const t = useTranslations("Register");
  const legal = useTranslations("SignIn");
  const router = useRouter();

  const form = useAppForm({
    defaultValues: { username: "", password: "", confirm: "" },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: z
        .object({
          username: z.string().trim().regex(USERNAME, t("errors.username")),
          password: z
            .string()
            .min(PASSWORD_LENGTH.min, t("errors.password"))
            .max(PASSWORD_LENGTH.max, t("errors.password")),
          confirm: z.string(),
        })
        .refine((value) => value.password === value.confirm, {
          path: ["confirm"],
          message: t("errors.mismatch"),
        }),
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await registerWithPassword({
          body: { username: value.username.trim(), password: value.password, session: "cookie" },
        });
      } catch (error) {
        refuse(formApi, error, {
          IDENTITY_USERNAME_INVALID: "username",
          IDENTITY_USERNAME_TAKEN: "username",
          IDENTITY_PASSWORD_INVALID: "password",
        });
        return;
      }
      router.replace(returnTo);
      router.refresh();
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
        <h1 className="text-page-title text-foreground">{t("heading")}</h1>
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
              autoComplete="new-password"
              required
              variant="pill"
              placeholder={t("passwordPlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppField name="confirm">
          {(field) => (
            <field.TextField
              label={t("confirmLabel")}
              type="password"
              autoComplete="new-password"
              required
              variant="pill"
              placeholder={t("confirmPlaceholder")}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.FormError fallback={t("failed")} />
          <form.SubmitButton size="lg" pendingLabel={t("submitting")}>
            {t("submit")}
          </form.SubmitButton>
        </form.AppForm>
        <p className="text-center text-body-sm text-muted-foreground">
          {t("haveAccount")}{" "}
          <Link
            href={{ pathname: "/sign-in", query: { returnTo } }}
            className={buttonVariants({ variant: "link", size: "inline" })}
          >
            {t("signIn")}
          </Link>
        </p>
        <FieldDescription className="text-center">
          {legal.rich("legal", {
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
