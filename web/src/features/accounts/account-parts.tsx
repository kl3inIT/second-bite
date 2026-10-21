import { ShieldCheckIcon, UserIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { RecordBody } from "@/lib/api/generated";

/** What an account is called in the admin's lists: its name, or its address until it has one. */
export function nameOf(account: Pick<RecordBody, "displayName" | "email">): string {
  return account.displayName || account.email;
}

/** Up to two letters for the account's avatar: the first and last words of its name, or its address. */
export function initialsOf(account: Pick<RecordBody, "displayName" | "email">): string {
  // A note in brackets, as "(HE182328)" or "(K18 HL)" after a student's name, is not part of the name, and
  // a word that starts with no letter gives none.
  const words = (account.displayName || account.email.split("@")[0])
    .replace(/[([{][^)\]}]*[)\]}]?/gu, " ")
    .split(/[\s._-]+/)
    .filter((word) => /^\p{L}/u.test(word));
  const letters = words.length > 1 ? [words[0], words.at(-1) ?? ""] : [words[0] ?? "?"];
  return letters
    .map((word) => word.charAt(0))
    .join("")
    .toLocaleUpperCase("vi");
}

export function AccountAvatar({
  account,
  size = "lg",
}: {
  account: Pick<RecordBody, "displayName" | "email">;
  size?: "lg" | "default";
}) {
  return (
    <Avatar size={size} aria-hidden>
      <AvatarFallback>{initialsOf(account)}</AvatarFallback>
    </Avatar>
  );
}

/** The account's role as a chip with its icon, never by colour alone. */
export function RoleBadge({ role }: { role: RecordBody["role"] }) {
  const t = useTranslations("Admin.accounts.role");
  const Icon = role === "admin" ? ShieldCheckIcon : UserIcon;

  return (
    <Badge variant={role === "admin" ? "info" : "neutral"}>
      <Icon data-icon="inline-start" aria-hidden />
      {t(role)}
    </Badge>
  );
}

/** When the account last signed in: the day over the time, or that it never has. */
export function SignedIn({ at }: { at?: string }) {
  const t = useTranslations("Admin.accounts");
  const format = useFormatter();

  if (!at) return <span className="text-muted-foreground">{t("neverSignedIn")}</span>;

  const date = new Date(at);
  return (
    <time dateTime={at} className="flex flex-col whitespace-nowrap">
      <span>{format.dateTime(date, "day")}</span>
      <span className="text-muted-foreground">{format.dateTime(date, "time")}</span>
    </time>
  );
}
