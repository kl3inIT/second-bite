import { describe, expect, it } from "vitest";

import { adminFeatures, isFeatureOn } from "./features";

describe("the admin's feature flags", () => {
  it("keeps every part whose backend is not built off", () => {
    expect(adminFeatures).toEqual({ storeReview: false, openForOwner: false });
  });

  it("reads a flag from the registry", () => {
    for (const key of Object.keys(adminFeatures) as (keyof typeof adminFeatures)[]) {
      expect(isFeatureOn(key)).toBe(adminFeatures[key]);
    }
  });
});
