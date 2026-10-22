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
 * With `onOpen`, a press on it opens the picker, as people press a map to move it; with `href`, it opens the way
 * there in the phone's maps. Either way the page's own button stays the way in for a keyboard, so the map's is left
 * out of the tab order.
 */
export function StoreMap({
  point,
  label,
  onOpen,
  openLabel,
  href,
}: {
  point: Point;
  label: string;
  onOpen?: () => void;
  /** What the press does, for a screen reader, with `onOpen` or `href`. */
  openLabel?: string;
  /** Directions to the point, opened in a new tab. */
  href?: string;
}) {
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
      {onOpen && (
        <button
          type="button"
          tabIndex={-1}
          aria-label={openLabel}
          className="absolute inset-0 cursor-pointer"
          onClick={onOpen}
        />
      )}
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-label={openLabel}
          className="absolute inset-0"
        />
      )}
    </figure>
  );
}
