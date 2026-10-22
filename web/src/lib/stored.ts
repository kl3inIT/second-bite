import { useSyncExternalStore } from "react";
import type { z } from "zod";

import { parseJson } from "./json";

/**
 * A value kept in this browser's storage under one key. When storage is blocked or full, the page keeps the value
 * until it is closed and the next visit starts from the fallback. Anything may have written there, so it is read through its schema, and a value that does not parse
 * reads as the fallback. Another tab's change arrives through the `storage` event, and the server and
 * hydration see the fallback.
 */
export type Stored<T> = {
  read: () => T;
  save: (value: T) => void;
  /** Takes the key out of storage, so it reads as the fallback. */
  clear: () => void;
  subscribe: (listener: () => void) => () => void;
  /** The value; the fallback on the server and before hydration. */
  useValue: () => T;
};

export function stored<T>(key: string, schema: z.ZodType<T>, fallback: T): Stored<T> {
  const listeners = new Set<() => void>();
  // The value parsed from the text last read, so an unchanged text gives the same object back.
  let cache: { raw: string | null; value: T } = { raw: null, value: fallback };
  // A value storage refused, blocked or full: this page keeps showing it until a write succeeds.
  let unsaved: { value: T } | null = null;

  function read(): T {
    if (unsaved) return unsaved.value;
    let raw: string | null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      return cache.value;
    }
    if (raw !== cache.raw) {
      cache = { raw, value: raw === null ? fallback : (parseJson(raw, schema) ?? fallback) };
    }
    return cache.value;
  }

  function write(value: T | null) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
      unsaved = null;
    } catch {
      unsaved = { value: value ?? fallback };
    }
    for (const listener of listeners) listener();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    window.addEventListener("storage", listener);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", listener);
    };
  }

  return {
    read,
    save: (value) => write(value),
    clear: () => write(null),
    subscribe,
    useValue: () => useSyncExternalStore(subscribe, read, () => fallback),
  };
}
