"use client";

import { CheckIcon, ChevronDownIcon, RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  codeOf,
  leftNumber,
  newPromotionCode,
  type NumberBounds,
  type PromotionForm,
  promotionBounds,
  promotionProblems,
  type RedeemChannel,
  redeemChannels,
  type StoreOption,
  typedNumber,
  withEnd,
  withLimit,
  withStart,
} from "./promotion-form";

/**
 * Creating a code, or changing one, in the side sheet (Figma AD-MK2): the code (made up, and made up again with
 * "Tạo lại"), a share or an amount, its cap, how many times in all and per person, from when to when, which
 * stores and where it is redeemed. Numbers are held to their bounds and the end to its start as they are typed.
 * No backend keeps codes yet, so "Tạo mã" stays disabled beside "Sắp có" and nothing is saved.
 */
export function PromotionSheet({
  open,
  onOpenChange,
  editing,
  initial,
  stores,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: boolean;
  initial: PromotionForm;
  stores: StoreOption[];
}) {
  const t = useTranslations("admin.promotions.sheet");
  const tShell = useTranslations("admin.shell");
  const id = useId();
  const [form, setForm] = useState(initial);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader variant="bar">
          <SheetTitle variant="headline">{editing ? t("editTitle") : t("createTitle")}</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          <PromotionFields form={form} onChange={setForm} stores={stores} />
        </div>
        <SheetFooter variant="bar">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Badge variant="outline" id={`${id}-soon`}>
            {tShell("soon")}
          </Badge>
          <Button disabled aria-describedby={`${id}-soon`}>
            <CheckIcon data-icon="inline-start" aria-hidden />
            {editing ? t("save") : t("create")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

type NumberKey = "percent" | "amountVnd" | "capVnd" | "limit" | "perUser";

/** The sheet's fields, top to bottom as Figma AD-MK2 draws them. `onChange` takes the next form from the last. */
export function PromotionFields({
  form,
  onChange: setForm,
  stores,
}: {
  form: PromotionForm;
  onChange: (next: (current: PromotionForm) => PromotionForm) => void;
  stores: StoreOption[];
}) {
  const t = useTranslations("admin.promotions.sheet");
  const id = useId();
  const [codeTouched, setCodeTouched] = useState(false);
  // What a number field holds while it is typed, which may be empty or under its least for a moment.
  const [drafts, setDrafts] = useState<Partial<Record<NumberKey, string>>>({});
  const problems = promotionProblems(form);
  const set = (change: Partial<PromotionForm>) => setForm((current) => ({ ...current, ...change }));
  const setNumber = (key: NumberKey, value: number) =>
    setForm((current) =>
      key === "limit" ? withLimit(current, value) : { ...current, [key]: value },
    );
  const percent = form.kind === "percent";
  const codeProblem = codeTouched && problems.includes("code");

  const numberRows: {
    key: NumberKey;
    label: string;
    unit: string;
    bounds: NumberBounds;
    disabled?: boolean;
  }[][] = [
    [
      percent
        ? { key: "percent", label: t("value"), unit: "%", bounds: promotionBounds.percent }
        : { key: "amountVnd", label: t("value"), unit: "đ", bounds: promotionBounds.amountVnd },
      {
        key: "capVnd",
        label: t("cap"),
        unit: "đ",
        bounds: promotionBounds.capVnd,
        disabled: !percent,
      },
    ],
    [
      { key: "limit", label: t("limit"), unit: t("usesUnit"), bounds: promotionBounds.limit },
      {
        key: "perUser",
        label: t("perUser"),
        unit: t("usesUnit"),
        bounds: { min: promotionBounds.perUser.min, max: form.limit },
      },
    ],
  ];

  return (
    <>
      <Field data-invalid={codeProblem || undefined}>
        <FieldLabel htmlFor={`${id}-code`}>{t("code")}</FieldLabel>
        <div className="flex items-center gap-2">
          <Input
            id={`${id}-code`}
            value={form.code}
            autoComplete="off"
            aria-invalid={codeProblem || undefined}
            aria-describedby={codeProblem ? `${id}-code-problem` : undefined}
            onChange={(event) => set({ code: codeOf(event.target.value) })}
            onBlur={() => setCodeTouched(true)}
          />
          <Button variant="ghost" onClick={() => set({ code: newPromotionCode() })}>
            <RotateCcwIcon data-icon="inline-start" aria-hidden />
            {t("regenerate")}
          </Button>
        </div>
        {codeProblem && <FieldError id={`${id}-code-problem`}>{t("codeProblem")}</FieldError>}
      </Field>

      <FieldSet>
        <FieldLegend variant="label">{t("kind")}</FieldLegend>
        <ToggleGroup
          variant="outline"
          value={[form.kind]}
          onValueChange={([kind]) => {
            if (kind) set({ kind: kind as PromotionForm["kind"] });
          }}
          className="max-w-full overflow-x-auto"
        >
          <ToggleGroupItem value="percent" className="h-11">
            {t("kinds.percent")}
          </ToggleGroupItem>
          <ToggleGroupItem value="amount" className="h-11">
            {t("kinds.amount")}
          </ToggleGroupItem>
        </ToggleGroup>
      </FieldSet>

      {numberRows.map((row) => (
        <div key={row[0].key} className="flex flex-col gap-4 sm:flex-row">
          {row.map((field) => (
            <Field key={field.key} data-disabled={field.disabled || undefined}>
              <FieldLabel htmlFor={`${id}-${field.key}`}>{field.label}</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id={`${id}-${field.key}`}
                  inputMode="numeric"
                  autoComplete="off"
                  disabled={field.disabled}
                  value={drafts[field.key] ?? String(form[field.key])}
                  onChange={(event) => {
                    const { value, draft } = typedNumber(event.target.value, field.bounds);
                    setDrafts((current) => ({ ...current, [field.key]: draft }));
                    if (value !== undefined) setNumber(field.key, value);
                  }}
                  onBlur={() => {
                    const draft = drafts[field.key];
                    if (draft !== undefined) setNumber(field.key, leftNumber(draft, field.bounds));
                    setDrafts((current) => ({ ...current, [field.key]: undefined }));
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>{field.unit}</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          ))}
        </div>
      ))}

      <div className="flex flex-col gap-4 sm:flex-row">
        <Field>
          <FieldLabel htmlFor={`${id}-starts`}>{t("startsAt")}</FieldLabel>
          <Input
            id={`${id}-starts`}
            type="datetime-local"
            value={form.startsAt}
            onChange={(event) => {
              const value = event.target.value;
              if (value) setForm((current) => withStart(current, value));
            }}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-ends`}>{t("endsAt")}</FieldLabel>
          <Input
            id={`${id}-ends`}
            type="datetime-local"
            value={form.endsAt}
            min={form.startsAt}
            onChange={(event) => {
              const value = event.target.value;
              if (value) setForm((current) => withEnd(current, value));
            }}
          />
        </Field>
      </div>

      <Field orientation="horizontal" className="min-h-11">
        <Switch
          id={`${id}-all-stores`}
          checked={form.allStores}
          onCheckedChange={(allStores) => set({ allStores })}
        />
        <FieldLabel htmlFor={`${id}-all-stores`}>{t("allStores")}</FieldLabel>
      </Field>

      {!form.allStores && (
        <FieldSet>
          <FieldLegend variant="label" id={`${id}-stores`}>
            {t("stores", { count: form.storeIds.length })}
          </FieldLegend>
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline" />}
              aria-describedby={`${id}-stores`}
              className="w-full"
            >
              <span className="text-muted-foreground">{t("storesField")}:</span>
              <span className="min-w-0 flex-1 truncate text-left text-body-sm-strong text-foreground">
                {form.storeIds.length > 0
                  ? t("storesChosen", { count: form.storeIds.length })
                  : t("storesNone")}
              </span>
              <ChevronDownIcon data-icon="inline-end" aria-hidden />
            </PopoverTrigger>
            <PopoverContent align="start">
              {stores.length === 0 ? (
                <p className="text-body-sm text-muted-foreground">{t("storesEmpty")}</p>
              ) : (
                <FieldGroup className="max-h-72 overflow-y-auto">
                  {stores.map((store) => (
                    <Field key={store.id} orientation="horizontal" className="min-h-11">
                      <Checkbox
                        id={`${id}-store-${store.id}`}
                        checked={form.storeIds.includes(store.id)}
                        onCheckedChange={(checked) =>
                          set({
                            storeIds: checked
                              ? [...form.storeIds, store.id]
                              : form.storeIds.filter((each) => each !== store.id),
                          })
                        }
                      />
                      <FieldLabel htmlFor={`${id}-store-${store.id}`}>{store.name}</FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              )}
            </PopoverContent>
          </Popover>
          {problems.includes("stores") && <FieldError>{t("storesProblem")}</FieldError>}
        </FieldSet>
      )}

      <FieldSet>
        <FieldLegend variant="label">{t("channel")}</FieldLegend>
        <ToggleGroup
          variant="outline"
          value={[form.channel]}
          onValueChange={([channel]) => {
            if (channel) set({ channel: channel as RedeemChannel });
          }}
          className="max-w-full overflow-x-auto"
        >
          {redeemChannels.map((channel) => (
            <ToggleGroupItem key={channel} value={channel} className="h-11">
              {t(`channels.${channel}`)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldSet>
    </>
  );
}
