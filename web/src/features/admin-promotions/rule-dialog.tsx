"use client";

import { PlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  conditionOf,
  operatorsOf,
  ruleProblems,
  type Attribute,
  type ConditionValues,
  type Operator,
  type RuleValues,
} from "./promotion-values";

const attributes: Attribute[] = ["customer", "subtotal", "seller"];

const emptyRule: RuleValues = {
  name: "",
  conditions: [conditionOf("customer")],
  type: "fixed",
  value: "",
  maxVnd: "",
};

/**
 * Adding or changing one rule of a promotion (buyer-discount increment), as Saleor's "Create rule" dialog orders it:
 * its name, its conditions, then what it takes off. The conditions are drawn as Medusa's rules form draws them, a
 * box each with what it reads above its operator and value, joined by "VÀ" since all must hold. The dialog only
 * edits the promotion's form; the promotion is saved with it.
 */
export function RuleDialog({
  open,
  rule,
  stores,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  rule: RuleValues | undefined;
  stores: Array<{ id: string; name: string }>;
  onOpenChange: (open: boolean) => void;
  onSave: (rule: RuleValues) => void;
}) {
  const t = useTranslations("Admin.promotions.rule");
  // The dialog starts over from the rule each time it opens: its key is the rule it edits.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{rule ? t("editTitle") : t("addTitle")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        {open && (
          <RuleEditor
            key={rule?.name ?? ""}
            initial={rule ?? emptyRule}
            stores={stores}
            onCancel={() => onOpenChange(false)}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function RuleEditor({
  initial,
  stores,
  onCancel,
  onSave,
}: {
  initial: RuleValues;
  stores: Array<{ id: string; name: string }>;
  onCancel: () => void;
  onSave: (rule: RuleValues) => void;
}) {
  const t = useTranslations("Admin.promotions.rule");
  const id = useId();
  const [rule, setRule] = useState(initial);
  const [tried, setTried] = useState(false);
  const problems = ruleProblems(rule, {
    name: t("errors.name"),
    value: t("errors.value"),
    percent: t("errors.percent"),
    maxVnd: t("errors.maxVnd"),
    amount: t("errors.amount"),
    stores: t("errors.stores"),
  });
  const shown = tried ? problems : {};

  const setCondition = (at: number, change: Partial<ConditionValues>) =>
    setRule({
      ...rule,
      conditions: rule.conditions.map((c, i) => (i === at ? { ...c, ...change } : c)),
    });

  return (
    <div className="flex flex-col gap-5">
      <Field data-invalid={shown.name ? true : undefined}>
        <FieldLabel htmlFor={`${id}-name`}>{t("name")}</FieldLabel>
        <Input
          id={`${id}-name`}
          value={rule.name}
          placeholder={t("namePlaceholder")}
          aria-invalid={shown.name ? true : undefined}
          onChange={(event) => setRule({ ...rule, name: event.target.value })}
        />
        {shown.name && <FieldError>{shown.name}</FieldError>}
      </Field>

      <section aria-labelledby={`${id}-conditions`} className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <h3 id={`${id}-conditions`} className="text-title text-foreground">
            {t("conditions")}
          </h3>
          <span className="text-label text-muted-foreground">{t("allMustHold")}</span>
        </div>
        {rule.conditions.length === 0 && (
          <p className="text-body-sm text-muted-foreground">{t("noConditions")}</p>
        )}
        <ol className="flex flex-col">
          {rule.conditions.map((condition, at) => (
            <li key={at} className="flex flex-col">
              {at > 0 && (
                <span className="flex h-7 items-center gap-2.5 ps-5">
                  <span aria-hidden className="h-full border-s border-dashed border-input" />
                  <span className="rounded-sm border border-border bg-muted px-2 text-label-strong text-muted-foreground">
                    {t("and")}
                  </span>
                </span>
              )}
              <ConditionRow
                condition={condition}
                index={at}
                stores={stores}
                problem={shown[`condition${at}`]}
                onChange={(change) => setCondition(at, change)}
                onRemove={() =>
                  setRule({ ...rule, conditions: rule.conditions.filter((_, i) => i !== at) })
                }
              />
            </li>
          ))}
        </ol>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={rule.conditions.length >= 5}
            onClick={() =>
              setRule({ ...rule, conditions: [...rule.conditions, conditionOf("subtotal")] })
            }
          >
            <PlusIcon data-icon="inline-start" aria-hidden />
            {t("addCondition")}
          </Button>
          {rule.conditions.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setRule({ ...rule, conditions: [] })}
            >
              {t("clearConditions")}
            </Button>
          )}
        </div>
      </section>

      <section aria-labelledby={`${id}-reward`} className="flex flex-col gap-2.5">
        <h3 id={`${id}-reward`} className="text-title text-foreground">
          {t("reward")}
        </h3>
        <div className="flex flex-wrap items-start gap-3">
          <ToggleGroup
            variant="segment"
            aria-label={t("rewardType")}
            value={[rule.type]}
            onValueChange={(chosen: string[]) => {
              const next = chosen[0];
              if (next === "fixed" || next === "percentage") setRule({ ...rule, type: next });
            }}
          >
            <ToggleGroupItem value="fixed">{t("fixed")}</ToggleGroupItem>
            <ToggleGroupItem value="percentage">{t("percentage")}</ToggleGroupItem>
          </ToggleGroup>
          <Field data-invalid={shown.value ? true : undefined} className="min-w-40 flex-1">
            <FieldLabel htmlFor={`${id}-value`}>
              {rule.type === "fixed" ? t("valueVnd") : t("valuePercent")}
            </FieldLabel>
            <Input
              id={`${id}-value`}
              inputMode="numeric"
              value={rule.value}
              aria-invalid={shown.value ? true : undefined}
              onChange={(event) => setRule({ ...rule, value: event.target.value })}
            />
            {shown.value && <FieldError>{shown.value}</FieldError>}
          </Field>
          {rule.type === "percentage" && (
            <Field data-invalid={shown.maxVnd ? true : undefined} className="min-w-40 flex-1">
              <FieldLabel htmlFor={`${id}-max`}>{t("maxVnd")}</FieldLabel>
              <Input
                id={`${id}-max`}
                inputMode="numeric"
                value={rule.maxVnd}
                aria-invalid={shown.maxVnd ? true : undefined}
                onChange={(event) => setRule({ ...rule, maxVnd: event.target.value })}
              />
              {shown.maxVnd && <FieldError>{shown.maxVnd}</FieldError>}
            </Field>
          )}
        </div>
        <p className="text-label text-muted-foreground">{t("rewardHint")}</p>
      </section>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button
          type="button"
          onClick={() => {
            setTried(true);
            if (Object.keys(problems).length === 0) onSave(rule);
          }}
        >
          {t("save")}
        </Button>
      </DialogFooter>
    </div>
  );
}

