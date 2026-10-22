"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";

import { stored } from "./stored";

// A set of ids kept in this browser only, such as the dishes a person hearted: a convenience until their
// account keeps it, so storage that is blocked or full simply keeps nothing.
export type KeptIds = {
  /** Whether the id is kept; false on the server and before hydration. */
  useHas: (id: string) => boolean;
  toggle: (id: string) => void;
  add: (id: string) => void;
};

const none: readonly string[] = [];

export function keptIds(key: string): KeptIds {
  const kept = stored<readonly string[]>(key, z.array(z.string()), none);

  return {
    useHas: (id) =>
      useSyncExternalStore(
        kept.subscribe,
        () => kept.read().includes(id),
        () => false,
      ),
    toggle(id) {
      const ids = kept.read();
      kept.save(ids.includes(id) ? ids.filter((each) => each !== id) : [...ids, id]);
    },
    add(id) {
      const ids = kept.read();
      if (!ids.includes(id)) kept.save([...ids, id]);
    },
  };
}
