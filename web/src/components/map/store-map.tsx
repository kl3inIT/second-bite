"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
 *
 * MapLibre weighs about 440 KB with its worker, and draws with WebGL, so the map is fetched only once the figure
 * shows on the screen (SEC-166): a figure further down waits until the person scrolls to it, and one that is not
 * shown, such as the chat's aside on a phone, never fetches it.
 */
export function StoreMap({
  point,
  label,
  onOpen,
  openLabel,
  href,
  className,
}: {
  point: Point;
  label: string;
  onOpen?: () => void;
  /** What the press does, for a screen reader, with `onOpen` or `href`. */
  openLabel?: string;
  /** Directions to the point, opened in a new tab. */
  href?: string;
  /** Sizes the figure, as a card that holds it small does. */
  className?: string;
}) {
  const [figure, near] = useNearScreen<HTMLElement>();

  return (
    <figure
      ref={figure}
      aria-label={label}
      className={cn(
        "relative h-40 overflow-hidden rounded-xl border border-border bg-muted",
        className,
      )}
    >
      {near ? (
        <HanoiMap
          view={{ ...point, zoom: STREET_ZOOM }}
          pin={point}
          label={label}
          interactive={false}
        />
      ) : (
        <Skeleton shape="frame" />
      )}
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

/** How long the element stays on screen before it counts as seen. */
const SEEN_AFTER_MS = 300;

/**
 * Whether the element has stayed in the viewport for `SEEN_AFTER_MS`, once; it stays true after. The wait skips a
 * figure the page's first layout shows for a moment before a card above it pushes it down, as on the order page.
 * An element not displayed never intersects, so it never turns true.
 */
function useNearScreen<T extends Element>() {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || near) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver((entries) => {
      const shown = entries.at(-1)?.isIntersecting ?? false;
      clearTimeout(timer);
      if (shown) timer = setTimeout(() => setNear(true), SEEN_AFTER_MS);
    });
    observer.observe(element);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [near]);

  return [ref, near] as const;
}
