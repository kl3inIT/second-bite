"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "@/lib/utils";

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  // Second Bite: "seller" (36px) and "seller-xs" (18px), white-ringed over a photograph or a card.
  size?: "default" | "sm" | "lg" | "seller" | "seller-xs";
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=seller]:size-9 data-[size=seller]:border-2 data-[size=seller]:border-card data-[size=seller]:after:hidden data-[size=seller-xs]:size-4.5 data-[size=seller-xs]:border data-[size=seller-xs]:border-card data-[size=seller-xs]:leading-none data-[size=seller-xs]:after:hidden data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full rounded-full object-cover", className)}
      {...props}
    />
  );
}

// Second Bite (DESIGN.md › Seller avatars): a seller without a photo gets their initials on one of four
// colours.
const avatarFallbackTones = {
  muted: "bg-muted text-muted-foreground",
  clay: "bg-avatar-clay text-avatar-foreground",
  rose: "bg-avatar-rose text-avatar-foreground",
  indigo: "bg-avatar-indigo text-avatar-foreground",
  olive: "bg-avatar-olive text-avatar-foreground",
  // Second Bite: the admin's own initials at the sidebar's foot, in lime (Figma Avatar/QT).
  fresh: "bg-fresh text-fresh-foreground",
} as const;

function AvatarFallback({
  className,
  tone = "muted",
  ...props
}: AvatarPrimitive.Fallback.Props & { tone?: keyof typeof avatarFallbackTones }) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full text-label-strong",
        avatarFallbackTones[tone],
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge };
