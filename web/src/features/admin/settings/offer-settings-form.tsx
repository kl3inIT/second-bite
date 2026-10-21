"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { useRouter } from "@/i18n/navigation";
import { type OfferSettingsBody, saveOfferSettings } from "@/lib/api/generated";

import { showAdminToast } from "../admin-toast";
import { NumberField } from "../ui/number-field";
import { FormFooter, SettingsCard } from "../ui/settings";
import { refusalSentence, refusedFields } from "./field-errors";
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
  const router = useRouter();
  const [saved, setSaved] = useState(settings);
  const [version, setVersion] = useState(etag);
  const [values, setValues] = useState(() => offerSettingsValues(settings));
  const [refused, setRefused] = useState<OfferSettingKey[]>([]);
  const [saving, startSaving] = useTransition();
  const savedStatus = useSavedStatus(saved.updatedAt);

  const dirty = !sameOfferSettings(values, offerSettingsValues(saved));
  const bounds = offerBounds(values);

  function field(key: OfferSettingKey, unit: string) {
    return (
      <div className="w-full sm:w-60">
        <NumberField
          id={`offer-${key}`}
          label={t(`offers.${key}`)}
          value={values[key]}
          onChange={(value) => {
            setValues((current) => changeOfferSetting(current, key, value));
            setRefused((current) => current.filter((each) => each !== key));
          }}
          min={bounds[key].min}
          max={bounds[key].max}
          unit={unit}
          disabled={saving}
          error={refused.includes(key) ? t("form.refused") : undefined}
        />
      </div>
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
        showAdminToast(t("offers.saved"));
        router.refresh();
      } catch (error) {
        if (changedSinceRead(error)) {
          showAdminToast(t("form.changedSinceRead"), "warning");
          return;
        }
        const fields = refusedFields(error, "OFFER_SETTINGS_INVALID", offerSettingKeys);
        setRefused(fields);
        if (fields.length === 0) {
          showAdminToast(
            refusalSentence(error, {
              failed: t("form.failed"),
              failedWithReference: (reference) => t("form.failedWithReference", { reference }),
              reference: (reference) => t("form.reference", { reference }),
            }),
            "error",
          );
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
      <SettingsCard title={t("offers.price")}>
        <div className="flex flex-wrap gap-4">
          {field("minDiscountPercent", t("units.percent"))}
        </div>
      </SettingsCard>
      <SettingsCard title={t("offers.window")}>
        <div className="flex flex-wrap gap-4">
          {field("windowMinMinutes", t("units.minutes"))}
          {field("windowMaxMinutes", t("units.minutes"))}
          {field("startsWithinHours", t("units.hours"))}
        </div>
      </SettingsCard>
      <SettingsCard title={t("offers.search")}>
        <div className="flex flex-wrap gap-4">
          {field("defaultRadiusKm", t("units.km"))}
          {field("maxRadiusKm", t("units.km"))}
        </div>
      </SettingsCard>
      <FormFooter
        dirty={dirty}
        saving={saving}
        savedStatus={savedStatus}
        onCancel={() => {
          setValues(offerSettingsValues(saved));
          setRefused([]);
        }}
      />
    </form>
  );
}
