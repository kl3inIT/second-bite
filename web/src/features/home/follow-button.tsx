"use client";

import { BellIcon, BellRingIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { keptIds } from "@/lib/kept-ids";

// Kept in this browser until following an announcement, with its email, arrives (SEC-11 step 6).
const followed = keptIds("secondbite.followed-announcements");

// The bell on an announcement's photograph (Figma K1b "nút theo dõi"). It asks first (Figma K1d "Báo bạn
// khi Nét Huế mở bán?"); once followed it rings, and pressing it again stops following.
export function FollowButton({
  announcementId,
  dish,
  seller,
  units,
  opensAt,
}: {
  announcementId: string;
  dish: string;
  seller: string;
  units: number;
  opensAt: string;
}) {
  const t = useTranslations("Home");
  const [asking, setAsking] = useState(false);
  const following = followed.useHas(announcementId);
  const Icon = following ? BellRingIcon : BellIcon;

  return (
    <Drawer open={asking} onOpenChange={setAsking}>
      <button
        type="button"
        aria-pressed={following}
        aria-label={t("follow", { dish })}
        onClick={() => (following ? followed.toggle(announcementId) : setAsking(true))}
        // A 28px bell with a 44px target around it.
        className="relative flex size-7 items-center justify-center rounded-full bg-card text-primary after:absolute after:-inset-2 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none aria-pressed:bg-primary aria-pressed:text-primary-foreground"
      >
        <Icon aria-hidden strokeWidth={1.8} className="size-4" />
      </button>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-5 pb-6">
          <div className="flex items-center justify-between gap-3">
            <DrawerTitle>{t("followTitle", { seller })}</DrawerTitle>
            <DrawerClose render={<Button variant="ghost" size="icon" aria-label={t("close")} />}>
              <XIcon aria-hidden className="size-5" />
            </DrawerClose>
          </div>
          <DrawerDescription>{t("followBody", { seller, units, time: opensAt })}</DrawerDescription>
          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              onClick={() => {
                followed.add(announcementId);
                setAsking(false);
              }}
            >
              {t("followOn")}
            </Button>
            <DrawerClose render={<Button size="lg" variant="secondary" />}>
              {t("followLater")}
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
