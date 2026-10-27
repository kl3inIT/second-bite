"use client";

import { stored } from "@/lib/stored";

import { storedCart, type Cart } from "./cart";

// The cart in this browser's storage, so it outlives a closed tab (SEC-49 decision 7). Storage that is
// blocked or full keeps nothing; another tab's change reaches this one through the `storage` event.
const kept = stored<Cart | null>("secondbite.cart", storedCart, null);

/** The cart, or null when it is empty; null on the server and before hydration. */
export function useCart(): Cart | null {
  return kept.useValue();
}

export function saveCart(cart: Cart | null) {
  if (cart) kept.save(cart);
  else kept.clear();
}
