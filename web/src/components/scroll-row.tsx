"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// How far the pointer moves before a press becomes a drag, so a click on a link still opens it.
const DRAG_THRESHOLD_PX = 5;

// A row that scrolls sideways to the screen's edge, 16px in from it, snapping to each item (Figma carousel,
// categories). It shows no scrollbar, so a mouse drags it as a finger does, and `hint` puts the short track of
// Figma's scroll hint under it: 36px of pale blue whose blue half follows the row, hidden when all fits. It
// takes keyboard focus so a row without links can still be scrolled (WCAG 2.1.1).
export function ScrollRow({
  label,
  hint = false,
  className,
  children,
}: {
  label: string;
  hint?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const row = useRef<HTMLUListElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const element = row.current;
    if (!element) return;
    let drag: { x: number; left: number; moved: boolean } | null = null;

    const follow = () => {
      const room = element.scrollWidth - element.clientWidth;
      setScrollable(room > 1);
      if (thumb.current) {
        thumb.current.style.transform = `translateX(${room > 0 ? (element.scrollLeft / room) * 100 : 0}%)`;
      }
    };
    const press = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag = { x: event.clientX, left: element.scrollLeft, moved: false };
    };
    const move = (event: PointerEvent) => {
      if (!drag) return;
      const distance = event.clientX - drag.x;
      if (!drag.moved && Math.abs(distance) < DRAG_THRESHOLD_PX) return;
      if (!drag.moved) {
        drag.moved = true;
        element.setPointerCapture(event.pointerId);
        // Snapping fights the pointer while it drags; it returns when the drag ends.
        element.style.scrollSnapType = "none";
      }
      element.scrollLeft = drag.left - distance;
    };
    const release = () => {
      if (drag?.moved) {
        element.style.scrollSnapType = "";
        // A drag that ends over a link does not open it; the click, if any, follows at once.
        const stopClick = (click: MouseEvent) => click.preventDefault();
        element.addEventListener("click", stopClick, { capture: true, once: true });
        setTimeout(() => element.removeEventListener("click", stopClick, true));
      }
      drag = null;
    };
    // Links and pictures would otherwise start the browser's own drag of the link or image.
    const stopNativeDrag = (event: DragEvent) => event.preventDefault();

    follow();
    const observer = new ResizeObserver(follow);
    observer.observe(element);
    element.addEventListener("scroll", follow, { passive: true });
    element.addEventListener("pointerdown", press);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", release);
    element.addEventListener("pointercancel", release);
    element.addEventListener("dragstart", stopNativeDrag);
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", follow);
      element.removeEventListener("pointerdown", press);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", release);
      element.removeEventListener("pointercancel", release);
      element.removeEventListener("dragstart", stopNativeDrag);
    };
  }, []);

  return (
    <>
      <ul
        ref={row}
        aria-label={label}
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be reachable by keyboard.
        tabIndex={0}
        className={cn(
          "scrollbar-none flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          className,
        )}
      >
        {children}
      </ul>
      {hint && (
        <div aria-hidden className={cn("flex justify-center", !scrollable && "invisible")}>
          <span className="h-1 w-9 overflow-hidden rounded-xs bg-secondary-hover">
            <span ref={thumb} className="block h-full w-1/2 rounded-xs bg-primary" />
          </span>
        </div>
      )}
    </>
  );
}
