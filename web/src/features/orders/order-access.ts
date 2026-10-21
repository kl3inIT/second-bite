import "server-only";

import { cookies } from "next/headers";

/**
 * The orders this browser placed without signing in, each with the access that proves it is theirs
 * (SEC-76 › decision 7). An httpOnly cookie, so no script reads it (docs/guidelines/web.md › Stack); the
 * order pages render on the server and send the access to the API as `Order-Access`.
 */
const accessCookie = "secondbite_orders";
/** The newest orders kept; an order ends within its day, so a few days of them is plenty. */
const MAX_KEPT = 20;
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const ORDER_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const ACCESS = /^[A-Za-z0-9_-]{16,64}$/;

/** Order identifiers and their access, newest first. */
type Kept = [orderId: string, access: string][];

function isKept(value: unknown): value is Kept {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        Array.isArray(entry) &&
        entry.length === 2 &&
        ORDER_ID.test(String(entry[0])) &&
        ACCESS.test(String(entry[1])),
    )
  );
}

/** The orders kept in this browser, newest first. It reads the request, so it renders inside Suspense. */
export async function keptOrders(): Promise<Kept> {
  const value = (await cookies()).get(accessCookie)?.value;
  if (!value) return [];
  try {
    const kept: unknown = JSON.parse(value);
    return isKept(kept) ? kept : [];
  } catch {
    return [];
  }
}

/** The access this browser keeps for an order, if it placed it without signing in. */
export async function accessOf(orderId: string): Promise<string | undefined> {
  return (await keptOrders()).find(([id]) => id === orderId)?.[1];
}

/** Keeps an order's access first in the cookie, dropping the oldest past `MAX_KEPT`. */
export async function keepAccess(orderId: string, access: string): Promise<void> {
  if (!ORDER_ID.test(orderId) || !ACCESS.test(access)) return;
  const kept = (await keptOrders()).filter(([id]) => id !== orderId);
  (await cookies()).set(
    accessCookie,
    JSON.stringify([[orderId, access], ...kept].slice(0, MAX_KEPT)),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: MAX_AGE_SECONDS,
    },
  );
}