function ConditionRow({
  condition,
  index,
  stores,
  problem,
  onChange,
  onRemove,
}: {
  condition: ConditionValues;
  index: number;
  stores: Array<{ id: string; name: string }>;
  problem: string | undefined;
  onChange: (change: Partial<ConditionValues>) => void;
  onRemove: () => void;
}) {
  const t = useTranslations("Admin.promotions.rule");
  const id = useId();

  return (
    <div
      data-invalid={problem ? true : undefined}
      className="flex flex-col gap-2.5 rounded-xl border border-border p-3"
    >
      <div className="flex items-center gap-2">
        <NativeSelect
          aria-label={t("attributeLabel", { index: index + 1 })}
          className="flex-1"
          value={condition.attribute}
          onChange={(event) => {
            const attribute = event.target.value as Attribute;
            onChange(conditionOf(attribute));
          }}
        >
          {attributes.map((a) => (
            <NativeSelectOption key={a} value={a}>
              {t(`attribute.${a}`)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("removeCondition", { index: index + 1 })}
          onClick={onRemove}
        >
          <XIcon aria-hidden />
        </Button>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-3">
        <NativeSelect
          aria-label={t("operatorLabel", { index: index + 1 })}
          value={condition.operator}
          onChange={(event) => onChange({ operator: event.target.value as Operator })}
        >
          {operatorsOf[condition.attribute].map((o) => (
            <NativeSelectOption key={o} value={o}>
              {t(`operator.${o}`)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {condition.attribute === "customer" && (
          <NativeSelect
            className="sm:col-span-2"
            aria-label={t("valueLabel", { index: index + 1 })}
            value={condition.value}
            onChange={(event) => onChange({ value: event.target.value })}
          >
            <NativeSelectOption value="new">{t("customer.new")}</NativeSelectOption>
            <NativeSelectOption value="returning">{t("customer.returning")}</NativeSelectOption>
          </NativeSelect>
        )}
        {condition.attribute === "subtotal" && (
          <Input
            className="sm:col-span-2"
            aria-label={t("valueLabel", { index: index + 1 })}
            inputMode="numeric"
            placeholder={t("amountPlaceholder")}
            value={condition.value}
            aria-invalid={problem ? true : undefined}
            onChange={(event) => onChange({ value: event.target.value })}
          />
        )}
        {condition.attribute === "seller" && (
          <fieldset
            aria-label={t("valueLabel", { index: index + 1 })}
            className="flex max-h-40 flex-col gap-1.5 overflow-y-auto rounded-lg border border-border p-2 sm:col-span-2"
          >
            {stores.map((store) => (
              <label
                key={store.id}
                htmlFor={`${id}-${store.id}`}
                className="flex min-h-9 items-center gap-2 text-body-sm"
              >
                <Checkbox
                  id={`${id}-${store.id}`}
                  checked={condition.sellerIds.includes(store.id)}
                  onCheckedChange={(checked: boolean) =>
                    onChange({
                      sellerIds: checked
                        ? [...condition.sellerIds, store.id]
                        : condition.sellerIds.filter((s) => s !== store.id),
                    })
                  }
                />
                {store.name}
              </label>
            ))}
          </fieldset>
        )}
      </div>
      {problem && <p className="text-label text-destructive">{problem}</p>}
    </div>
  );
}
