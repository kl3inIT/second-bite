"use client";

import { useEffect, useSyncExternalStore } from "react";
import { z } from "zod";

import {
  followSeller,
  listFollowedSellers,
  unfollowSeller,
  type SellerProfileBody,
} from "@/lib/api/generated";
import { stored } from "@/lib/stored";

// The sellers a person follows (SEC-109 › decisions 2 and 4): kept by their account once they are signed in,
// and in this browser until then. The first use asks the server; an answer of 401 means no one is signed in.
// Once someone is, the sellers kept in this browser are followed on the server and the browser forgets them.

const none: readonly string[] = [];
const local = stored<readonly string[]>("secondbite.follows", z.array(z.string()), none);

type Follows =
  | { state: "loading" }
  | { state: "local"; ids: readonly string[] }
  | { state: "account"; sellers: readonly SellerProfileBody[] };

let follows: Follows = { state: "loading" };
let started = false;
const listeners = new Set<() => void>();

function set(next: Follows) {
  follows = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function keepLocal(ids: readonly string[]) {
  if (ids.length === 0) local.clear();
  else local.save(ids);
}

async function load() {
  try {
    let { data } = await listFollowedSellers();
    const kept = local.read();
    if (kept.length > 0) {
      // Each seller kept here is followed by the account; one that is gone or not active is let go.
      await Promise.allSettled(kept.map((sellerId) => followSeller({ path: { sellerId } })));
      local.clear();
      ({ data } = await listFollowedSellers());
    }
    set({ state: "account", sellers: data.sellers ?? [] });
  } catch {
    // No one is signed in (401), or the server could not answer: the browser keeps them for now.
    set({ state: "local", ids: local.read() });
  }
}

/** The person's favourites, loading until the server has said who is signed in. */
export function useFollows(): Follows {
  useEffect(() => {
    if (started) return;
    started = true;
    void load();
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => follows,
    () => follows,
  );
}

/** The followed seller ids, newest first. */
export function followedIds(current: Follows): readonly string[] {
  if (current.state === "account") return current.sellers.map((seller) => seller.id);
  if (current.state === "local") return current.ids;
  return [];
}

/** Follows the seller, or lets them go when already followed; answers whether they are followed now. */
export async function toggleFollow(sellerId: string): Promise<boolean> {
  const following = !followedIds(follows).includes(sellerId);
  if (follows.state === "account") {
    if (following) await followSeller({ path: { sellerId } });
    else await unfollowSeller({ path: { sellerId } });
    const { data } = await listFollowedSellers();
    set({ state: "account", sellers: data.sellers ?? [] });
  } else {
    const kept = local.read().filter((id) => id !== sellerId);
    const ids = following ? [sellerId, ...kept] : kept;
    keepLocal(ids);
    set({ state: "local", ids });
  }
  return following;
}
