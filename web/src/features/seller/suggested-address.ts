"use client";

import { useRef, useState } from "react";

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
 * A store's written address, filled from where it is pinned by SEC-110's rule 5: written when the field is empty
 * or still holds what the last place wrote, kept when the person typed their own.
 */
export function useSuggestedAddress(initial = "") {
  const [address, setAddress] = useState(initial);
  // Whether the field holds what a place wrote, and not the person: the next place may replace it.
  const written = useRef(false);

  function type(value: string) {
    written.current = false;
    setAddress(value);
  }

  async function suggest(point: Point): Promise<Suggestion> {
    const mayFill = address.trim() === "" || written.current;
    let named = "";
    try {
      named = await describePlace(point);
    } catch {
      // The place is pinned all the same; the person writes the address.
    }
    if (named && mayFill) {
      written.current = true;
      setAddress(named);
    }
    return !named ? "unknown" : mayFill ? "filled" : "kept";
  }

  return { address, type, suggest };
}
