import { NextIntlClientProvider } from "next-intl";
import { type AnchorHTMLAttributes, createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { formats } from "@/i18n/formats";

import accounts from "../../../../messages/admin/accounts.vi.json";
import content from "../../../../messages/admin/content.vi.json";
import issues from "../../../../messages/admin/issues.vi.json";
import notifications from "../../../../messages/admin/notifications.vi.json";
import offers from "../../../../messages/admin/offers.vi.json";
import orders from "../../../../messages/admin/orders.vi.json";
import overview from "../../../../messages/admin/overview.vi.json";
import payments from "../../../../messages/admin/payments.vi.json";
import promotions from "../../../../messages/admin/promotions.vi.json";
import reports from "../../../../messages/admin/reports.vi.json";
import reviews from "../../../../messages/admin/reviews.vi.json";
import sellers from "../../../../messages/admin/sellers.vi.json";
import settings from "../../../../messages/admin/settings.vi.json";
import shell from "../../../../messages/admin/shell.vi.json";
import sponsors from "../../../../messages/admin/sponsors.vi.json";
import { AdminCrumbsProvider } from "../admin-crumbs";

// Renders an admin screen with sample data to HTML in Node, as the admin's unit tests do while the screens'
// backends do not exist (SEC-62): the rows come in through props, never from the page's empty source. Vitest has
// no DOM, and portals (dialogs, sheets) do not render on the server, so their bodies are tested on their own.

const admin = {
  shell,
  overview,
  sellers,
  offers,
  orders,
  payments,
  issues,
  reviews,
  accounts,
  promotions,
  content,
  notifications,
  sponsors,
  reports,
  settings,
};

/**
 * The element's HTML in Vietnamese and Vietnam time, with every admin catalog under `admin`. `messages` are the
 * site's namespaces a screen borrows, such as `OfferKind`; `now` fixes the time relative dates count from. A
 * detail page names its last crumb, so the admin layout's crumbs provider is around it. The test mocks
 * `@/i18n/navigation`, which needs Next's router (`navigationMock`, or its own).
 */
export function renderAdmin(
  node: ReactNode,
  { messages = {}, now }: { messages?: Record<string, unknown>; now?: Date } = {},
): string {
  return renderToStaticMarkup(
    <NextIntlClientProvider
      locale="vi"
      timeZone="Asia/Ho_Chi_Minh"
      now={now}
      formats={formats}
      messages={{ ...messages, admin }}
    >
      <AdminCrumbsProvider>{node}</AdminCrumbsProvider>
    </NextIntlClientProvider>,
  );
}

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

/** The words a person reads in some HTML, its tags removed, its entities read and its spaces collapsed. */
export function textOf(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
