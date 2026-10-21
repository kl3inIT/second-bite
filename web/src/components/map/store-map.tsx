"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

import { STREET_ZOOM } from "./map-style";
import type { Point } from "./location-picker";

const HanoiMap = dynamic(() => import("./hanoi-map"), {
  ssr: false,
  loading: () => <Skeleton shape="frame" />,
});

/**
 * A picture of where a store is pinned (SEC-66): the form's preview and the admin's store page. It does not move,
 * so it reads as a figure, named whether or not the map could be drawn; the owner moves the pin in the picker.
 */
export function StoreMap({ point, label }: { point: Point; label: string }) {
  return (
    <figure
      aria-label={label}
      className="relative h-40 overflow-hidden rounded-xl border border-border bg-muted"
    >
      <HanoiMap
        view={{ ...point, zoom: STREET_ZOOM }}
        pin={point}
        label={label}
        interactive={false}
      />
    </figure>
  );
}
