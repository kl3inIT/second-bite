import { mintLiveTickets } from "@/features/orders/live-tickets";
import { subscribePush } from "@/lib/api/generated";

/**
 * What this browser can do with Web Push (SEC-25):
 * - `ready`: it can subscribe;
 * - `install`: an iPhone or iPad outside a Home Screen app, where Safari offers push only once the site is added
 *   to the Home Screen and opened from there;
 * - `unsupported`: anything else without push.
 */
export type PushSupport = "ready" | "install" | "unsupported";

export function pushSupport(): PushSupport {
  if ("serviceWorker" in navigator && "PushManager" in window && "Notification" in window)
    return "ready";
  // iPadOS reports itself as a Mac, and is told from one by its touch screen.
  const apple =
    /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1);
  return apple && !matchMedia("(display-mode: standalone)").matches ? "install" : "unsupported";
}

/** The VAPID public key, from base64url to the bytes `PushManager.subscribe` takes. */
function keyBytes(key: string): Uint8Array<ArrayBuffer> {
  const base64 = key.replaceAll("-", "+").replaceAll("_", "/");
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

function sameKey(subscription: PushSubscription, key: Uint8Array): boolean {
  const current = subscription.options.applicationServerKey;
  if (!current) return false;
  const bytes = new Uint8Array(current);
  return bytes.length === key.length && bytes.every((byte, index) => byte === key[index]);
}

/**
 * Makes this browser follow the topics by Web Push, once notifications are allowed: it registers the service
 * worker, subscribes with the server's key (again, when the key changed), mints a live ticket for each topic and
 * gives the server the subscription with them. Every call renews the topics for seven days.
 */
export async function followByPush(topics: string[], publicKey: string): Promise<void> {
  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
    updateViaCache: "none",
  });
  await navigator.serviceWorker.ready;

  const key = keyBytes(publicKey);
  let subscription = await registration.pushManager.getSubscription();
  if (subscription && !sameKey(subscription, key)) {
    await subscription.unsubscribe();
    subscription = null;
  }
  subscription ??= await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: key,
  });

  const { endpoint, keys } = subscription.toJSON();
  const tickets = Object.values(await mintLiveTickets(topics));
  if (!endpoint || !keys?.p256dh || !keys.auth || tickets.length === 0) {
    throw new Error("The subscription or the tickets are missing");
  }
  await subscribePush({
    body: { endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth }, tickets },
  });
}
