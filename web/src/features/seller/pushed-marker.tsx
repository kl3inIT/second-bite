"use client";

import { useLayoutEffect, useRef } from "react";

// Marks the page as a pushed screen of the store (a dish form): on a phone the layout then shows the top bar and
// not the header and the tab bar, by CSS alone (`group-has-[[data-pushed]]`), so no script has to learn the address.
// It is in the page's own shell, outside Suspense, so the right layout is there from the first paint.
//
// The router keeps the page it leaves in a tree that is hidden, not removed, and `:has()` still finds a marker
// inside it, so another page of the store would wear the form's look. The marker therefore takes its attribute off
// when its page is hidden or gone, and puts it back when the page is shown again: a hidden tree's effects are cleaned
// up, and run again when it returns.
export function PushedMarker() {
  const marker = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = marker.current;
    element?.setAttribute("data-pushed", "");
    return () => element?.removeAttribute("data-pushed");
  }, []);

  return <span ref={marker} hidden data-pushed />;
}
