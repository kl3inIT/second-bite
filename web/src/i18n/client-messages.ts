import type { Messages } from "next-intl";
import { getMessages } from "next-intl/server";

/**
 * Namespaces that only server components read (the legal texts, the metadata, the footer, the splash, the seller's
 * lists drawn on the server), so the browser is never sent them (SEC-166). `client-messages.test.ts` fails when a
 * client component starts reading one.
 */
export const SERVER_ONLY = [
  "Metadata",
  "NotFound",
  "Intro",
  "Footer",
  "Legal",
  "Privacy",
  "Terms",
  "Splash",
  "Stores",
  "StoreHome",
  "StorePosts",
  "PostRow",
] as const;

/** Read in the browser only on the admin's pages, whose layout sends them. */
export const ADMIN_ONLY = ["Admin"] as const;

/**
 * The messages a page's client components may read: every namespace but the server's, and the admin's only under
 * `/admin`. Without this the provider sends the whole catalog with every page.
 */
export async function clientMessages(scope: "site" | "admin"): Promise<Partial<Messages>> {
  const kept: readonly string[] = scope === "admin" ? SERVER_ONLY : [...SERVER_ONLY, ...ADMIN_ONLY];
  const all = await getMessages();
  return Object.fromEntries(
    Object.entries(all).filter(([namespace]) => !kept.includes(namespace)),
  ) as Partial<Messages>;
}
