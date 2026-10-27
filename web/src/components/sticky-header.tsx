"use client";

import { useEffect, useRef, useState } from "react";

import { contentWidth } from "@/lib/layout";
import { cn } from "@/lib/utils";

// Once the header's own row has scrolled away, a slim copy of it stays at the top of the screen (NN/g: a
// sticky header helps on a long page; ShopeeFood and GrabFood keep theirs). The header itself holds
// tonight's deals and is too tall to stick. On a phone the copy keeps only what the page leaves visible
// there, the search field, on the blue with a rounded foot (Figma K1b).
export function StickyHeader({ children }: { children: React.ReactNode }) {
  const marker = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const target = marker.current;
    if (!target) return;
    // Shown only once the row is above the screen, not while the page is still laying out below it.
    const observer = new IntersectionObserver(([entry]) =>
      setShown(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={marker} aria-hidden className="absolute top-20 size-px" />
      {shown && (
        <div className="fixed inset-x-0 top-0 z-40 rounded-b-3xl bg-header pt-4 pb-3 text-header-foreground shadow-sheet md:rounded-none md:border-b md:border-header-border md:py-0">
          <div className={cn(contentWidth, "flex items-center gap-6 px-4 md:h-16")}>{children}</div>
        </div>
      )}
    </>
  );
}
