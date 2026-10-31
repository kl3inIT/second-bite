"use client";

import { revalidateLogic } from "@tanstack/react-form";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { refuse, useAppForm } from "@/components/form/app-form";
import { useFieldValidity } from "@/components/form/form-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatPrice } from "@/features/offers/format";
import { Link, useRouter } from "@/i18n/navigation";
import { changePromotion, createPromotion, type PromotionBody } from "@/lib/api/generated";

import {
  amountOf,
  bodyOf,
  promotionSchema,
  valuesOf,
  type ConditionValues,
  type RuleValues,
} from "./promotion-values";
import { RuleDialog } from "./rule-dialog";

/**
 * One promotion, to set up or change (buyer-discount increment): one page as Saleor's promotion is, drawn as the
 * email settings are, white cards with the labels over their fields and the save at the foot. Beside it, what the
 * budget has spent and held, as Medusa's campaign shows its budget. A change applies to the orders placed after it.
 */
export function PromotionForm({
  promotion,
  stores,
  today,
}: {
  promotion: PromotionBody | undefined;
  stores: Array<{ id: string; name: string }>;
  today: string;
}) {
  const t = useTranslations("Admin.promotions.form");
  const format = useFormatter();
  const router = useRouter();
  const [editing, setEditing] = useState<{ at: number | null } | null>(null);

  const form = useAppForm({
    defaultValues: valuesOf(promotion, today),
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: promotionSchema({
        name: t("errors.name"),
        endsAt: t("errors.endsAt"),
        sellers: t("errors.sellers"),
        budget: t("errors.budget"),
        perDay: t("errors.perDay"),
        rules: t("errors.rules"),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      let saved: PromotionBody;
      try {
        saved = promotion
          ? (await changePromotion({ path: { promotionId: promotion.id }, body: bodyOf(value) }))
              .data
          : (await createPromotion({ body: bodyOf(value) })).data;
      } catch (error) {
        refuse(formApi, error);
        return;
      }
      toast.add({ type: "success", title: promotion ? t("saved") : t("created") });
      if (promotion) router.refresh();
      else router.push(`/admin/promotions/${saved.id}`);
    },
  });

  const storeName = new Map(stores.map((s) => [s.id, s.name]));

  return (
    <div className="grid items-start gap-5 lg:grid-cols-3">
      <form
        id={form.formId}
        noValidate
        aria-label={promotion?.name ?? t("newTitle")}
        className="flex min-w-0 flex-col gap-5 lg:col-span-2"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.AppForm>
          <form.FormError title={t("refused")} fallback={t("failed")} />
        </form.AppForm>

        <Card size="lg">
          <CardHeader>
            <CardTitle>{t("general")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <form.AppField name="name">
                {(field) => (
                  <field.TextField
                    label={t("name")}
                    description={t("nameHint")}
                    autoComplete="off"
                    required
                  />
                )}
              </form.AppField>
              <div className="grid gap-4 md:grid-cols-2">
                <form.AppField name="startsAt">
                  {(field) => <field.TextField label={t("startsAt")} type="datetime-local" />}
                </form.AppField>
                <form.AppField name="endsAt">
                  {(field) => (
                    <field.TextField
                      label={t("endsAt")}
                      type="datetime-local"
                      description={t("timeHint")}
                    />
                  )}
                </form.AppField>
              </div>
              <form.AppField name="allSellers">
                {() => (
                  <ScopeField label={t("scope")} all={t("allStores")} some={t("someStores")} />
                )}
              </form.AppField>
              <form.Subscribe selector={(state) => state.values.allSellers}>
                {(all) =>
                  !all && (
                    <form.AppField name="sellerIds">
                      {() => <StoresField label={t("stores")} stores={stores} />}
                    </form.AppField>
                  )
                }
              </form.Subscribe>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card size="lg">
          <CardHeader>
            <CardTitle>{t("limits")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <form.AppField name="budgetVnd">
                {(field) => (
                  <field.TextField
                    label={t("budget")}
                    description={t("budgetHint")}
                    inputMode="numeric"
                    autoComplete="off"
                  />
                )}
              </form.AppField>
              <form.AppField name="perPhonePerDay">
                {(field) => (
                  <field.TextField
                    label={t("perDay")}
                    description={t("perDayHint")}
                    inputMode="numeric"
                    autoComplete="off"
                  />
                )}
              </form.AppField>
            </div>
          </CardContent>
        </Card>

        <Card size="lg">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>{t("rules")}</CardTitle>
              <Button type="button" variant="outline" onClick={() => setEditing({ at: null })}>
                <PlusIcon data-icon="inline-start" aria-hidden />
                {t("addRule")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form.AppField name="rules">
              {() => (
                <RulesField
                  hint={t("rulesHint")}
                  storeName={storeName}
                  onEdit={(at) => setEditing({ at })}
                />
              )}
            </form.AppField>
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
                        : promotion
                          ? t("updated", {
                              time: format.dateTime(new Date(promotion.updatedAt), "time"),
                              day: format.dateTime(new Date(promotion.updatedAt), "day"),
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
                    <form.SubmitButton disabled={promotion !== undefined && !dirty}>
                      {promotion ? t("save") : t("create")}
                    </form.SubmitButton>
                  </div>
                </CardContent>
              </Card>
            )}
          </form.Subscribe>
        </form.AppForm>

        <form.Field name="rules" mode="array">
          {(rules) => (
            <RuleDialog
              open={editing !== null}
              rule={editing?.at != null ? rules.state.value[editing.at] : undefined}
              stores={stores}
              onOpenChange={(open) => {
                if (!open) setEditing(null);
              }}
              onSave={(rule) => {
                if (editing?.at != null) rules.replaceValue(editing.at, rule);
                else rules.pushValue(rule);
                setEditing(null);
              }}
            />
          )}
        </form.Field>
      </form>

      <aside className="flex flex-col gap-5" aria-label={t("aside")}>
        {promotion && <BudgetCard promotion={promotion} />}
        <Card size="lg">
          <CardHeader>
            <CardTitle>{t("state")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form.AppField name="enabled">
              {() => <EnabledField label={t("enabled")} hint={t("enabledHint")} />}
            </form.AppField>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

/** Every store or some, as two choices of one switch. */
function ScopeField({ label, all, some }: { label: string; all: string; some: string }) {
  const { field, ids } = useFieldValidity<boolean>();
  return (
    <Field>
      <FieldLabel id={ids.control}>{label}</FieldLabel>
      <ToggleGroup
        variant="segment"
        aria-labelledby={ids.control}
        value={[field.state.value ? "all" : "some"]}
        onValueChange={(chosen: string[]) => {
          if (chosen[0]) field.handleChange(chosen[0] === "all");
        }}
      >
        <ToggleGroupItem value="all">{all}</ToggleGroupItem>
        <ToggleGroupItem value="some">{some}</ToggleGroupItem>
      </ToggleGroup>
    </Field>
  );
}

/** The stores a promotion runs for, one box each. */
function StoresField({
  label,
  stores,
}: {
  label: string;
  stores: Array<{ id: string; name: string }>;
}) {
  const { field, invalid, errors, ids } = useFieldValidity<string[]>();
  const chosen = field.state.value;
  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel id={ids.control}>{label}</FieldLabel>
      <fieldset
        aria-labelledby={ids.control}
        aria-describedby={invalid ? ids.error : undefined}
        className="grid max-h-56 gap-1.5 overflow-y-auto rounded-lg border border-border p-3 sm:grid-cols-2"
      >
        {stores.map((store) => (
          <label
            key={store.id}
            htmlFor={`${ids.control}-${store.id}`}
            className="flex min-h-9 items-center gap-2 text-body-sm"
          >
            <Checkbox
              id={`${ids.control}-${store.id}`}
              checked={chosen.includes(store.id)}
              onCheckedChange={(checked: boolean) =>
                field.handleChange(
                  checked ? [...chosen, store.id] : chosen.filter((id) => id !== store.id),
                )
              }
            />
            {store.name}
          </label>
        ))}
      </fieldset>
      {invalid && <FieldError id={ids.error} errors={errors} />}
    </Field>
  );
}

/** The rules of the promotion, one line each with what it takes off, its conditions, and its pen and bin. */
function RulesField({
  hint,
  storeName,
  onEdit,
}: {
  hint: string;
  storeName: Map<string, string>;
  onEdit: (at: number) => void;
}) {
  const t = useTranslations("Admin.promotions.form");
  const { field, invalid, errors, ids } = useFieldValidity<RuleValues[]>();
  const rules = field.state.value;

  return (
    <Field data-invalid={invalid || undefined}>
      <FieldDescription id={ids.hint}>{hint}</FieldDescription>
      <ul className="flex flex-col gap-2.5" aria-describedby={ids.hint}>
        {rules.map((rule, at) => (
          <li
            key={`${rule.name}-${at}`}
            className="flex items-center gap-3.5 rounded-xl border border-border p-3.5"
          >
            <span className="flex min-w-24 flex-col items-center rounded-lg bg-fresh-muted px-2 py-1.5 text-fresh-foreground">
              <span className="font-display text-price">{rewardOf(rule, t)}</span>
              <span className="text-label">{t("perOrder")}</span>
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-body-sm-strong text-foreground">{rule.name}</span>
              <span className="flex flex-wrap gap-1.5">
                {rule.conditions.length === 0 && (
                  <span className="rounded-full border border-border bg-muted px-2.5 text-label">
                    {t("everyOrder")}
                  </span>
                )}
                {rule.conditions.map((c, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-border bg-muted px-2.5 text-label"
                  >
                    {conditionText(c, t, storeName)}
                  </span>
                ))}
              </span>
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("editRule", { name: rule.name })}
              onClick={() => onEdit(at)}
            >
              <PencilIcon aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("removeRule", { name: rule.name })}
              onClick={() => field.removeValue(at)}
            >
              <Trash2Icon aria-hidden />
            </Button>
          </li>
        ))}
      </ul>
      {invalid && <FieldError id={ids.error} errors={errors} />}
    </Field>
  );
}

type FormT = ReturnType<typeof useTranslations<"Admin.promotions.form">>;

function rewardOf(rule: RuleValues, t: FormT): string {
  return rule.type === "fixed"
    ? `−${formatPrice(amountOf(rule.value))}`
    : t("percentOff", { value: amountOf(rule.value) });
}

function conditionText(c: ConditionValues, t: FormT, storeName: Map<string, string>): string {
  switch (c.attribute) {
    case "customer":
      return c.value === "new" ? t("condition.new") : t("condition.returning");
    case "subtotal":
      return c.operator === "gte"
        ? t("condition.from", { amount: formatPrice(amountOf(c.value)) })
        : t("condition.under", { amount: formatPrice(amountOf(c.value)) });
    case "seller": {
      const names = c.sellerIds.map((id) => storeName.get(id) ?? id).join(", ");
      return c.operator === "in" ? t("condition.at", { names }) : t("condition.notAt", { names });
    }
  }
}

/** Whether the promotion runs: off pauses it at once; the orders placed keep their discount. */
function EnabledField({ label, hint }: { label: string; hint: string }) {
  const { field, ids } = useFieldValidity<boolean>();
  return (
    <Field orientation="horizontal">
      <Switch
        id={ids.control}
        checked={field.state.value}
        aria-describedby={ids.hint}
        onCheckedChange={(checked: boolean) => field.handleChange(checked)}
      />
      <div className="flex flex-col gap-0.5">
        <FieldLabel htmlFor={ids.control}>{label}</FieldLabel>
        <FieldDescription id={ids.hint}>{hint}</FieldDescription>
      </div>
    </Field>
  );
}

/** What the budget has spent on the orders handed over and holds for those still to collect, and what is left. */
function BudgetCard({ promotion }: { promotion: PromotionBody }) {
  const t = useTranslations("Admin.promotions.budget");
  const { budgetVnd, use } = promotion;
  return (
    <Card size="lg">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <p className="flex flex-col">
            <span className="font-display text-price-lg text-foreground">
              {formatPrice(use.leftVnd)}
            </span>
            <span className="text-label text-muted-foreground">
              {t("leftOf", { budget: formatPrice(budgetVnd) })}
            </span>
          </p>
          <Progress
            value={Math.min(100, ((use.spentVnd + use.heldVnd) / budgetVnd) * 100)}
            aria-label={t("usedLabel")}
          />
          <dl className="flex flex-col gap-1.5 text-body-sm">
            <Row label={t("spent")} value={formatPrice(use.spentVnd)} />
            <Row label={t("held")} value={formatPrice(use.heldVnd)} />
            <Row label={t("orders")} value={String(use.orders)} />
            <Row label={t("newCustomers")} value={String(use.newCustomers)} />
            <Row label={t("stores")} value={String(use.sellers)} />
          </dl>
          <p className="text-label text-muted-foreground">{t("hint")}</p>
          <Link
            href={`/admin/promotions/payouts?promotion=${promotion.id}`}
            className="text-body-sm-strong text-link hover:underline"
          >
            {t("payouts")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-display text-foreground">{value}</dd>
    </div>
  );
}
