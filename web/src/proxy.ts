import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";
import type { AccountBody } from "@/lib/api/generated";

// Sends an address without a language to /vi or /en: the locale cookie first, then the device's
// language, then Vietnamese.
const localize = createMiddleware(routing);

/** The session cookie the Go server sets on sign-in (see features/identity/current-account.ts). */
const sessionCookie = "secondbite_session";

const adminAddress = new RegExp(`^/(${routing.locales.join("|")})/admin(?:/|$)`);

/**
 * Whether the request comes from someone signed in who is not an admin. The admin layout checks again and
 * shows them the not-found page, but it does so while streaming, after the status went out as 200; asking
 * here first lets the address answer 404 (SEC-62). Anyone else, or a backend that does not answer, is left
 * to the layout: no session or an ended one signs in, a failure shows the error page.
 */
async function signedInNonAdmin(request: NextRequest): Promise<boolean> {
  const session = request.cookies.get(sessionCookie);
  if (!session) return false;
  // A plain fetch, not the generated client: the client asks next-intl for the page's language (SEC-28),
  // which the proxy's bundle cannot load. The proxy needs no words, only the role.
  let response: Response;
  try {
    response = await fetch(`${process.env.SECONDBITE_API_ORIGIN ?? ""}/accounts/me`, {
      headers: { cookie: `${sessionCookie}=${session.value}` },
    });
  } catch {
    return false;
  }
  if (!response.ok) return false;
  const account = (await response.json()) as Pick<AccountBody, "role">;
  return account.role !== "admin";
}

export default async function proxy(request: NextRequest) {
  const admin = adminAddress.exec(request.nextUrl.pathname);
  if (admin && (await signedInNonAdmin(request))) {
    // An address under the language that no page answers: the customer's not-found page, with 404, while the
    // browser keeps the address it asked for. Nothing tells them the admin exists.
    return NextResponse.rewrite(new URL(`/${admin[1]}/not-found`, request.url));
  }
  return localize(request);
}

export const config = {
  // Everything except the backend under /api, Next.js internals and files with an extension.
  matcher: "/((?!api(?:/|$)|_next|_vercel|.*\\..*).*)",
};
