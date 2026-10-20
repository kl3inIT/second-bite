import { describe, expect, it } from "vitest";

import {
  changeOfferSetting,
  offerBounds,
  offerSettingsValues,
  sameOfferSettings,
} from "./offer-bounds";

// The team's first values (docs/specs/offer.md › Settings).
const settings = {
  minDiscountPercent: 20,
  windowMinMinutes: 30,
  windowMaxMinutes: 360,
  startsWithinHours: 24,
  defaultRadiusKm: 5,
  maxRadiusKm: 30,
};

describe("the bounds of the offer settings", () => {
  it("hold each setting to the API's range", () => {
    const bounds = offerBounds(settings);
    expect(bounds.minDiscountPercent).toEqual({ min: 0, max: 90 });
    expect(bounds.startsWithinHours).toEqual({ min: 1, max: 72 });
  });

  it("keep the shortest window up to the longest, and the longest from the shortest", () => {
    const bounds = offerBounds(settings);
    expect(bounds.windowMinMinutes).toEqual({ min: 15, max: 360 });
    expect(bounds.windowMaxMinutes).toEqual({ min: 30, max: 1440 });
  });

  it("keep the default radius up to the largest, and the largest from the default", () => {
    const bounds = offerBounds(settings);
    expect(bounds.defaultRadiusKm).toEqual({ min: 1, max: 30 });
    expect(bounds.maxRadiusKm).toEqual({ min: 5, max: 100 });
  });
});

describe("changing an offer setting", () => {
  it("takes a value inside its bounds as it is", () => {
    expect(changeOfferSetting(settings, "minDiscountPercent", 35).minDiscountPercent).toBe(35);
  });

  it("brings a value over the API's range down to it", () => {
    expect(changeOfferSetting(settings, "minDiscountPercent", 95).minDiscountPercent).toBe(90);
    expect(changeOfferSetting(settings, "startsWithinHours", 0).startsWithinHours).toBe(1);
  });

  it("never lets the shortest window pass the longest, nor the longest fall under the shortest", () => {
    expect(changeOfferSetting(settings, "windowMinMinutes", 400).windowMinMinutes).toBe(360);
    expect(changeOfferSetting(settings, "windowMaxMinutes", 20).windowMaxMinutes).toBe(30);
  });

  it("never lets the default radius pass the largest, nor the largest fall under the default", () => {
    expect(changeOfferSetting(settings, "defaultRadiusKm", 50).defaultRadiusKm).toBe(30);
    expect(changeOfferSetting(settings, "maxRadiusKm", 2).maxRadiusKm).toBe(5);
  });

  it("leaves the other settings alone", () => {
    const changed = changeOfferSetting(settings, "windowMaxMinutes", 240);
    expect(changed).toEqual({ ...settings, windowMaxMinutes: 240 });
  });
});

describe("the values the form keeps", () => {
  it("leave out who saved them and when, and compare by value", () => {
    const read = { ...settings, updatedAt: "2026-10-18T02:15:00Z", updatedBy: "ac-1" };
    expect(offerSettingsValues(read)).toEqual(settings);
    expect(sameOfferSettings(offerSettingsValues(read), settings)).toBe(true);
    expect(sameOfferSettings({ ...settings, maxRadiusKm: 31 }, settings)).toBe(false);
  });
});
