"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";

// The round back button over a photograph or the blue top (Figma K4, K4b, K5): back to the page the person
// came from, or to `fallback` when this page was opened on its own, such as from a shared link.
export function BackButton({ fallback }: { fallback: string }) {
  const t = useTranslations("TopBar");
  const router = useRouter();

  return (
    <Link
      href={fallback}
      aria-label={t("back")}
      onClick={(event) => {
        if (window.history.length > 1) {
          event.preventDefault();
          router.back();
        }
      }}
      className={buttonVariants({ variant: "float", size: "float" })}
    >
      <ChevronLeftIcon aria-hidden strokeWidth={2.4} />
    </Link>
  );
}
