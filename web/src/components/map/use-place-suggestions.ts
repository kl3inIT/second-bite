"use client";

import { useEffect, useRef, useState } from "react";

import type { PlaceBody } from "@/lib/api/generated";

/** How long typing rests before the places are asked, as Photon asks callers to keep to a request at a time. */
const SEARCH_DELAY_MS = 300;
/** Fewer letters than this find too much to help. */
const MIN_LETTERS = 3;

/**
 * Places suggested for words as they are typed (SEC-66): asked once typing rests, from three letters, an answer
 * to older words dropped. `answered` turns true when the last words asked have their answer, so a caller can say
 * nothing was found; a search that failed answers no places, as one that found none.
 */
export function usePlaceSuggestions(find: (words: string) => Promise<PlaceBody[]>) {
  const [places, setPlaces] = useState<PlaceBody[]>([]);
  const [answered, setAnswered] = useState(false);
  const asked = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function search(words: string) {
    clearTimeout(timer.current);
    const ask = ++asked.current;
    setAnswered(false);
    if (words.trim().length < MIN_LETTERS) {
      setPlaces([]);
      return;
    }
    timer.current = setTimeout(() => {
      const settle = (found: PlaceBody[]) => {
        if (ask !== asked.current) return;
        setPlaces(found);
        setAnswered(true);
      };
      find(words.trim()).then(settle, () => settle([]));
    }, SEARCH_DELAY_MS);
  }

  function clear() {
    clearTimeout(timer.current);
    asked.current++;
    setPlaces([]);
    setAnswered(false);
  }

  return { places, answered, search, clear };
}
