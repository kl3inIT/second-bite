import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api/client";

import { refusalSentence, refusedFields } from "./field-errors";

const fields = ["windowMinMinutes", "windowMaxMinutes", "maxRadiusKm"] as const;

function refusal(code: string, pointers: string[], status = 400, detail?: string) {
  return new ApiError(status, {
    status,
    detail,
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
});

describe("the toast of a refused save", () => {
  const words = {
    failed: "Not saved.",
    failedWithReference: (reference: string) => `Not saved. Reference: ${reference}`,
    reference: (reference: string) => `Reference: ${reference}`,
  };

  it("says the server's sentence with the reference a person reports", () => {
    const error = refusal(
      "OFFER_SETTINGS_INVALID",
      [],
      400,
      "The offer settings are out of range.",
    );
    expect(refusalSentence(error, words)).toBe(
      "The offer settings are out of range. Reference: req-1",
    );
  });

  it("keeps the form's own words when the answer carried no sentence or none came", () => {
    expect(refusalSentence(refusal("OFFER_SETTINGS_INVALID", []), words)).toBe(
      "Not saved. Reference: req-1",
    );
    expect(refusalSentence(new Error("offline"), words)).toBe("Not saved.");
  });
});
