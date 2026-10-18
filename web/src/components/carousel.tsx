"use client";

import { cn } from "cn";
import { Children, useState } from "react";

// Full-width slides that scroll sideways one at a time, with dots below that follow the scroll (Figma
// banners, dots). Swiping or the keyboard moves it; the dots only show where you are, so they are hidden
// from assistive technology, which hears each slide's position instead.
export function Carousel({
  label,
  slideLabels,
  children,
}: {
  label: string;
  /** Each slide's position in words, such as "2 / 3", one per child. */
  slideLabels: string[];
  children: React.ReactNode;
}) {
  const slides = Children.toArray(children);
  const [active, setActive] = useState(0);

  function follow(track: HTMLElement) {
    const slide = track.firstElementChild;
    if (!(slide instanceof HTMLElement)) return;
    const step = slide.offsetWidth + Number.parseFloat(getComputedStyle(track).columnGap || "0");
    setActive(Math.min(slides.length - 1, Math.round(track.scrollLeft / step)));
  }

  return (
    <section aria-label={label} aria-roledescription="carousel" className="flex flex-col gap-4.5">
      <ul
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be reachable by keyboard.
        tabIndex={0}
        onScroll={(event) => follow(event.currentTarget)}
        className="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {slides.map((slide, index) => (
          <li
            key={index}
            aria-roledescription="slide"
            aria-label={slideLabels[index]}
            className="flex w-full shrink-0 snap-start"
          >
            {slide}
          </li>
        ))}
      </ul>
      {slides.length > 1 && (
        <div aria-hidden className="flex justify-center gap-1.5">
          {slides.map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 ease-out",
                index === active ? "w-4.5 bg-primary" : "w-1.5 bg-secondary-hover",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
