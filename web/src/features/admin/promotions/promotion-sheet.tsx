"use client";

import { CheckIcon, RotateCcwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";

import { NumberField } from "../ui/number-field";
import { SegmentedControl } from "../ui/segmented-control";
import { SideSheet } from "../ui/side-sheet";
import {
  ChoiceRow,
  FieldProblem,
  GroupLabel,
  ManyPicker,
  SwitchField,
  TextField,
} from "../ui/form-fields";
import {
  codeOf,
  newPromotionCode,
  type PromotionForm,
  promotionBounds,
  promotionProblems,
  type RedeemChannel,
  redeemChannels,
  type StoreOption,
  withEnd,
  withLimit,
  withStart,
} from "./promotion-form";
import { SoonBadge } from "../ui/soon-badge";

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
    <SideSheet
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? t("editTitle") : t("createTitle")}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <SoonBadge id={`${id}-soon`} />
          <Button disabled title={tShell("soon")} aria-describedby={`${id}-soon`}>
            <CheckIcon data-icon="inline-start" aria-hidden />
            {editing ? t("save") : t("create")}
          </Button>
        </>
      }
    >
      <PromotionFields form={form} onChange={setForm} stores={stores} />
    </SideSheet>
  );
}

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
  const problems = promotionProblems(form);
  const set = (change: Partial<PromotionForm>) => setForm((current) => ({ ...current, ...change }));
  const percent = form.kind === "percent";

  return (
    <>
      <TextField
        id={`${id}-code`}
        label={t("code")}
        value={form.code}
        onChange={(typed) => set({ code: codeOf(typed) })}
        onBlur={() => setCodeTouched(true)}
        problem={codeTouched && problems.includes("code") ? t("codeProblem") : undefined}
        end={
          <Button variant="ghost" onClick={() => set({ code: newPromotionCode() })}>
            <RotateCcwIcon data-icon="inline-start" aria-hidden />
            {t("regenerate")}
          </Button>
        }
      />

      <div className="flex flex-col gap-1.5">
        <GroupLabel>{t("kind")}</GroupLabel>
        <ChoiceRow>
          <SegmentedControl
            label={t("kind")}
            value={form.kind}
            segments={[
              { value: "percent", label: t("kinds.percent") },
              { value: "amount", label: t("kinds.amount") },
            ]}
            onChange={(kind) => set({ kind })}
          />
        </ChoiceRow>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          {percent ? (
            <NumberField
              id={`${id}-percent`}
              label={t("value")}
              value={form.percent}
              onChange={(value) => set({ percent: value })}
              {...promotionBounds.percent}
              unit="%"
            />
          ) : (
            <NumberField
              id={`${id}-amount`}
              label={t("value")}
              value={form.amountVnd}
              onChange={(value) => set({ amountVnd: value })}
              {...promotionBounds.amountVnd}
              unit="đ"
            />
          )}
        </div>
        <div className="flex-1">
          <NumberField
            id={`${id}-cap`}
            label={t("cap")}
            value={form.capVnd}
            onChange={(value) => set({ capVnd: value })}
            {...promotionBounds.capVnd}
            unit="đ"
            disabled={!percent}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <NumberField
            id={`${id}-limit`}
            label={t("limit")}
            value={form.limit}
            onChange={(value) => setForm((current) => withLimit(current, value))}
            {...promotionBounds.limit}
            unit={t("usesUnit")}
          />
        </div>
        <div className="flex-1">
          <NumberField
            id={`${id}-per-user`}
            label={t("perUser")}
            value={form.perUser}
            onChange={(value) => set({ perUser: value })}
            min={promotionBounds.perUser.min}
            max={form.limit}
            unit={t("usesUnit")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <TextField
          id={`${id}-starts`}
          type="datetime-local"
          label={t("startsAt")}
          value={form.startsAt}
          onChange={(value) => value && setForm((current) => withStart(current, value))}
        />
        <TextField
          id={`${id}-ends`}
          type="datetime-local"
          label={t("endsAt")}
          value={form.endsAt}
          min={form.startsAt}
          onChange={(value) => value && setForm((current) => withEnd(current, value))}
        />
      </div>

      <SwitchField
        label={t("allStores")}
        checked={form.allStores}
        onChange={(allStores) => set({ allStores })}
      />

      {!form.allStores && (
        <div className="flex flex-col gap-1.5">
          <GroupLabel id={`${id}-stores`}>
            {t("stores", { count: form.storeIds.length })}
          </GroupLabel>
          <ManyPicker
            label={t("storesField")}
            value={
              form.storeIds.length > 0
                ? t("storesChosen", { count: form.storeIds.length })
                : t("storesNone")
            }
            options={stores}
            chosen={form.storeIds}
            onChange={(storeIds) => set({ storeIds })}
            empty={t("storesEmpty")}
            labelledBy={`${id}-stores`}
          />
          {problems.includes("stores") && (
            <FieldProblem id={`${id}-stores-problem`}>{t("storesProblem")}</FieldProblem>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <GroupLabel>{t("channel")}</GroupLabel>
        <ChoiceRow>
          <SegmentedControl<RedeemChannel>
            label={t("channel")}
            value={form.channel}
            segments={redeemChannels.map((channel) => ({
              value: channel,
              label: t(`channels.${channel}`),
            }))}
            onChange={(channel) => set({ channel })}
          />
        </ChoiceRow>
      </div>
    </>
  );
}
