import { HistoryIcon, type LucideIcon, MailIcon, ShieldUserIcon } from "lucide-react";

import { adminPages } from "./pages";

type SidebarPage =
  | "overview"
  | "sellers"
  | "orders"
  | "payments"
  | "issues"
  | "reviews"
  | "offers"
  | "accounts"
  | "promotions"
  | "content"
  | "notifications"
  | "sponsors"
  | "reports"
  | "settings";

export type AdminNavItem = {
  key: SidebarPage | "audit";
  href: (typeof adminPages)[SidebarPage]["path"] | "/admin/audit";
  icon: LucideIcon;
};

export type AdminNavGroup = {
  /** The group's name above its items; the first and the last group of Figma's sidebar have none. */
  key?: "operations" | "users" | "marketing";
  items: AdminNavItem[];
};

/** A page of the registry (pages.ts) as a menu entry, with the address and icon it declares there. */
function entry(key: SidebarPage): AdminNavItem {
  return { key, href: adminPages[key].path, icon: adminPages[key].icon };
}

// The admin's menu, in the order of Figma's Admin/Sidebar (SEC-75 › Shell), with every admin page (SEC-62): a
// page whose backend is not there yet opens its coming-soon screen (AdminPageGate), and its entry carries no mark.
// The log is an entry of its own, not a page of the settings: it records far more than settings, and is read on
// its own.
export const adminNav: AdminNavGroup[] = [
  { items: [entry("overview")] },
  {
    key: "operations",
    items: [
      entry("sellers"),
      entry("orders"),
      entry("payments"),
      entry("issues"),
      entry("reviews"),
      entry("offers"),
    ],
  },
  { key: "users", items: [entry("accounts")] },
  {
    key: "marketing",
    items: [entry("promotions"), entry("content"), entry("notifications"), entry("sponsors")],
  },
  {
    items: [
      entry("reports"),
      { key: "audit", href: "/admin/audit", icon: HistoryIcon },
      entry("settings"),
    ],
  },
];

/** The settings' pages, in the order of Figma's Admin/SettingsNav; an unreleased one opens its coming-soon screen. */
// Kept here, outside the client menu, so a server page can read it too.
export const settingsPages: Array<{
  key: "offers" | "email" | "admins" | "categories" | "areas" | "legal" | "integrations";
  href: string;
  icon: LucideIcon;
}> = [
  // The offer settings and the admins are SEC-62's pages.
  { key: "offers", href: adminPages.settingsOffers.path, icon: adminPages.settingsOffers.icon },
  { key: "email", href: adminPages.settingsEmail.path, icon: MailIcon },
  { key: "admins", href: adminPages.settingsAdmins.path, icon: ShieldUserIcon },
  {
    key: "categories",
    href: adminPages.settingsCategories.path,
    icon: adminPages.settingsCategories.icon,
  },
  { key: "areas", href: adminPages.settingsAreas.path, icon: adminPages.settingsAreas.icon },
  { key: "legal", href: adminPages.settingsLegal.path, icon: adminPages.settingsLegal.icon },
  {
    key: "integrations",
    href: adminPages.settingsIntegrations.path,
    icon: adminPages.settingsIntegrations.icon,
  },
];

/** Whether an entry is the page open: its own address or one under it. */
export function isWithin(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
