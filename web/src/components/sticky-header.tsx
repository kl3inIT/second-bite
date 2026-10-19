"use client";

import { useEffect, useRef, useState } from "react";

// From `lg`, once the header's own row has scrolled away, a slim copy of it stays at the top of the screen
// (NN/g: a sticky header helps on a long page; ShopeeFood and GrabFood keep theirs). The header itself holds
// tonight's deals and is too tall to stick. On a phone the bottom bar carries the way around instead.
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
        <div className="fixed inset-x-0 top-0 z-40 hidden border-b border-header-border bg-header text-header-foreground shadow-sheet lg:block">
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-6 px-4 xl:max-w-300">
            {children}
          </div>
        </div>
      )}
    </>
  );
}
