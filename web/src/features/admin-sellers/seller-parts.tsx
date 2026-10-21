import { BanIcon, CircleCheckIcon, CircleXIcon, ClockIcon, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { avatarTone, initials } from "@/features/offers/seller";
import type { AdminSellerBody } from "@/lib/api/generated";
import { cn } from "@/lib/utils";

import type { SellerStatus } from "./search-params";

/** Each status's tone and icon, on the badge and on its card (Figma AD-Q1): never colour alone. */
export const statusLook: Record<
  SellerStatus,
  { variant: "success" | "warning" | "danger" | "neutral"; icon: LucideIcon }
> = {
  active: { variant: "success", icon: CircleCheckIcon },
  pending: { variant: "warning", icon: ClockIcon },
  rejected: { variant: "neutral", icon: CircleXIcon },
  blocked: { variant: "danger", icon: BanIcon },
};

export function StatusBadge({ status }: { status: SellerStatus }) {
  const t = useTranslations("Admin.sellers.status");
  const { variant, icon: Icon } = statusLook[status];

  return (
    <Badge variant={variant}>
      <Icon data-icon="inline-start" aria-hidden />
      {t(status)}
    </Badge>
  );
}

const tones = {
  clay: "bg-avatar-clay",
  rose: "bg-avatar-rose",
  indigo: "bg-avatar-indigo",
  olive: "bg-avatar-olive",
} as const;

// A store's photo in its row (Figma AD-Q1 › TableCell, 36px): the photo the owner set, their initials on the
// store's colour until then. The name beside it says who it is, so it is hidden from assistive technology.
export function StoreThumb({
  seller,
  large = false,
}: {
  seller: Pick<AdminSellerBody, "id" | "name" | "photoId">;
  /** The store page's 48px, beside its name (Figma AD-Q3). */
  large?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden text-label-strong text-avatar-foreground",
        large ? "size-12 rounded-lg" : "size-9 rounded-md",
        !seller.photoId && tones[avatarTone(seller.id)],
      )}
    >
      {seller.photoId ? (
        <Image
          src={`/api/photos/${seller.photoId}/400.jpg`}
          alt=""
          fill
          sizes={large ? "48px" : "36px"}
          unoptimized
          className="bg-card object-cover"
        />
      ) : (
        initials(seller.name)
      )}
    </span>
  );
}
