import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";

import { parseJson } from "@/lib/json";

import { defined, loadHomeSearchParams } from "./search-params";

/**
 * The place a customer chose in the area sheet, kept so the next visit opens on it (customer place increment,
 * step 3), as ShopeeFood keeps an address and foodsharing a home. An httpOnly cookie, as the orders' is
 * (docs/guidelines/web.md › Stack): the pages render on the server and read it there. It holds the point rounded
 * to about 110 m and the place's name, nothing else; choosing "Tất cả quán" forgets it.
 */
const placeCookie = "secondbite_place";
const MAX_AGE_SECONDS = 180 * 24 * 60 * 60;

type Place = { near?: string; place?: string };

const stored: z.ZodType<{ near: string; place?: string }> = z.object({
  near: z.string(),
  place: z.string().optional(),
});

/** The place kept in this browser, read by the address's own rules; none when absent or not one. */
async function rememberedPlace(): Promise<Place> {
  const value = (await cookies()).get(placeCookie)?.value;
  const read = value ? parseJson(value, stored) : undefined;
  if (!read) return {};
  const { near, place } = defined(loadHomeSearchParams(read));
  return near ? { near, place } : {};
}

/**
 * A query whose address names no place takes the kept one; a place in the address, as a shared link has, wins.
 * It reads the request, so it renders inside Suspense.
 */
export async function withRememberedPlace<T extends Place>(query: T): Promise<T> {
  if (query.near) return query;
  const kept = await rememberedPlace();
  return kept.near ? { ...query, ...kept } : query;
}

/** Keeps a place chosen in the area sheet. */
export async function keepPlace(near: string, place?: string): Promise<void> {
  const { near: point, place: name } = defined(loadHomeSearchParams({ near, place }));
  if (!point) return;
  (await cookies()).set(placeCookie, JSON.stringify({ near: point, place: name }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Forgets the kept place, when "Tất cả quán" is chosen. */
export async function forgetPlace(): Promise<void> {
  (await cookies()).delete(placeCookie);
}
