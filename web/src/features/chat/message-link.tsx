import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { UnreadPill } from "@/components/unread-pill";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * "Nhắn quán" on the customer's order page and "Nhắn khách" on the seller's (Figma D2b, D4, Q5j): a button to the
 * chat with the count of messages not read yet after its words. `className` lays it out, as a button's does.
 */
export function MessageLink({
  to,
  view = false,
  href,
  unread,
  variant,
  size = "default",
  className,
}: {
  to: "store" | "customer";
  /** The chat can only be read, so the button says so instead of "Nhắn …". */
  view?: boolean;
  href: string;
  unread: number | undefined;
  variant: "secondary" | "outline";
  size?: "default" | "lg";
  className?: string;
}) {
  const t = useTranslations("Chat");

  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)}>
      {t(view ? "viewMessages" : to === "store" ? "messageStore" : "messageCustomer")}
      <UnreadPill count={unread ?? 0} />
    </Link>
  );
}
