import { describe, expect, it } from "vitest";

import { adminFeatures, isFeatureOn } from "./features";

describe("the admin's feature flags", () => {
  it("turns on only the parts whose backend is built", () => {
    expect(adminFeatures).toEqual({ storeReview: true, openForOwner: false });
  });

  it("reads a flag from the registry", () => {
    for (const key of Object.keys(adminFeatures) as (keyof typeof adminFeatures)[]) {
      expect(isFeatureOn(key)).toBe(adminFeatures[key]);
    }
  });
});
