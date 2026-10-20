"use client";

import { useEffect, useState } from "react";

/**
 * A key that changes each time the page holding the component is left. Next.js keeps a page a person has left,
 * hidden, with its state, so that going back finds it as it was; a form or a drawer that did its job
 * (a dish posted, a store opened) must start again from the first step on the next visit, not show what was
 * typed. A component keyed by this is made anew once its page is hidden, while nobody sees it.
 */
export function useRemountKey(): number {
  const [key, setKey] = useState(0);

  useEffect(() => () => setKey((current) => current + 1), []);

  return key;
}
