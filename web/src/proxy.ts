import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { sessionCookie } from "@/features/identity/session-cookie";
import { routing } from "@/i18n/routing";

// Sends an address without a language to /vi or /en: the locale cookie first, then the device's
// language, then Vietnamese.
const intl = createMiddleware(routing);

const adminPath = new RegExp(`^/(${routing.locales.join("|")})/admin(?:/|$)`);

// Someone with no session who opens an admin page is sent to sign in and back, with a real 307 rather
// than a page streamed under 200 (SEC-75 › Guard). Only the cookie's presence is read here, never the API:
// whether it is an admin's live session is the page's question (`requireAdmin`) and the server's.
export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const admin = adminPath.exec(pathname);
  if (admin && !request.cookies.has(sessionCookie)) {
    const signIn = new URL(`/${admin[1]}/sign-in`, request.url);
    signIn.searchParams.set("returnTo", `${pathname.slice(admin[1].length + 1)}${search}`);
    return NextResponse.redirect(signIn, 307);
  }
  return intl(request);
}

export const config = {
  // Everything except the backend under /api, Next.js internals and files with an extension.
  matcher: "/((?!api(?:/|$)|_next|_vercel|.*\\..*).*)",
};
