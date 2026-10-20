"use client";

import {
  CircleCheckIcon,
  ClockIcon,
  MailIcon,
  QrCodeIcon,
  SmartphoneIcon,
  WebhookIcon,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useId } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { EmailSettingsBody } from "@/lib/api/generated";

import { adminHref } from "../pages";
import { AdminBadge } from "../ui/badge";
import { emailConnected } from "./email-draft";
import { TextField } from "./text-field";

/**
 * The integrations (Figma AD-CD7), one card each. Brevo / SMTP reads the real email settings and opens them; SePay,
 * the Tasco mini app and webhooks have no backend yet, so they show as not connected and their buttons say "Sắp có".
 */
export function Integrations({ email }: { email: EmailSettingsBody | null }) {
  const t = useTranslations("admin.settings.integrations");
  const soon = useTranslations("admin.shell")("soon");
  const connected = emailConnected(email);
  const secretSet = email?.provider === "brevo" ? email.brevoApiKeySet : email?.smtpPasswordSet;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <IntegrationCard icon={QrCodeIcon} name={t("sepay")} connected={false}>
        <TextField
          id="sepay-key"
          label={t("apiKey")}
          type="password"
          value=""
          onChange={() => undefined}
          disabled
        />
        <div className="flex flex-wrap gap-3">
          <Button disabled title={soon}>
            {t("connect")}
          </Button>
        </div>
      </IntegrationCard>

      <IntegrationCard icon={MailIcon} name={t("email")} connected={connected}>
        <TextField
          id="email-secret"
          label={email?.provider === "brevo" ? t("apiKey") : t("smtpPassword")}
          type="password"
          value=""
          onChange={() => undefined}
          placeholder={secretSet ? t("kept") : undefined}
          disabled
        />
        <div className="flex flex-wrap gap-3">
          <Link
            href={adminHref("settingsEmail")}
            className={buttonVariants({ variant: "neutral" })}
          >
            {t("openEmail")}
          </Link>
          {connected && (
            <Button variant="destructive-outline" disabled title={soon}>
              {t("disconnect")}
            </Button>
          )}
        </div>
      </IntegrationCard>

      <IntegrationCard icon={SmartphoneIcon} name={t("tasco")} connected={false}>
        <TextField id="tasco-app" label={t("appId")} value="" onChange={() => undefined} disabled />
        <div className="flex flex-wrap gap-3">
          <Button disabled title={soon}>
            {t("connect")}
          </Button>
        </div>
      </IntegrationCard>

      <IntegrationCard icon={WebhookIcon} name={t("webhook")} connected={false}>
        <TextField
          id="webhook-url"
          label={t("webhookUrl")}
          type="url"
          value=""
          onChange={() => undefined}
          disabled
        />
        <div className="flex flex-wrap gap-3">
          <Button disabled title={soon}>
            {t("connect")}
          </Button>
          <Button variant="neutral" disabled title={soon}>
            {t("test")}
          </Button>
        </div>
      </IntegrationCard>
    </div>
  );
}

function IntegrationCard({
  icon: Icon,
  name,
  connected,
  children,
}: {
  icon: LucideIcon;
  name: string;
  connected: boolean;
  children: ReactNode;
}) {
  const t = useTranslations("admin.settings.integrations");
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
          <Icon aria-hidden className="size-5" />
        </span>
        <h3 id={titleId} className="min-w-0 flex-1 text-title text-foreground">
          {name}
        </h3>
        {connected ? (
          <AdminBadge tone="success" icon={CircleCheckIcon}>
            {t("connected")}
          </AdminBadge>
        ) : (
          <AdminBadge tone="neutral" icon={ClockIcon}>
            {t("notConnected")}
          </AdminBadge>
        )}
      </div>
      {children}
    </section>
  );
}
