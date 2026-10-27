"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { usePathname, useRouter } from "@/i18n/navigation";
import { failureOf } from "@/lib/api/client";
import { changeDish } from "@/lib/api/generated";

// "Hiện lại" on a hidden dish (Figma Q3b): shows it again in the list a post is picked from, and the list says so.
// The store's home words it as its own row does ("Hiện món", Figma Q1b). A refusal is said in a toast, and the
// list is read again, as the dish may have changed meanwhile.
export function ShowDishButton({ dishId, label }: { dishId: string; label?: string }) {
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
          } catch (error) {
            const { detail } = failureOf(error);
            toast.add({ type: "error", title: detail ?? t("showFailed") });
          }
          router.refresh();
        })
      }
    >
      {pending && <Spinner data-icon="inline-start" />}
      {label ?? t("show")}
    </Button>
  );
}
