"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

// How far the pointer moves before a press becomes a drag, so a click on a link still opens it.
const DRAG_THRESHOLD_PX = 5;

// A row that scrolls sideways to the screen's edge, 16px in from it, snapping to each item (Figma carousel,
// categories). It shows no scrollbar (ScrollHint stands in for one), so a mouse drags it as a finger does. It
// takes keyboard focus so a row without links can still be scrolled (WCAG 2.1.1).
export function ScrollRow({
  id,
  label,
  className,
  children,
}: {
  id?: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  return (
    <ul
      id={id}
      aria-label={label}
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be reachable by keyboard.
      tabIndex={0}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
      }}
      onPointerMove={(event) => {
        const start = drag.current;
        if (!start) return;
        const row = event.currentTarget;
        const distance = event.clientX - start.x;
        if (!start.moved && Math.abs(distance) < DRAG_THRESHOLD_PX) return;
        if (!start.moved) {
          start.moved = true;
          row.setPointerCapture(event.pointerId);
          // Snapping fights the pointer while it drags; it returns when the drag ends.
          row.style.scrollSnapType = "none";
        }
        row.scrollLeft = start.left - distance;
      }}
      onPointerUp={(event) => {
        const start = drag.current;
        if (start?.moved) {
          const row = event.currentTarget;
          row.style.scrollSnapType = "";
          // A drag that ends over a link does not open it; the click, if any, follows at once.
          const stopClick = (click: MouseEvent) => click.preventDefault();
          row.addEventListener("click", stopClick, { capture: true, once: true });
          setTimeout(() => row.removeEventListener("click", stopClick, true));
        }
        drag.current = null;
      }}
      onPointerCancel={(event) => {
        event.currentTarget.style.scrollSnapType = "";
        drag.current = null;
      }}
      // Links and pictures would otherwise start the browser's own drag of the link or image.
      onDragStart={(event) => event.preventDefault()}
      className={cn(
        "scrollbar-none flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </ul>
  );
}
