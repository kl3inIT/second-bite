import { ClockIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { AdminBadge } from "@/features/admin/ui/badge";
import type { MemberBody } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

/**
 * A store's member as the admin shows it. `awaitingSignIn` is SEC-64's: the owner of a store an admin opened, given
 * by address, holds the role only once that address signs in with its code (SEC-39). `GET …/members` does not
 * give it yet, so no member shows "Chờ đăng nhập" until it does.
 */
export type AdminMember = MemberBody & { awaitingSignIn?: boolean };

/** "Chờ đăng nhập" beside a member who has not signed in yet (Figma AD-OS3). */
export function AwaitingSignInBadge({ member }: { member: AdminMember }) {
  const t = useTranslations("admin.sellers.detail.members");
  if (!member.awaitingSignIn) return null;
  return (
    <AdminBadge tone="neutral" icon={ClockIcon}>
      {t("awaitingSignIn")}
    </AdminBadge>
  );
}

/** Two letters from the start of an address: "chu.quan@…" is "CQ", "lan@…" is "LA". */
export function initialsOf(email: string): string {
  const words = email
    .split("@")[0]
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
  const letters = words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}

/** A member's initials in a circle, the owner's in full colour (Figma "Avatar · CQ"). */
export function MemberAvatar({ member }: { member: MemberBody }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full text-label-strong",
        member.role === "owner"
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground",
      )}
    >
      {initialsOf(member.email)}
    </span>
  );
}

/** "Chủ cửa hàng" or "Nhân viên". */
export function RoleBadge({ role }: { role: MemberBody["role"] }) {
  const t = useTranslations("admin.sellers.detail.roles");
  return (
    <AdminBadge tone={role === "owner" ? "info" : "neutral"} icon={null}>
      {t(role)}
    </AdminBadge>
  );
}
