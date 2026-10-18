import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { formats } from "./formats";
import { routing } from "./routing";

// The locale is the [locale] root segment, read through next/root-params, so pages render statically
// without setRequestLocale and work with Cache Components (next-intl › Next.js root params).
export default getRequestConfig(async () => {
  const locale = await rootParams.locale();
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return {
    locale,
    // Prices, windows and orders are in Vietnam time, whoever reads them (PRODUCT.md).
    timeZone: "Asia/Ho_Chi_Minh",
    formats,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
