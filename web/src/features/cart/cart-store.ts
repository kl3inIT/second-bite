"use client";

import { useSyncExternalStore } from "react";

import { isCart, type Cart } from "./cart";

// The cart in this browser's storage, so it outlives a closed tab (SEC-49 decision 7). Storage that is
// blocked or full keeps nothing; another tab's change reaches this one through the `storage` event.
const KEY = "secondbite.cart";
const listeners = new Set<() => void>();
let cache: { raw: string | null; cart: Cart | null } = { raw: null, cart: null };

function read(): Cart | null {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return cache.cart;
  }
  if (raw !== cache.raw) {
    let cart: Cart | null = null;
    try {
      const parsed: unknown = JSON.parse(raw ?? "null");
      if (isCart(parsed)) cart = parsed;
    } catch {
      // A value written by something else is ignored.
    }
    cache = { raw, cart };
  }
  return cache.cart;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** The cart, or null when it is empty; null on the server and before hydration. */
export function useCart(): Cart | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function saveCart(cart: Cart | null) {
  try {
    if (cart) localStorage.setItem(KEY, JSON.stringify(cart));
    else localStorage.removeItem(KEY);
  } catch {
    return;
  }
  for (const listener of listeners) listener();
}
