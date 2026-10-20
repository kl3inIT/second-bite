"use client";

import { useSyncExternalStore } from "react";

// The words a person searched for lately (Figma K2a "Tìm gần đây"), kept in this browser only: a
// convenience, so storage that is blocked or full simply keeps nothing.
const KEY = "secondbite.recent-searches";
const LIMIT = 5;
const listeners = new Set<() => void>();
const none: readonly string[] = [];
let cache: { raw: string | null; list: readonly string[] } = { raw: null, list: none };

function read(): readonly string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return none;
  }
  if (raw !== cache.raw) {
    let list: readonly string[] = none;
    try {
      const parsed: unknown = JSON.parse(raw ?? "[]");
      if (Array.isArray(parsed)) list = parsed.filter((item) => typeof item === "string");
    } catch {
      // A value written by something else is ignored.
    }
    cache = { raw, list };
  }
  return cache.list;
}

function write(list: readonly string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    return;
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The recent searches, newest first, and ways to add, remove and clear them. */
export function useRecentSearches() {
  const list = useSyncExternalStore(subscribe, read, () => none);
  return {
    list,
    remember: (words: string) => {
      const current = read();
      if (current[0] === words) return;
      write([words, ...current.filter((item) => item !== words)].slice(0, LIMIT));
    },
    forget: (words: string) => write(read().filter((item) => item !== words)),
    clear: () => write([]),
  };
}
