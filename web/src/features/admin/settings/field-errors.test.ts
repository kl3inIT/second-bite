import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api/client";

import { referenceOf, refusedFields } from "./field-errors";

const fields = ["windowMinMinutes", "windowMaxMinutes", "maxRadiusKm"] as const;

function refusal(code: string, pointers: string[], status = 400) {
  return new ApiError(status, {
    status,
    code,
    requestId: "req-1",
    errors: pointers.map((pointer) => ({ pointer, code, detail: "" })),
  } as never);
}

describe("the fields a refused save points at", () => {
  it("are those the backend's failure names", () => {
    const error = refusal("OFFER_SETTINGS_INVALID", ["#/windowMaxMinutes", "#/unknown"]);
    expect(refusedFields(error, "OFFER_SETTINGS_INVALID", fields)).toEqual(["windowMaxMinutes"]);
  });

  it("include those the request's own validation names", () => {
    const error = refusal("PLATFORM_VALUE_INVALID", ["#/maxRadiusKm"]);
    expect(refusedFields(error, "OFFER_SETTINGS_INVALID", fields)).toEqual(["maxRadiusKm"]);
  });

  it("are none when the failure names no field, so the page says it in a toast", () => {
    expect(
      refusedFields(refusal("OFFER_SETTINGS_INVALID", []), "OFFER_SETTINGS_INVALID", fields),
    ).toEqual([]);
  });

  it("are none for another failure", () => {
    const other = refusal("PLATFORM_ADMIN_REQUIRED", ["#/maxRadiusKm"], 403);
    expect(refusedFields(other, "OFFER_SETTINGS_INVALID", fields)).toEqual([]);
    expect(refusedFields(new Error("offline"), "OFFER_SETTINGS_INVALID", fields)).toEqual([]);
  });

  it("come with the reference a person reports", () => {
    expect(referenceOf(refusal("OFFER_SETTINGS_INVALID", []))).toBe("req-1");
    expect(referenceOf(new Error("offline"))).toBeUndefined();
  });
});
