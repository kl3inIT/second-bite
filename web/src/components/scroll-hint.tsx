"use client";

import { useEffect, useRef, useState } from "react";

// The short track under a row that scrolls sideways (Figma scroll hint): a 36px pale track whose blue half
// follows the row, in place of the browser's scrollbar. It is hidden when everything already fits.
export function ScrollHint({ target }: { target: string }) {
  const thumb = useRef<HTMLSpanElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const row = document.getElementById(target);
    if (!row) return;
    const update = () => {
      const room = row.scrollWidth - row.clientWidth;
      setScrollable(room > 1);
      if (thumb.current) {
        thumb.current.style.transform = `translateX(${room > 0 ? (row.scrollLeft / room) * 100 : 0}%)`;
      }
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [target]);

  return (
    <div
      aria-hidden
      className={scrollable ? "flex justify-center" : "invisible flex justify-center"}
    >
      <span className="h-1 w-9 overflow-hidden rounded-xs bg-secondary-hover">
        <span ref={thumb} className="block h-full w-1/2 rounded-xs bg-primary" />
      </span>
    </div>
  );
}
