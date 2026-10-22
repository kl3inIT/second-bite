"use client";

import { z } from "zod";

import { stored } from "@/lib/stored";

// The words a person searched for lately (Figma K2a "Tìm gần đây"), kept in this browser only: a
// convenience, so storage that is blocked or full simply keeps nothing.
const LIMIT = 5;
const none: readonly string[] = [];
const recent = stored<readonly string[]>("secondbite.recent-searches", z.array(z.string()), none);

/** The recent searches, newest first. */
export function useRecentSearches(): readonly string[] {
  return recent.useValue();
}

export function rememberSearch(words: string) {
  const current = recent.read();
  if (current[0] === words) return;
  recent.save([words, ...current.filter((item) => item !== words)].slice(0, LIMIT));
}

export function forgetSearch(words: string) {
  recent.save(recent.read().filter((item) => item !== words));
}

export function clearSearches() {
  recent.save([]);
}
