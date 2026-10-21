// The store's four tabs (Figma Q1, Q2, Q3, Q5): the header carries them on a wide screen, the bottom bar on a phone.
export const storeTabs = [
  { key: "home", path: "" },
  { key: "posts", path: "/offers" },
  { key: "catalog", path: "/catalog" },
  { key: "orders", path: "/orders" },
] as const;

/** A tab is open on its own address and below it; the home is open on its own address only. */
export function isTabOpen(pathname: string, base: string, path: string): boolean {
  const href = `${base}${path}`;
  return path === "" ? pathname === href : pathname.startsWith(href);
}
