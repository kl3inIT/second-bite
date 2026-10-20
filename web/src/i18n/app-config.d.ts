import type messages from "../../messages/vi.json";
import type accounts from "../../messages/admin/accounts.vi.json";
import type content from "../../messages/admin/content.vi.json";
import type issues from "../../messages/admin/issues.vi.json";
import type notifications from "../../messages/admin/notifications.vi.json";
import type offers from "../../messages/admin/offers.vi.json";
import type orders from "../../messages/admin/orders.vi.json";
import type overview from "../../messages/admin/overview.vi.json";
import type payments from "../../messages/admin/payments.vi.json";
import type promotions from "../../messages/admin/promotions.vi.json";
import type reports from "../../messages/admin/reports.vi.json";
import type reviews from "../../messages/admin/reviews.vi.json";
import type sellers from "../../messages/admin/sellers.vi.json";
import type settings from "../../messages/admin/settings.vi.json";
import type shell from "../../messages/admin/shell.vi.json";
import type sponsors from "../../messages/admin/sponsors.vi.json";

import type { AdminCatalog } from "./admin-catalogs";
import type { formats } from "./formats";
import type { routing } from "./routing";

/** Fails to compile when admin-catalogs.ts names a catalog the type below leaves out. */
type EveryCatalog<T extends Record<AdminCatalog, unknown>> = T;

/** The admin catalogs as request.ts merges them, `admin.<catalog>`; the Vietnamese files are the reference. */
type AdminMessages = EveryCatalog<{
  shell: typeof shell;
  overview: typeof overview;
  sellers: typeof sellers;
  offers: typeof offers;
  orders: typeof orders;
  payments: typeof payments;
  issues: typeof issues;
  reviews: typeof reviews;
  accounts: typeof accounts;
  promotions: typeof promotions;
  content: typeof content;
  notifications: typeof notifications;
  sponsors: typeof sponsors;
  reports: typeof reports;
  settings: typeof settings;
}>;

// Message keys, named formats and locales are checked by the compiler; vi.json is the reference catalog.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages & { admin: AdminMessages };
    Formats: typeof formats;
  }
}
