import { HistoryIcon, MailIcon, SettingsIcon, type LucideIcon } from "lucide-react";

export type AdminNavItem = {
  key: "audit" | "settings";
  href: "/admin/audit" | "/admin/settings";
  icon: LucideIcon;
};

export type AdminNavGroup = {
  /** The group's name above its items; the last group of Figma's sidebar has none. */
  key?: "users";
  items: AdminNavItem[];
};

// The admin's menu, in the order of Figma's Admin/Sidebar (SEC-75 › Shell). An entry joins the menu with
// its screen, never before: an entry that opens nothing reads as a fault. The log is an entry of its own,
// not a page of the settings: it records far more than settings, and is read on its own.
export const adminNav: AdminNavGroup[] = [
  {
    items: [
      { key: "audit", href: "/admin/audit", icon: HistoryIcon },
      { key: "settings", href: "/admin/settings", icon: SettingsIcon },
    ],
  },
];

/** The settings' pages, in the order of Figma's Admin/SettingsNav; a page joins with its screen. */
// Kept here, outside the client menu, so a server page can read it too.
export const settingsPages: Array<{
  key: "email";
  href: "/admin/settings/email";
  icon: LucideIcon;
}> = [{ key: "email", href: "/admin/settings/email", icon: MailIcon }];

/** Whether an entry is the page open: its own address or one under it. */
export function isWithin(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
