import type { BadgeTone } from "../ui/badge";

export type AdminRole = "owner" | "operations" | "support" | "finance";
export const adminRoles: readonly AdminRole[] = ["owner", "operations", "support", "finance"];

export type AdminStatus = "active" | "disabled" | "invited";

/** The tone of an admin's status (Figma AD-CD3): working, turned off, or not yet in. */
export const adminStatusTone: Record<AdminStatus, BadgeTone> = {
  active: "success",
  disabled: "neutral",
  invited: "warning",
};

/** The two letters on an admin's avatar: "Minh Anh" is MA, "Đức Huy" ĐH, a single name its first two. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const letters =
    words.length === 1 ? words[0].slice(0, 2) : `${words[0][0]}${words[words.length - 1][0]}`;
  return letters.toLocaleUpperCase("vi");
}

const vietnamDay = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Ho_Chi_Minh",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * Whether an admin last signed in today, yesterday or before, in Vietnam's days (Figma AD-CD3: "Hôm nay, 09:12",
 * "Hôm qua, 21:05", "02/09/2026, 14:20").
 */
export function signInDay(at: Date, now: Date): "today" | "yesterday" | "earlier" {
  const day = vietnamDay.format(at);
  if (day === vietnamDay.format(now)) return "today";
  if (day === vietnamDay.format(new Date(now.getTime() - 24 * 60 * 60 * 1000))) return "yesterday";
  return "earlier";
}
