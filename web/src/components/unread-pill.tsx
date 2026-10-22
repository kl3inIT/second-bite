import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

// The count of messages not read yet (SEC-117; Figma D2b "Nhắn quán 2"): a round pill in the error colour, 18px
// high, after the words on a button or at the top right of an icon. It says nothing for none.
export function UnreadPill({ count, className }: { count: number; className?: string }) {
  const t = useTranslations("Chat");
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full bg-destructive px-1.25 font-display text-figure-sm text-destructive-foreground",
        className,
      )}
    >
      <span aria-hidden>{count}</span>
      <span className="sr-only">{t("unread", { count })}</span>
    </span>
  );
}
