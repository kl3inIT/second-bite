"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { TriangleAlertIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { z } from "zod";

import { refuse, useAppForm } from "@/components/form/app-form";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import {
  saveOfferSettings,
  saveOrderSettings,
  type OfferSettingsBody,
  type OrderSettingsBody,
} from "@/lib/api/generated";

type Values = {
  defaultMaxPerOrder: string;
  openPerPhonePerSeller: string;
  missedLimit: string;
  missedDays: string;
};

type Saved = { body: Omit<OfferSettingsBody, "updatedAt" | "updatedBy">; version: string };

/** A whole number from min to max, as the field holds it. */
function wholeBetween(min: number, max: number, message: string) {
  return z.string().refine((value) => {
    const n = Number(value);
    return /^\d+$/.test(value) && n >= min && n <= max;
  }, message);
}

// The limits on what one person holds (SEC-158, Figma L7): the cap per order of a post its store left without one,
// which the offer settings keep, and the orders still to collect and missed, which the order settings keep. One form
// saves both, each with its own version (If-Match), and only the one that changed, so two admins never overwrite
// each other.
export function OrderLimitsForm({
  offer,
  order,
  orderVersion,
}: {
  offer: Saved & { updatedAt?: string };
  order: OrderSettingsBody;
  orderVersion: string;
}) {
  const t = useTranslations("Admin.orderLimits");
  const format = useFormatter();
  const router = useRouter();
  const [conflict, setConflict] = useState(false);

  const range = (min: number, max: number) => t("errors.range", { min, max });
  const schema = z.object({
    defaultMaxPerOrder: wholeBetween(1, 999, range(1, 999)),
    openPerPhonePerSeller: wholeBetween(1, 20, range(1, 20)),
    missedLimit: wholeBetween(1, 20, range(1, 20)),
    missedDays: wholeBetween(1, 60, range(1, 60)),
  });

  const defaultValues: Values = {
    defaultMaxPerOrder: String(offer.body.defaultMaxPerOrder),
    openPerPhonePerSeller: String(order.openPerPhonePerSeller),
    missedLimit: String(order.missedLimit),
    missedDays: String(order.missedDays),
  };

  // What the offer settings hold once saved by this form: when the order settings then fail, a retry saves only
  // them, and the offer settings again only at the version that save answered (SEC-205).
  const savedOffer = useRef({
    value: defaultValues.defaultMaxPerOrder,
    body: offer.body,
    version: offer.version,
  });

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: schema },
    onSubmit: async ({ value, formApi }) => {
      setConflict(false);
      try {
        if (value.defaultMaxPerOrder !== savedOffer.current.value) {
          const { data, response } = await saveOfferSettings({
            body: {
              ...savedOffer.current.body,
              defaultMaxPerOrder: Number(value.defaultMaxPerOrder),
            },
            headers: { "If-Match": savedOffer.current.version },
          });
          const { updatedAt: _at, updatedBy: _by, ...body } = data;
          savedOffer.current = {
            value: value.defaultMaxPerOrder,
            body,
            version: response.headers.get("etag") ?? savedOffer.current.version,
          };
        }
        const orderChanged = (["openPerPhonePerSeller", "missedLimit", "missedDays"] as const).some(
          (key) => value[key] !== defaultValues[key],
        );
        if (orderChanged) {
          await saveOrderSettings({
            body: {
              openPerPhonePerSeller: Number(value.openPerPhonePerSeller),
              missedLimit: Number(value.missedLimit),
              missedDays: Number(value.missedDays),
            },
            headers: { "If-Match": orderVersion },
          });
        }
      } catch (error) {
        if (error instanceof ApiError && error.code === "PLATFORM_CHANGED_SINCE_READ") {
          setConflict(true);
          return;
        }
        refuse(formApi, error);
        return;
      }
      toast.add({ type: "success", title: t("saved"), description: t("savedHint") });
      // The page reads both settings again with their new versions; the form starts over from them.
      router.refresh();
    },
  });

  const updated = [offer.updatedAt, order.updatedAt]
    .filter((at): at is string => Boolean(at))
    .map((at) => new Date(at))
    .toSorted((a, b) => b.getTime() - a.getTime())[0];

  return (
    <form
      id={form.formId}
      noValidate
      aria-labelledby="order-limits-title"
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <h2 id="order-limits-title" className="text-headline text-foreground">
        {t("title")}
      </h2>

      {conflict && (
        <Alert variant="warning">
          <TriangleAlertIcon />
          <AlertTitle>{t("conflict.title")}</AlertTitle>
          <AlertDescription>{t("conflict.body")}</AlertDescription>
          <AlertAction>
            <Button type="button" variant="secondary" size="sm" onClick={() => router.refresh()}>
              {t("conflict.reload")}
            </Button>
          </AlertAction>
        </Alert>
      )}

      <form.AppForm>
        <form.FormError fallback={t("failed")} />
      </form.AppForm>

      <Card size="lg">
        <CardHeader>
          <CardTitle>{t("perDish.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <form.AppField name="defaultMaxPerOrder">
                {(field) => (
                  <field.TextField
                    label={t("perDish.default")}
                    inputMode="numeric"
                    autoComplete="off"
                    description={t("perDish.defaultHint")}
                  />
                )}
              </form.AppField>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card size="lg">
        <CardHeader>
          <CardTitle>{t("open.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <form.AppField name="openPerPhonePerSeller">
                {(field) => (
                  <field.TextField
                    label={t("open.perPhone")}
                    inputMode="numeric"
                    autoComplete="off"
                    description={t("open.perPhoneHint")}
                  />
                )}
              </form.AppField>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card size="lg">
        <CardHeader>
          <CardTitle>{t("missed.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <form.AppField name="missedLimit">
                {(field) => (
                  <field.TextField
                    label={t("missed.limit")}
                    inputMode="numeric"
                    autoComplete="off"
                    description={t("missed.limitHint")}
                  />
                )}
              </form.AppField>
              <form.AppField name="missedDays">
                {(field) => (
                  <field.TextField
                    label={t("missed.days")}
                    inputMode="numeric"
                    autoComplete="off"
                    description={t("missed.daysHint")}
                  />
                )}
              </form.AppField>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <form.AppForm>
        <form.Subscribe selector={(state) => [state.isDirty, state.isSubmitting] as const}>
          {([dirty, submitting]) => (
            <Card size="lg">
              <CardContent>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="flex-1 text-label text-muted-foreground" aria-live="polite">
                    {dirty
                      ? t("dirty")
                      : updated
                        ? t("updated", {
                            time: format.dateTime(updated, "time"),
                            day: format.dateTime(updated, "day"),
                          })
                        : t("never")}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={!dirty || submitting}
                    onClick={() => form.reset()}
                  >
                    {t("cancel")}
                  </Button>
                  <form.SubmitButton disabled={!dirty}>{t("save")}</form.SubmitButton>
                </div>
              </CardContent>
            </Card>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}
