import type { OfferSettingsBodyWritable } from "@/lib/api/generated";

export type OfferSettingsValues = OfferSettingsBodyWritable;
export type OfferSettingKey = keyof OfferSettingsValues;

export const offerSettingKeys = [
  "minDiscountPercent",
  "windowMinMinutes",
  "windowMaxMinutes",
  "startsWithinHours",
  "defaultRadiusKm",
  "maxRadiusKm",
] as const satisfies readonly OfferSettingKey[];

type Bounds = { min: number; max: number };

// The bounds of each setting in api/openapi.yaml (OfferSettingsBody), which the offer module checks again.
const limits = {
  minDiscountPercent: { min: 0, max: 90 },
  windowMinutes: { min: 15, max: 1440 },
  startsWithinHours: { min: 1, max: 72 },
  radiusKm: { min: 1, max: 100 },
} as const;

/**
 * The bounds a field holds to, given the others (docs: admin-web-flow › Cài đặt bài đăng): the shortest window
 * is at most the longest and the longest at least the shortest; the default radius is at most the largest and
 * the largest at least the default, as the offer module requires.
 */
export function offerBounds(values: OfferSettingsValues): Record<OfferSettingKey, Bounds> {
  return {
    minDiscountPercent: limits.minDiscountPercent,
    windowMinMinutes: { min: limits.windowMinutes.min, max: values.windowMaxMinutes },
    windowMaxMinutes: { min: values.windowMinMinutes, max: limits.windowMinutes.max },
    startsWithinHours: limits.startsWithinHours,
    defaultRadiusKm: { min: limits.radiusKm.min, max: values.maxRadiusKm },
    maxRadiusKm: { min: values.defaultRadiusKm, max: limits.radiusKm.max },
  };
}

/** The settings with one changed, held to its bounds, so the form never holds a pair the backend refuses. */
export function changeOfferSetting(
  values: OfferSettingsValues,
  key: OfferSettingKey,
  value: number,
): OfferSettingsValues {
  const { min, max } = offerBounds(values)[key];
  return { ...values, [key]: Math.min(max, Math.max(min, Math.round(value))) };
}

/** Only the settings themselves, without who changed them and when, as the form keeps and sends them. */
export function offerSettingsValues(settings: OfferSettingsValues): OfferSettingsValues {
  return Object.fromEntries(
    offerSettingKeys.map((key) => [key, settings[key]]),
  ) as OfferSettingsValues;
}

export function sameOfferSettings(a: OfferSettingsValues, b: OfferSettingsValues): boolean {
  return offerSettingKeys.every((key) => a[key] === b[key]);
}
