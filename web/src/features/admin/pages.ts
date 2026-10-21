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
   * and its sidebar or settings-menu item carries "Sắp có" (docs: admin-web-flow › Menu đầy đủ và trang Sắp ra
   * mắt). A page is open once its backend exists; the others are built in full and wait behind the flag.
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
    released: false,
  },
  orders: {
    path: "/admin/orders",
    section: "operations",
    icon: ReceiptIcon,
    nav: "operations",
    released: false,
  },
  orderDetail: {
    path: "/admin/orders/[orderId]",
    section: "operations",
    icon: ReceiptIcon,
    parent: "orders",
    released: false,
  },
  payments: {
    path: "/admin/payments",
    section: "operations",
    icon: WalletIcon,
    nav: "operations",
    released: false,
  },
  issues: {
    path: "/admin/issues",
    section: "operations",
    icon: LifeBuoyIcon,
    nav: "operations",
    released: false,
  },
  issueDetail: {
    path: "/admin/issues/[issueId]",
    section: "operations",
    icon: LifeBuoyIcon,
    parent: "issues",
    released: false,
  },
  reviews: {
    path: "/admin/reviews",
    section: "operations",
    icon: StarIcon,
    nav: "operations",
    released: false,
  },
  accounts: {
    path: "/admin/accounts",
    section: "users",
    icon: UsersIcon,
    nav: "users",
    released: false,
  },
  accountDetail: {
    path: "/admin/accounts/[accountId]",
    section: "users",
    icon: UsersIcon,
    parent: "accounts",
    released: false,
  },
  promotions: {
    path: "/admin/promotions",
    section: "marketing",
    icon: TicketPercentIcon,
    nav: "marketing",
    released: false,
  },
  content: {
    path: "/admin/content",
    section: "marketing",
    icon: ImageIcon,
    nav: "marketing",
    released: false,
  },
  bannerDetail: {
    path: "/admin/content/banners/[bannerId]",
    section: "marketing",
    icon: ImageIcon,
    parent: "content",
    released: false,
  },
  notifications: {
    path: "/admin/notifications",
    section: "marketing",
    icon: MegaphoneIcon,
    nav: "marketing",
    released: false,
  },
  notificationsCompose: {
    path: "/admin/notifications/new",
    section: "marketing",
    icon: MegaphoneIcon,
    parent: "notifications",
    released: false,
  },
  sponsors: {
    path: "/admin/sponsors",
    section: "marketing",
    icon: HandshakeIcon,
    nav: "marketing",
    released: false,
  },
  // "Quản trị / Báo cáo": the reports sit on their own at the sidebar's foot, outside Vận hành.
  reports: {
    path: "/admin/reports",
    section: "admin",
    icon: ChartColumnIcon,
    nav: "bottom",
    released: false,
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
    released: false,
  },
  settingsAreas: {
    path: "/admin/settings/areas",
    section: "settings",
    icon: SettingsIcon,
    parent: "settings",
    released: false,
  },
  settingsAdmins: {
    path: "/admin/settings/admins",
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
    released: false,
  },
  settingsIntegrations: {
    path: "/admin/settings/integrations",
    section: "settings",
    icon: SettingsIcon,
    parent: "settings",
    released: false,
  },
} as const satisfies Record<AdminPageKey, PageSpec>;

export type { AdminPageKey };

/** A page with a name of its own in the catalog (`admin.shell.pages.<key>`), unlike a detail page. */
export type AdminNamedPage = Exclude<AdminPageKey, `${string}Detail`>;

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
