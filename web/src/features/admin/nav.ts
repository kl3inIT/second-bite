import {
  HistoryIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  SettingsIcon,
  StoreIcon,
} from "lucide-react";

export type AdminNavItem = {
  key: "overview" | "sellers" | "audit" | "settings";
  href: "/admin/overview" | "/admin/sellers" | "/admin/audit" | "/admin/settings";
  icon: LucideIcon;
};

export type AdminNavGroup = {
  /** The group's name above its items; the first and the last group of Figma's sidebar have none. */
  key?: "operations";
  items: AdminNavItem[];
};

// The admin's menu, in the order of Figma's Admin/Sidebar (SEC-75 › Shell). An entry joins the menu with
// its screen, never before: an entry that opens nothing reads as a fault. The log is an entry of its own,
// not a page of the settings: it records far more than settings, and is read on its own.
export const adminNav: AdminNavGroup[] = [
  { items: [{ key: "overview", href: "/admin/overview", icon: LayoutDashboardIcon }] },
  { key: "operations", items: [{ key: "sellers", href: "/admin/sellers", icon: StoreIcon }] },
  {
    items: [
      { key: "audit", href: "/admin/audit", icon: HistoryIcon },
      { key: "settings", href: "/admin/settings", icon: SettingsIcon },
    ],
  },
];

/** Whether an entry is the page open: its own address or one under it. */
export function isWithin(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
