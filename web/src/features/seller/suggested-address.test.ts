import { describe, expect, it, vi } from "vitest";

import { addressAt } from "@/lib/api/generated";

import { suggestAddress } from "./suggested-address";

vi.mock("@/lib/api/generated", () => ({ addressAt: vi.fn() }));

const named = (address: string) =>
  vi.mocked(addressAt).mockResolvedValue({ data: { address } } as never);
const point = { latitude: 21.0453, longitude: 105.8738 };

// SEC-110's rule 5, kept by the map's pin (SEC-66): a place writes the address only into an empty field or over
// what a place wrote last; what the person typed stays.
describe("suggestAddress", () => {
  it("fills an empty field with the place's name", async () => {
    named("12 Ngọc Lâm, Long Biên");
    expect(await suggestAddress(point, " ", undefined)).toEqual({
      outcome: "filled",
      fill: "12 Ngọc Lâm, Long Biên",
    });
  });

  it("replaces what the last place wrote", async () => {
    named("14 Ngọc Lâm, Long Biên");
    expect(await suggestAddress(point, "12 Ngọc Lâm", "12 Ngọc Lâm")).toEqual({
      outcome: "filled",
      fill: "14 Ngọc Lâm, Long Biên",
    });
  });

  it("keeps what the person typed, even over a place's words they changed", async () => {
    named("14 Ngọc Lâm, Long Biên");
    expect(await suggestAddress(point, "Tầng 2, Tasco Mall", undefined)).toEqual({
      outcome: "kept",
    });
    expect(await suggestAddress(point, "12 Ngọc Lâm, cổng sau", "12 Ngọc Lâm")).toEqual({
      outcome: "kept",
    });
  });

  it("says nothing is known when the geocoder names nothing", async () => {
    named("");
    expect(await suggestAddress(point, "", undefined)).toEqual({ outcome: "unknown" });
  });

  it("says nothing is known when the geocoder does not answer", async () => {
    vi.mocked(addressAt).mockRejectedValue(new Error("offline"));
    expect(await suggestAddress(point, "", undefined)).toEqual({ outcome: "unknown" });
  });
});
