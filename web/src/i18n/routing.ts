import { defineRouting } from "next-intl/routing";

// Vietnamese and English on every page (PRODUCT.md › Operating Context). Every address names its
// language (/vi/…, /en/…). The first visit follows the device's language (Accept-Language); a person
// who switches keeps that choice for a year in next-intl's locale cookie.
export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "always",
  localeCookie: { maxAge: 60 * 60 * 24 * 365 },
});
