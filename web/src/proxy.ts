import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

// Sends an address without a language to /vi or /en: the locale cookie first, then the device's
// language, then Vietnamese.
export default createMiddleware(routing);

export const config = {
  // Everything except the backend under /api, Next.js internals and files with an extension.
  matcher: "/((?!api(?:/|$)|_next|_vercel|.*\\..*).*)",
};
