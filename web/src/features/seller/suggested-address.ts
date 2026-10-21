import type { Point } from "@/components/map/location-picker";
import { addressAt } from "@/lib/api/generated";

/** What became of the address at a point: written into the field, kept as the person typed it, or not known. */
export type Suggestion = "filled" | "kept" | "unknown";

/** The address at a point, for the street the map's pin stands on; empty when nothing is known there. */
export async function describePlace(point: Point): Promise<string> {
  const { data } = await addressAt({ query: point });
  return data.address;
}

/**
 * The address to write for a point by SEC-110's rule 5: the place's name when the field is empty or still holds
 * exactly what the last place wrote (`lastFilled`), nothing when the person typed their own or the geocoder knows
 * nothing. The caller writes `fill` into its field and keeps it as the next `lastFilled`.
 */
export async function suggestAddress(
  point: Point,
  current: string,
  lastFilled: string | undefined,
): Promise<{ outcome: Suggestion; fill?: string }> {
  const mayFill = current.trim() === "" || current === lastFilled;
  let named = "";
  try {
    named = await describePlace(point);
  } catch {
    // The place is pinned all the same; the person writes the address.
  }
  if (!named) return { outcome: "unknown" };
  return mayFill ? { outcome: "filled", fill: named } : { outcome: "kept" };
}
