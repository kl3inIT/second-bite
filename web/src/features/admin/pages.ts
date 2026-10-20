import {
  ChartColumnIcon,
  HandshakeIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  type LucideIcon,
  MegaphoneIcon,
  PackageIcon,
  ReceiptIcon,
  SettingsIcon,
  StarIcon,
  StoreIcon,
  TicketPercentIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

/** Where a page sits in the sidebar (Figma Admin/Sidebar): its group, in this order. */
export type AdminNavGroup = "top" | "operations" | "users" | "marketing" | "bottom";

/** The first crumb of a page's breadcrumb: the admin itself, or the group it belongs to. */
export type AdminSection = "admin" | "operations" | "users" | "marketing" | "settings";

type PageSpec = {
  /** The address without the language; a `[name]` segment is a parameter. */
  path: `/admin/${string}`;
  section: AdminSection;
  /** The page's icon in the sidebar and on its coming-soon page (Lucide, as in Figma). */
  icon: LucideIcon;
  /** Its place in the sidebar; a settings page or a detail page has none and lights its parent. */
  nav?: AdminNavGroup;
  parent?: AdminPageKey;
  /**
   * Whether the page is open. An unreleased page keeps its code, its route shows the shared coming-soon page
   * and its sidebar item carries "Sắp có" (docs: admin-web-flow › Menu đầy đủ và trang Sắp ra mắt). Every page
   * is open until the founder names the ones to hide.
   */
  released: boolean;
};

type AdminPageKey =
  | "overview"
  | "sellers"
  | "sellerDetail"
  | "offers"
  | "orders"
  | "orderDetail"
  | "payments"
  | "issues"
  | "issueDetail"
  | "reviews"
  | "accounts"
  | "accountDetail"
  | "promotions"
  | "content"
  | "bannerDetail"
  | "notifications"
  | "notificationsCompose"
  | "sponsors"
  | "reports"
  | "settings"
  | "settingsOffers"
  | "settingsEmail"
  | "settingsCategories"
  | "settingsAreas"
  | "settingsAdmins"
  | "settingsAuditLog"
  | "settingsLegal"
  | "settingsIntegrations";

/**
 * Every admin page, in sidebar order (SEC-62): the one place the sidebar, the breadcrumb, the page flags and
 * the coming-soon page read. A detail page (`…Detail`) takes its name from the page itself (`AdminCrumb`).
 */
export const adminPages = {
  overview: {
    path: "/admin/overview",
    section: "admin",
    icon: LayoutDashboardIcon,
    nav: "top",
    released: true,
  },
  sellers: {
    path: "/admin/sellers",
    section: "operations",
    icon: StoreIcon,
    nav: "operations",
    released: true,
  },
  sellerDetail: {
    path: "/admin/sellers/[sellerId]",
    section: "operations",
    icon: StoreIcon,
    parent: "sellers",
    released: true,
  },
  offers: {
    path: "/admin/offers",
    section: "operations",
    icon: PackageIcon,
    nav: "operations",
    released: true,
  },
  orders: {
    path: "/admin/orders",
    section: "operations",
    icon: ReceiptIcon,
    nav: "operations",
    released: true,
  },
  orderDetail: {
    path: "/admin/orders/[orderId]",
    section: "operations",
    icon: ReceiptIcon,
    parent: "orders",
    released: true,
  },
  payments: {
    path: "/admin/payments",
    section: "operations",
    icon: WalletIcon,
    nav: "operations",
    released: true,
  },
  issues: {
    path: "/admin/issues",
    section: "operations",
    icon: LifeBuoyIcon,
    nav: "operations",
    released: true,
  },
  issueDetail: {
    path: "/admin/issues/[issueId]",
    section: "operations",
    icon: LifeBuoyIcon,
    parent: "issues",
    released: true,
  },
  reviews: {
    path: "/admin/reviews",
    section: "operations",
    icon: StarIcon,
    nav: "operations",
    released: true,
  },
  accounts: {
    path: "/admin/accounts",
    section: "users",
    icon: UsersIcon,
    nav: "users",
    released: true,
  },
  accountDetail: {
    path: "/admin/accounts/[accountId]",
    section: "users",
    icon: UsersIcon,
    parent: "accounts",
    released: true,
  },
  promotions: {
    path: "/admin/promotions",
    section: "marketing",
    icon: TicketPercentIcon,
    nav: "marketing",
    released: true,
  },
  content: {
    path: "/admin/content",
    section: "marketing",
    icon: ImageIcon,
    nav: "marketing",
    released: true,
  },
  bannerDetail: {
    path: "/admin/content/banners/[bannerId]",
    section: "marketing",
    icon: ImageIcon,
    parent: "content",
    released: true,
  },
  notifications: {
    path: "/admin/notifications",
    section: "marketing",
    icon: MegaphoneIcon,
    nav: "marketing",
    released: true,
  },
  notificationsCompose: {
    path: "/admin/notifications/new",
    section: "marketing",
    icon: MegaphoneIcon,
    parent: "notifications",
    released: true,
  },
  sponsors: {
    path: "/admin/sponsors",
    section: "marketing",
    icon: HandshakeIcon,
    nav: "marketing",
    released: true,
  },
  // Figma AD-BC1 heads the reports with "Vận hành / Báo cáo".
  reports: {
    path: "/admin/reports",
    section: "operations",
    icon: ChartColumnIcon,
    nav: "bottom",
    released: true,
  },
  settings: {
    path: "/admin/settings",
    section: "admin",
    icon: SettingsIcon,
    nav: "bottom",
    released: true,
  },
  settingsOffers: {
    path: "/admin/settings/offers",
    section: "settings",
    icon: PackageIcon,
    parent: "settings",
    released: true,
  },
  settingsEmail: {
    path: "/admin/settings/email",
    section: "settings",
    icon: SettingsIcon,
    parent: "settings",
    released: true,
  },
  settingsCategories: {
    path: "/admin/settings/categories",
    section: "settings",
    icon: SettingsIcon,
    parent: "settings",
    released: true,
  },
  settingsAreas: {
    path: "/admin/settings/areas",
    section: "settings",
    icon: SettingsIcon,
    parent: "settings",
    released: true,
  },
  settingsAdmins: {
    path: "/admin/settings/admins",
    section: "settings",
    icon: SettingsIcon,
    parent: "settings",
    released: true,
  },
  settingsAuditLog: {
    path: "/admin/settings/audit-log",
    section: "settings",
    icon: SettingsIcon,
    parent: "settings",
    released: true,
  },
  settingsLegal: {
    path: "/admin/settings/legal",
    section: "settings",
    icon: SettingsIcon,
    parent: "settings",
    released: true,
  },
  settingsIntegrations: {
    path: "/admin/settings/integrations",
    section: "settings",
    icon: SettingsIcon,
    parent: "settings",
    released: true,
  },
} as const satisfies Record<AdminPageKey, PageSpec>;

export type { AdminPageKey };

/** A page with a name of its own in the catalog (`admin.shell.pages.<key>`), unlike a detail page. */
export type AdminNamedPage = Exclude<AdminPageKey, `${string}Detail`>;

export const adminNavGroups: readonly AdminNavGroup[] = [
  "top",
  "operations",
  "users",
  "marketing",
  "bottom",
];

/** The sidebar's items of one group, in order. */
export function navItems(group: AdminNavGroup): AdminNamedPage[] {
  return (Object.keys(adminPages) as AdminPageKey[]).filter(
    (key): key is AdminNamedPage => (adminPages[key] as PageSpec).nav === group,
  );
}

/** The settings pages, in the order of the settings menu (Figma Admin/SettingsNav). */
export const settingsPages = (Object.keys(adminPages) as AdminPageKey[]).filter(
  (key): key is AdminNamedPage => (adminPages[key] as PageSpec).parent === "settings",
);

/** The page and the pages above it, nearest first: `sellerDetail`, `sellers`. */
export function lineage(key: AdminPageKey): AdminPageKey[] {
  const parent = (adminPages[key] as PageSpec).parent;
  return parent ? [key, ...lineage(parent)] : [key];
}

/** Whether a page is open: it and every page above it are released. */
export function isReleased(key: AdminPageKey): boolean {
  return lineage(key).every((each) => adminPages[each].released);
}

/** A page's address without the language, its parameters filled in: `adminHref("sellerDetail", { sellerId })`. */
export function adminHref(key: AdminPageKey, params: Record<string, string> = {}): string {
  return adminPages[key].path.replace(/\[(\w+)\]/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined) throw new Error(`adminHref(${key}) needs ${name}`);
    return encodeURIComponent(value);
  });
}

const patterns = (Object.keys(adminPages) as AdminPageKey[]).map((key) => ({
  key,
  pattern: new RegExp(`^${adminPages[key].path.replace(/\[\w+\]/g, "[^/]+")}/?$`),
}));

/** The page an address without the language shows, or nothing for an address no admin page answers. */
export function matchAdminPage(pathname: string): AdminPageKey | undefined {
  return patterns.find(({ pattern }) => pattern.test(pathname))?.key;
}
