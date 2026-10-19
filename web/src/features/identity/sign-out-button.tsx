"use client";

import { LogOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@/i18n/navigation";
import { signOut } from "@/lib/api/generated";

// Signing out from the account tab: the session ends on the server and the tab shows sign-in again.
export function SignOutButton() {
  const t = useTranslations("Account");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="lg"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            await signOut();
          } finally {
            router.refresh();
          }
        })
      }
    >
      {pending ? <Spinner data-icon="inline-start" /> : <LogOutIcon data-icon="inline-start" />}
      {t("signOut")}
    </Button>
  );
}
