"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePathname, useRouter } from "@/i18n/navigation";
import { changeDish } from "@/lib/api/generated";

// "Hiện lại" on a hidden dish (Figma Q3b): shows it again in the list a post is picked from, and the list says so.
export function ShowDishButton({ dishId }: { dishId: string }) {
  const t = useTranslations("StoreCatalog");
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      className="max-md:flex-1"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            await changeDish({ path: { dishId }, body: { hidden: false } });
            router.replace({ pathname, query: { notice: "shown" } });
            router.refresh();
          } catch {
            router.refresh();
          }
        })
      }
    >
      {pending && <Spinner data-icon="inline-start" />}
      {t("show")}
    </Button>
  );
}
