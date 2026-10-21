import { SettingsIcon, UsersRoundIcon, type LucideIcon } from "lucide-react";

export type AdminNavItem = {
  key: "accounts" | "settings";
  href: "/admin/accounts" | "/admin/settings";
  icon: LucideIcon;
};

export type AdminNavGroup = {
  /** The group's name above its items; the last group of Figma's sidebar has none. */
  key?: "users";
  items: AdminNavItem[];
};

// The admin's menu, in the order of Figma's Admin/Sidebar (SEC-75 › Shell). An entry joins the menu with
// its screen, never before: an entry that opens nothing reads as a fault.
export const adminNav: AdminNavGroup[] = [
  {
    key: "users",
    items: [{ key: "accounts", href: "/admin/accounts", icon: UsersRoundIcon }],
  },
  { items: [{ key: "settings", href: "/admin/settings", icon: SettingsIcon }] },
];

/** Whether an entry is the page open: its own address or one under it. */
export function isWithin(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
