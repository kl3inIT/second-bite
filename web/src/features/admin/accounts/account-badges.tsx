import { useTranslations } from "next-intl";

import { initials } from "@/features/offers/seller";
import { cn } from "@/lib/utils";

import { AdminBadge } from "../ui/badge";
import {
  type AccountOrderStatus,
  type AccountRole,
  type AccountStatus,
  orderLook,
  roleLook,
  statusLook,
} from "./account";

/** An account's role in words (Figma AD-TK1): "Khách", "Chủ cửa hàng", "Nhân viên", "Quản trị". */
export function AccountRoleBadge({ role }: { role: AccountRole }) {
  const t = useTranslations("admin.accounts.role");
  const { tone, icon } = roleLook(role);
  return (
    <AdminBadge tone={tone} icon={icon}>
      {t(role)}
    </AdminBadge>
  );
}

/** An account's status with its icon: "Hoạt động", "Đã khoá". */
export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  const t = useTranslations("admin.accounts.status");
  const { tone, icon } = statusLook(status);
  return (
    <AdminBadge tone={tone} icon={icon}>
      {t(status)}
    </AdminBadge>
  );
}

/** An order's status in the account's recent orders (Figma AD-TK2). */
export function AccountOrderBadge({ status }: { status: AccountOrderStatus }) {
  const t = useTranslations("admin.accounts.orderStatus");
  const { tone, icon } = orderLook(status);
  return (
    <AdminBadge tone={tone} icon={icon}>
      {t(status)}
    </AdminBadge>
  );
}

/** A person's initials on the sky wash, 36px in a row (Figma AD-TK1) or 64px at the head of their page. */
export function AccountAvatar({ name, size = "row" }: { name: string; size?: "row" | "page" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-secondary text-primary",
        size === "row" ? "size-9 text-label-strong" : "size-16 text-headline",
      )}
    >
      {initials(name)}
    </span>
  );
}
