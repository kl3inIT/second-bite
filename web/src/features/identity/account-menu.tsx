"use client";

import { LogOutIcon, SettingsIcon, UserRoundIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouter } from "@/i18n/navigation";
import { signOut } from "@/lib/api/generated";

// The signed-in account's capsule on the header: the address it is signed in with, and sign-out, which ends
// the session on the server and leaves the person on the page they were reading (SEC-29 › What a person
// can do); before it, account settings, where the account is managed and deleted (SEC-37). Deletion is not
// offered here, beside sign-out.
export function AccountMenu({ email, displayName }: { email: string; displayName: string }) {
  const t = useTranslations("Account");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function signOutHere() {
    startTransition(async () => {
      try {
        await signOut();
      } finally {
        // A session that had already ended is signed out too; either way the page reads it again.
        router.refresh();
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        variant="header"
        aria-label={t("menu", { email })}
        className="group/account"
      >
        <span className="flex h-8 items-center gap-1.5 rounded-full border border-header-border bg-header-raised px-2.5 text-label-strong text-header-raised-foreground transition-colors group-hover/account:bg-secondary">
          {/* Google gives a name; an address signed in with the emailed code has none, and shows the person icon
              with the start of the address. */}
          {displayName ? (
            <Image src="/google-g.svg" alt="" width={16} height={16} unoptimized />
          ) : (
            <UserRoundIcon aria-hidden className="size-4" />
          )}
          <span className="hidden max-w-28 truncate sm:inline">
            {displayName || email.split("@")[0]}
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("signedInAs", { email })}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/account/settings" />}>
            <SettingsIcon aria-hidden />
            {t("settings")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={pending} onClick={signOutHere}>
            <LogOutIcon aria-hidden />
            {t("signOut")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
