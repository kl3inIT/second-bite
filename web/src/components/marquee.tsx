"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** Where the row may run: a wide screen (Tailwind's `lg`) whose person has not asked for less motion. */
const RUNS = "(min-width: 64rem) and (prefers-reduced-motion: no-preference)";

// A row that runs on its own when its items do not fit (the home's deal tickets and kinds): the list, then a copy of it
// for the eye only, sliding left and starting over without a seam. It stops under the pointer or the keyboard's
// focus. It runs only on a wide screen: on a phone, and for reduced motion, it stays still and scrolls by hand.
// When everything fits it is a plain row.
export function Marquee({
  label,
  count,
  spacing = { gap: "gap-2 lg:gap-3", seam: "pr-2 lg:pr-3" },
  children,
}: {
  label: string;
  /** How many items the list holds, to set the pace. */
  count: number;
  /** The space between items, and the same space after the last one so the copy follows without a seam. */
  spacing?: { gap: string; seam: string };
  children: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const outer = box.current;
    const inner = list.current;
    if (!outer || !inner) return;
    const runs = window.matchMedia(RUNS);
    const measure = () => setMoving(runs.matches && inner.offsetWidth > outer.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    runs.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      runs.removeEventListener("change", measure);
    };
  }, []);

  const row = cn("flex shrink-0", spacing.gap, moving && spacing.seam);

  return (
    <div
      ref={box}
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- standing still, the row scrolls by hand, so the keyboard must reach it (WCAG 2.1.1).
      tabIndex={0}
      className="marquee-box min-w-0 flex-1 rounded-xl px-1.5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div
        className={cn("flex w-max", moving && "marquee")}
        style={{ "--marquee-items": count } as React.CSSProperties}
      >
        <ul ref={list} aria-label={label} className={row}>
          {children}
        </ul>
        {moving && (
          <ul aria-hidden inert className={row}>
            {children}
          </ul>
        )}
      </div>
    </div>
  );
}
