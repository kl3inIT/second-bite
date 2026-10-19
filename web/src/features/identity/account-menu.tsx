"use client";

import { LogOutIcon, UserRoundIcon } from "lucide-react";
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
import { useRouter } from "@/i18n/navigation";
import { signOut } from "@/lib/api/generated";

// The signed-in account's capsule on the header: the address it is signed in with, and sign-out, which ends
// the session on the server and leaves the person on the page they were reading (SEC-29 › What a person
// can do).
export function AccountMenu({ email }: { email: string }) {
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
        <span className="flex size-8 items-center justify-center rounded-full border border-header-border bg-header-raised text-header-raised-foreground transition-colors group-hover/account:bg-secondary">
          <UserRoundIcon aria-hidden className="size-4" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("signedInAs", { email })}</DropdownMenuLabel>
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
