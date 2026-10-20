"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// A row that runs on its own when its items do not fit (the home's deal tickets): the list, then a copy of it
// for the eye only, sliding left and starting over without a seam. It stops under the pointer or the keyboard's
// focus, and stays still for reduced motion, where it scrolls by hand instead. When everything fits it is a
// plain row.
export function Marquee({
  label,
  count,
  children,
}: {
  label: string;
  /** How many items the list holds, to set the pace. */
  count: number;
  children: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const outer = box.current;
    const inner = list.current;
    if (!outer || !inner) return;
    const measure = () => setMoving(inner.offsetWidth > outer.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  const row = cn("flex shrink-0 gap-2 lg:gap-3", moving && "pr-2 lg:pr-3");

  return (
    <div
      ref={box}
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- for reduced motion the row scrolls by hand, so the keyboard must reach it (WCAG 2.1.1).
      tabIndex={0}
      className="min-w-0 flex-1 marquee-box rounded-xl px-1.5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
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
