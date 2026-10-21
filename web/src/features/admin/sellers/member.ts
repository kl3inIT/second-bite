import type { MemberBody } from "@/lib/api/generated";

import type { BadgeTone } from "./seller-list";

/**
 * A store's member as the admin shows it. `awaitingSignIn` is SEC-64's: the owner of a store an admin opened, given
 * by address, holds the role only once that address signs in with its code (SEC-39). `GET …/members` does not
 * give it yet, so no member shows "Chờ đăng nhập" until it does.
 */
export type AdminMember = MemberBody & { awaitingSignIn?: boolean };

/** Two letters from the start of an address: "chu.quan@…" is "CQ", "lan@…" is "LA". */
export function initialsOf(email: string): string {
  const words = email
    .split("@")[0]
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
  const letters = words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}

/** "Chủ cửa hàng" reads as a plain fact in the Badge, "Nhân viên" as nothing to act on. */
export const roleTone: Record<MemberBody["role"], BadgeTone> = {
  owner: "info",
  staff: "neutral",
};
