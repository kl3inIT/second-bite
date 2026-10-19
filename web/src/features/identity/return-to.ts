import { routing } from "@/i18n/routing";

const base = "https://second-bite.invalid";
const localePrefix = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

/**
 * Where sign-in sends a person back to: a path on this site, without its language, since the page they
 * return to keeps the language they chose. Anything else, an address on another site among them, goes home
 * (SEC-29 › Web: `returnTo` is accepted only as a path on our own origin).
 */
export function readReturnTo(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/")) return "/";
  let url: URL;
  try {
    url = new URL(value, base);
  } catch {
    return "/";
  }
  if (url.origin !== base) return "/";
  const path = url.pathname.replace(localePrefix, "") || "/";
  return `${path}${url.search}${url.hash}`;
}
