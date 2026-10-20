import { NextIntlClientProvider } from "next-intl";
import { type AnchorHTMLAttributes, createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { formats } from "@/i18n/formats";

import content from "../../../../messages/admin/content.vi.json";
import notifications from "../../../../messages/admin/notifications.vi.json";
import promotions from "../../../../messages/admin/promotions.vi.json";
import shell from "../../../../messages/admin/shell.vi.json";
import sponsors from "../../../../messages/admin/sponsors.vi.json";

// Renders a marketing screen with sample rows to HTML in Node, as the admin's tests do while their backends do
// not exist (SEC-62): the rows come in through props, never from the page's empty source.

/** What a test file mocks `@/i18n/navigation` with: plain links and a router that goes nowhere. */
export const navigationMock = {
  Link: ({
    href,
    scroll: _scroll,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; scroll?: boolean }) =>
    createElement("a", { ...props, href }),
  useRouter: () => ({ push: () => {}, replace: () => {} }),
  usePathname: () => "/admin",
};

/** The element's HTML in Vietnamese, inside the admin's messages and formats. */
export function renderAdmin(element: ReactElement): string {
  return renderToStaticMarkup(
    <NextIntlClientProvider
      locale="vi"
      timeZone="Asia/Ho_Chi_Minh"
      formats={formats}
      messages={{ admin: { shell, promotions, content, notifications, sponsors } }}
    >
      {element}
    </NextIntlClientProvider>,
  );
}

/** The words a person reads in some HTML, its tags removed and its spaces collapsed. */
export function textOf(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
