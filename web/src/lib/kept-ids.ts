"use client";

import { useSyncExternalStore } from "react";

// A set of ids kept in this browser only, such as the dishes a person hearted: a convenience until their
// account keeps it, so storage that is blocked or full simply keeps nothing.
export type KeptIds = {
  /** Whether the id is kept; false on the server and before hydration. */
  useHas: (id: string) => boolean;
  toggle: (id: string) => void;
  add: (id: string) => void;
};

export function keptIds(key: string): KeptIds {
  const listeners = new Set<() => void>();
  let cache: { raw: string | null; ids: ReadonlySet<string> } = { raw: null, ids: new Set() };

  function read(): ReadonlySet<string> {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      return cache.ids;
    }
    if (raw !== cache.raw) {
      let ids = new Set<string>();
      try {
        const parsed: unknown = JSON.parse(raw ?? "[]");
        if (Array.isArray(parsed)) ids = new Set(parsed.filter((id) => typeof id === "string"));
      } catch {
        // A value written by something else is ignored.
      }
      cache = { raw, ids };
    }
    return cache.ids;
  }

  function write(ids: ReadonlySet<string>) {
    try {
      localStorage.setItem(key, JSON.stringify([...ids]));
    } catch {
      return;
    }
    for (const listener of listeners) listener();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return {
    useHas: (id) =>
      useSyncExternalStore(
        subscribe,
        () => read().has(id),
        () => false,
      ),
    toggle(id) {
      const ids = new Set(read());
      if (!ids.delete(id)) ids.add(id);
      write(ids);
    },
    add(id) {
      if (!read().has(id)) write(new Set(read()).add(id));
    },
  };
}
