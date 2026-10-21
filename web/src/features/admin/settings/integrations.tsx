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
import { type ComponentProps, type ReactElement, type ReactNode, useId } from "react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";
import type { EmailSettingsBody } from "@/lib/api/generated";

import { adminHref } from "../pages";
import { emailConnected } from "./email-draft";

/**
 * The integrations (Figma AD-CD7), one card each. Brevo / SMTP reads the real email settings and opens them; SePay,
 * the Tasco mini app and webhooks have no backend yet, so they show as not connected and their buttons say "Sắp có".
 */
export function Integrations({ email }: { email: EmailSettingsBody | null }) {
  const t = useTranslations("admin.settings.integrations");
  const soon = useTranslations("admin.shell")("soon");
  const connected = emailConnected(email);
  const secretSet = email?.provider === "brevo" ? email.brevoApiKeySet : email?.smtpPasswordSet;

  // A button whose backend does not exist yet: off, with "Sắp có" under the pointer and on focus.
  function soonButton(button: ReactElement) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span />}>{button}</TooltipTrigger>
        <TooltipContent>{soon}</TooltipContent>
      </Tooltip>
    );
  }

  // A field that cannot be filled until its integration has a backend.
  function field(id: string, label: string, input: ComponentProps<typeof Input> = {}) {
    return (
      <Field>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Input id={id} value="" readOnly disabled {...input} />
      </Field>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <IntegrationCard icon={QrCodeIcon} name={t("sepay")} connected={false}>
        {field("sepay-key", t("apiKey"), { type: "password" })}
        <div className="flex flex-wrap gap-3">
          {soonButton(<Button disabled>{t("connect")}</Button>)}
        </div>
      </IntegrationCard>

      <IntegrationCard icon={MailIcon} name={t("email")} connected={connected}>
        {field("email-secret", email?.provider === "brevo" ? t("apiKey") : t("smtpPassword"), {
          type: "password",
          placeholder: secretSet ? t("kept") : undefined,
        })}
        <div className="flex flex-wrap gap-3">
          <Link
            href={adminHref("settingsEmail")}
            className={buttonVariants({ variant: "outline" })}
          >
            {t("openEmail")}
          </Link>
          {connected &&
            soonButton(
              <Button variant="destructive" disabled>
                {t("disconnect")}
              </Button>,
            )}
        </div>
      </IntegrationCard>

      <IntegrationCard icon={SmartphoneIcon} name={t("tasco")} connected={false}>
        {field("tasco-app", t("appId"))}
        <div className="flex flex-wrap gap-3">
          {soonButton(<Button disabled>{t("connect")}</Button>)}
        </div>
      </IntegrationCard>

      <IntegrationCard icon={WebhookIcon} name={t("webhook")} connected={false}>
        {field("webhook-url", t("webhookUrl"), { type: "url" })}
        <div className="flex flex-wrap gap-3">
          {soonButton(<Button disabled>{t("connect")}</Button>)}
          {soonButton(
            <Button variant="outline" disabled>
              {t("test")}
            </Button>,
          )}
        </div>
      </IntegrationCard>
    </div>
  );
}

// One integration's card: its icon and name, whether it is connected, then its field and buttons.
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
    <section aria-labelledby={titleId}>
      <Card>
        <CardHeader>
          <CardTitle>
            <h3 id={titleId} className="flex items-center gap-3">
              <Icon aria-hidden className="size-5 shrink-0 text-primary" />
              {name}
            </h3>
          </CardTitle>
          <CardAction>
            {connected ? (
              <Badge variant="fresh">
                <CircleCheckIcon aria-hidden />
                {t("connected")}
              </Badge>
            ) : (
              <Badge variant="outline">
                <ClockIcon aria-hidden />
                {t("notConnected")}
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">{children}</div>
        </CardContent>
      </Card>
    </section>
  );
}
