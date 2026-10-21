"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { type OfferSettingsBody, saveOfferSettings } from "@/lib/api/generated";

import { toast } from "@/components/ui/toast";
import { refusalSentence, refusedFields } from "./field-errors";
import { leftNumber, typedNumber } from "./offer-number";
import {
  changeOfferSetting,
  offerBounds,
  type OfferSettingKey,
  offerSettingKeys,
  offerSettingsValues,
  sameOfferSettings,
} from "./offer-bounds";
import { useSavedStatus } from "./saved-status";
import { changedSinceRead, etagOf } from "./version";

/**
 * The offer settings (Figma AD-CS1 to AD-CS3; docs: admin-web-flow › Sửa cài đặt bài đăng): three cards, Giá,
 * Khung nhận and Tìm kiếm, each number with its unit and held to its bounds as it is typed. Lưu sends them all;
 * the toast says they apply to what is posted from now on. A value the backend still refuses is marked at its
 * field when the backend names it, and otherwise said in a toast.
 */
export function OfferSettingsForm({
  settings,
  etag,
}: {
  settings: OfferSettingsBody;
  /** The settings' version as read, sent back in If-Match (SEC-75). */
  etag: string;
}) {
  const t = useTranslations("admin.settings");
  const foot = useTranslations("admin.shell.form");
  const router = useRouter();
  const [saved, setSaved] = useState(settings);
  const [version, setVersion] = useState(etag);
  const [values, setValues] = useState(() => offerSettingsValues(settings));
  // What a field shows while it is typed, which may be empty or under its bound for a moment.
  const [drafts, setDrafts] = useState<Partial<Record<OfferSettingKey, string>>>({});
  const [refused, setRefused] = useState<OfferSettingKey[]>([]);
  const [saving, startSaving] = useTransition();
  const savedStatus = useSavedStatus(saved.updatedAt);

  const dirty = !sameOfferSettings(values, offerSettingsValues(saved));
  const bounds = offerBounds(values);

  function change(key: OfferSettingKey, value: number) {
    setValues((current) => changeOfferSetting(current, key, value));
    setRefused((current) => current.filter((each) => each !== key));
  }

  function setDraft(key: OfferSettingKey, draft: string | undefined) {
    setDrafts((current) => ({ ...current, [key]: draft }));
  }

  // A number with its unit (Figma AD-CS1: "Giảm tối thiểu", "20 %"), never outside its bounds.
  function field(key: OfferSettingKey, unit: string) {
    const id = `offer-${key}`;
    const { min, max } = bounds[key];
    const error = refused.includes(key) ? t("form.refused") : undefined;
    const draft = drafts[key];
    return (
      <div className="w-full sm:w-60">
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor={id}>{t(`offers.${key}`)}</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id={id}
              inputMode="numeric"
              autoComplete="off"
              disabled={saving}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
              value={draft ?? String(values[key])}
              onChange={(event) => {
                const typed = typedNumber(event.target.value, min, max);
                setDraft(key, typed.draft);
                if (typed.value !== undefined) change(key, typed.value);
              }}
              onBlur={() => {
                if (draft !== undefined) change(key, leftNumber(draft, min, max));
                setDraft(key, undefined);
              }}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>{unit}</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
        </Field>
      </div>
    );
  }

  function card(title: string, fields: ReactNode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <h3>{title}</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">{fields}</div>
        </CardContent>
      </Card>
    );
  }

  function save() {
    startSaving(async () => {
      try {
        const { data, response } = await saveOfferSettings({
          body: values,
          headers: { "If-Match": version },
        });
        setSaved(data);
        setVersion(etagOf(response));
        setValues(offerSettingsValues(data));
        setRefused([]);
        toast.add({ title: t("offers.saved"), type: "success", timeout: 5000 });
        router.refresh();
      } catch (error) {
        if (changedSinceRead(error)) {
          toast.add({ title: t("form.changedSinceRead"), type: "warning", timeout: 5000 });
          return;
        }
        const fields = refusedFields(error, "OFFER_SETTINGS_INVALID", offerSettingKeys);
        setRefused(fields);
        if (fields.length === 0) {
          toast.add({
            title: refusalSentence(error, {
              failed: t("form.failed"),
              failedWithReference: (reference) => t("form.failedWithReference", { reference }),
              reference: (reference) => t("form.reference", { reference }),
            }),
            type: "error",
            timeout: 5000,
          });
        }
      }
    });
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      {card(t("offers.price"), field("minDiscountPercent", t("units.percent")))}
      {card(
        t("offers.window"),
        <>
          {field("windowMinMinutes", t("units.minutes"))}
          {field("windowMaxMinutes", t("units.minutes"))}
          {field("startsWithinHours", t("units.hours"))}
        </>,
      )}
      {card(
        t("offers.search"),
        <>
          {field("defaultRadiusKm", t("units.km"))}
          {field("maxRadiusKm", t("units.km"))}
        </>,
      )}
      {/* The foot (Figma Admin/FormFooter): when it was saved or that it is changed, Huỷ and Lưu thay đổi. */}
      <Card size="sm">
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <output
              className={
                dirty && !saving
                  ? "min-w-0 flex-1 text-label-strong text-warning-foreground"
                  : "min-w-0 flex-1 text-label text-muted-foreground"
              }
            >
              {saving ? foot("saving") : dirty ? foot("dirty") : savedStatus}
            </output>
            <Button
              variant="outline"
              type="button"
              disabled={!dirty || saving}
              onClick={() => {
                setValues(offerSettingsValues(saved));
                setDrafts({});
                setRefused([]);
              }}
            >
              {foot("cancel")}
            </Button>
            <Button type="submit" disabled={!dirty || saving}>
              {saving && <Spinner data-icon="inline-start" />}
              {saving ? foot("savingButton") : foot("save")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
